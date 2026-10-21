# API Operations Runbook

This runbook documents the operational API surface that backs the Vedam Free
Course app. It is verified against the route handlers under `src/app/api`.

## Architecture at a glance

- Next.js App Router API routes live in `src/app/api/**/route.ts`.
- Supabase stores users, UTM records, course content, progress, and certificate
  tracking.
- Streamable and Vimeo are used for video ingestion paths.
- Nodemailer sends direct email and generated certificate attachments.
- `/api-docs` renders a generated Swagger UI from `/api/swagger`, but the
  generated schemas are generic. Use this runbook and route source for exact
  payload contracts.

## Authentication boundaries

| Surface | Current protection | Notes |
| --- | --- | --- |
| `/api-docs`, `/api/swagger` | HTTP Basic Auth via `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Middleware and `requireAdminAuth` both enforce this. Defaults are `admin` / `admin123` if env vars are missing. |
| `/analytics`, `/admin`, `/upload` pages | Client-side credential checks via `NEXT_PUBLIC_ADMIN_USERNAME` / `NEXT_PUBLIC_ADMIN_PASSWORD` | These are UI gates only. The underlying admin API routes do not enforce server-side auth in the current code. |
| `/api/admin/*`, `/api/users`, `/api/content`, `/api/progress` | No route-level auth | Keep deployment access and Supabase policies aligned with the intended audience. |
| Streamable upload | Streamable username/password are posted from the upload page to `/api/upload` | The current UI reads them from `NEXT_PUBLIC_STREAMABLE_USERNAME` and `NEXT_PUBLIC_STREAMABLE_PASSWORD`, so they are browser-visible. |

## Environment variables

| Variable | Used by | Required for |
| --- | --- | --- |
| `SUPABASE_URL` | `src/lib/supabase.ts`, `src/lib/streamableDB/supabaseServerClient.ts` | All Supabase-backed APIs |
| `SUPABASE_ANON_KEY` | `src/lib/supabase.ts` | Public Supabase client APIs |
| `SUPABASE_SERVICE_ROLE_KEY` | `createSupabaseServerClient` | Server-side content/video inserts and `/api/videos` GET |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | `middleware.ts`, `src/lib/adminAuth.ts` | Basic Auth for Swagger docs |
| `NEXT_PUBLIC_ADMIN_USERNAME`, `NEXT_PUBLIC_ADMIN_PASSWORD` | `/analytics`, `/admin`, `/upload` pages | Client-side admin page access |
| `NEXT_PUBLIC_STREAMABLE_USERNAME`, `NEXT_PUBLIC_STREAMABLE_PASSWORD` | `/upload` page | Streamable upload flow |
| `NEXT_PUBLIC_PUBLIC_GDRIVE` | `/upload` page | Set to `google` to use Google Drive link entry instead of Streamable file upload |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | `sendEmailService` | Direct email and certificate delivery |
| `VIMEO_CLIENT_ID`, `VIMEO_CLIENT_SECRET`, `VIMEO_ACCESS_TOKEN` | `/api/upload/vimeo` | Vimeo upload endpoint |
| `MONGODB_URI` | `/api/test` | MongoDB test endpoint |
| `NEXT_PUBLIC_API_URL` | `generateAutoSwagger` | Swagger server URL display |

## UTM capture and user registration

### Visitor capture

`UTMCaptureClient` runs on the client, creates a `visitor_token` cookie for 30
days, stores incoming `utm_source`, `utm_medium`, and `utm_campaign` cookies,
and posts the visitor data to `POST /api/utm`.

`POST /api/utm`

```json
{
  "visitor_token": "uuid",
  "utm_source": "Codesprint",
  "utm_medium": "Banner1",
  "utm_campaign": "Banner1_campusimage"
}
```

Constraints:

- `visitor_token` is required.
- Existing `visitor_token` records are treated as successful no-ops.
- Missing UTM values are stored in the combined `utm` field as
  `direct_none_none`; the separate `source`, `medium`, and `campaign` columns
  are stored as `null` when omitted.

### User registration

`POST /api/users`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "mobile": "9876543210",
  "passout_year": "2026",
  "stream": "CSE"
}
```

Constraints:

- The request must include the `visitor_token` cookie created by UTM capture.
- `name`, `email`, `mobile`, `passout_year`, and `stream` are required.
- Existing users are deduplicated by `mobile` and returned with
  `message: "User already exists"`.
- New users update the matching `utm-data` row with `isVerified: true` and
  `phoneNumber` parsed from `mobile`.

`GET /api/users` returns all users ordered by `created_at` ascending.

## Course content, progress, and certificates

### Content

`GET /api/content` returns content grouped by `topic`, ordered by topic and
creation date. Rows with `topic = null` are excluded.

`POST /api/content`

```json
{
  "title": "Intro to JavaScript",
  "topic": "JavaScript Fundamentals",
  "streamableUrl": "https://drive.google.com/file/d/...",
  "embedCode": "<iframe ...>",
  "shortcode": "js-intro-1"
}
```

Constraints:

- The current guard only rejects the request when all of `title`, `topic`,
  `streamableUrl`, and `shortcode` are missing.
- The Google Drive upload UI requires a link and shortcode before it calls this
  endpoint; title and topic are optional in that UI.
- Inserts use the Supabase service-role client and add `created_at` server-side.

### Progress

`GET /api/progress?user_id=<id>` returns a user's progress rows and related
content identifiers.

`POST /api/progress`

```json
{
  "user_id": "user-id",
  "content_id": "content-id",
  "is_complete": true
}
```

Behavior:

- `user_id`, `content_id`, and a boolean `is_complete` are required.
- Existing progress for the same user/content pair is updated; otherwise a new
  row is inserted.
- When `is_complete` is `true`, the route checks whether every video in the
  video's topic is complete for the user.
- If the topic is complete and no `certificates_sent` row exists, the response
  includes `certificateRequired: true` and `certificateData`.

Example certificate-trigger response:

```json
{
  "data": {
    "user_id": "user-id",
    "content_id": "content-id",
    "is_complete": true
  },
  "certificateRequired": true,
  "certificateData": {
    "studentName": "Ada Lovelace",
    "subjectName": "JavaScript Fundamentals",
    "studentEmail": "ada@example.com"
  }
}
```

Operational notes:

- `certificates_sent` is used to prevent duplicate certificates by
  `user_id + topic`.
- The route records `certificates_sent` before the browser generates and sends
  the certificate email. If a student reports a missing certificate after seeing
  a generation message, inspect that table before attempting a retry.
- If `certificates_sent` is missing, duplicate checks and tracking are skipped,
  and the progress update still succeeds.

### Certificate email

`POST /api/send-certificate`

```json
{
  "studentName": "Ada Lovelace",
  "subjectName": "JavaScript Fundamentals",
  "studentEmail": "ada@example.com",
  "jpgBase64": "base64-encoded-jpg"
}
```

Constraints:

- All four fields are required.
- `studentEmail` must match the route's basic email-format regex.
- `jpgBase64` may include a `data:image/...;base64,` prefix; the route strips it
  before creating the JPG attachment.
- `sendEmailService` verifies the SMTP connection before sending. It currently
  sets `secure: false`, so port `587`/STARTTLS-style SMTP settings are the
  safest default unless the service is changed.

## Admin reporting APIs

These routes are read by the `/admin` page after the page-level admin check:

| Route | Purpose | Response highlights |
| --- | --- | --- |
| `GET /api/admin/topics` | List unique non-null topics from `content` | `{ data: { topics: string[] } }` |
| `GET /api/admin/topic-progress?topic=<topic>` | Per-student completion for one topic | Completed videos, total topic videos, percentage, last completion, status |
| `GET /api/admin/all-students-progress` | Per-student completion across all content | Completed videos, total videos, percentage, last completion, status |
| `GET /api/admin/completed-students` | Students who completed all content | Completed students list and aggregate completion stats |

Completion status is derived from `progress.is_complete = true`. Topic progress
sorts by completion percentage descending, then student name.

## Analytics APIs

`GET /api/analytics` reads all `utm-data` rows and returns:

- visitor totals and verified-user totals;
- conversion rate;
- top 10 sources, campaigns, and mediums;
- last 30 daily visitor counts;
- last 30 verification trend entries;
- raw `usersData` records used by analytics filters.

The empty-state response returns zero counts and empty arrays for all chart
inputs.

## Video ingestion APIs

### Streamable upload

`POST /api/upload` accepts multipart form data:

| Field | Required | Notes |
| --- | --- | --- |
| `username` | Yes | Streamable username |
| `password` | Yes | Streamable password |
| `file` | Yes | Video file |
| `title` | Yes | Saved to `content.title` |
| `topic` | No | Defaults to `default` if omitted after processing |

Constraints:

- Server-side max file size is 500 MB.
- Allowed formats are MP4, AVI, MOV, WMV, FLV, and WebM by MIME type or file
  extension.
- The route polls Streamable up to 20 times with a 3 second interval.
- A successful Streamable processing result is saved to the `content` table with
  shortcode, topic, title, Streamable URL, CDN URL, embed code, and thumbnail.

### Streamable status and stored videos

- `POST /api/videos` checks `https://api.streamable.com/videos/{shortcode}`
  using Basic Auth credentials from the request body. It returns `404` when
  Streamable responds with an error or status `3`.
- `GET /api/videos` reads from the `streamable` Supabase table, not the
  `content` table used by `/api/content` and `/api/upload`.

### Vimeo upload

`POST /api/upload/vimeo` accepts a multipart `file` field, writes it to the OS
temp directory, uploads it to Vimeo with public view/embed privacy, removes the
temp file, and returns:

```json
{
  "url": "https://vimeo.com/<video-id>"
}
```

The route throws during module initialization if any Vimeo environment variable
is missing.

## Email and test endpoints

- `POST /api/send-email` requires `{ "to", "subject", "message" }` and sends
  `message` as HTML through the shared SMTP service.
- `GET /api/test` and `POST /api/test` use MongoDB database `4b7734516ff9` and
  collection `users`. The source comment marks this as a MongoDB testing route.

## Troubleshooting checklist

### Swagger docs return `401`

- Confirm the request includes Basic Auth credentials.
- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- Remember that missing env vars fall back to `admin` / `admin123`.

### Admin dashboard numbers look wrong

- Verify `content.topic` is populated; `GET /api/content` excludes null topics.
- Check that progress rows use `is_complete = true`.
- For topic-specific reports, confirm the topic string matches `content.topic`
  exactly.

### Certificates are not sent

- Confirm the student has an email in `users`.
- Confirm every content row for the topic has a completed progress row for that
  user.
- Inspect `certificates_sent` for an existing `user_id + topic` row.
- Check browser console logs from `CertificateGenerator` and server logs from
  `/api/send-certificate`.
- Verify SMTP env vars and use a port compatible with `secure: false`.

### Streamable upload times out

- Confirm file size and format pass server validation.
- Check Streamable credentials and service status.
- The server waits about 60 seconds total (`20 * 3s`) before returning
  `Processing timed out. Please try again later.`

### UTM conversion is not attributed

- Confirm `UTMCaptureClient` created the `visitor_token` cookie before
  registration.
- Check that the registration request included that cookie.
- Verify the matching `utm-data.visitor_token` row exists before `POST /api/users`
  tries to mark it verified.
