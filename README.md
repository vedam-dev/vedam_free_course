# Vedam Free Course

A Next.js application for managing and delivering free educational content with UTM tracking and analytics.

## Features

- **Video Content Management**: Upload and manage video content using Streamable
- **User Authentication**: OTP-based authentication system
- **UTM Tracking**: Comprehensive UTM parameter tracking and analytics
- **Progress Tracking**: Track user progress through video content
- **Analytics Dashboard**: Real-time analytics for UTM data and user engagement
- **Responsive Design**: Mobile-first responsive design using Material-UI

## Analytics Dashboard

The analytics dashboard (`/analytics`) provides comprehensive insights into your UTM campaign performance:

### Key Metrics
- **Total Visitors**: Total number of unique visitors
- **Verified Users**: Number of users who completed registration
- **Conversion Rate**: Percentage of visitors who became verified users
- **Traffic Sources**: Number of different traffic sources

### Charts and Visualizations
- **Traffic Sources**: Doughnut chart showing distribution by source
- **Campaign Performance**: Bar chart of top performing campaigns
- **Traffic Mediums**: Doughnut chart showing distribution by medium
- **Daily Visitors Trend**: Line chart showing visitor trends over time
- **Verification Trend**: Line chart comparing total vs verified users over time

### Access
- Navigate to `/analytics` when logged in
- Click the "Analytics" button in the header (visible when logged in)
- **Admin Authentication Required**: You'll need to enter admin credentials to access the dashboard
- Data refreshes automatically and can be manually refreshed
- Use the logout button to sign out of the analytics dashboard

## API Endpoints

### UTM Analytics
- `GET /api/analytics` - Fetch processed UTM analytics data
- `POST /api/utm` - Capture UTM parameters from visitors

### User Management
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user and update UTM data

### Content Management
- `GET /api/content` - Fetch grouped video content
- `POST /api/content` - Add new video content
- `POST /api/upload` - Upload video to Streamable

### Progress Tracking
- `GET /api/progress` - Fetch user progress
- `POST /api/progress` - Update user progress

## Database Schema

### UTM Data Table (`utm-data`)
- `visitor_token`: Unique identifier for each visitor
- `utm`: Combined UTM string
- `source`: UTM source parameter
- `medium`: UTM medium parameter
- `campaign`: UTM campaign parameter
- `isVerified`: Whether user completed registration
- `phoneNumber`: User's phone number (if verified)
- `created_at`: Timestamp of first visit

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure Supabase:
   - Set `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Create the required tables in your Supabase project

4. Configure Admin Authentication:
   - Set `NEXT_PUBLIC_ADMIN_USERNAME` and `NEXT_PUBLIC_ADMIN_PASSWORD` for analytics access

5. Run the development server:
   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t vedam-course .

# Run the container
docker run -p 3000:3000 --env-file .env vedam-course
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.


