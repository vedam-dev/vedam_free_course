# QA Regression Testing Guide - Vedam Free Course

## Vedam Free Course Platform - Complete Testing Checklist

This document provides comprehensive regression testing steps for the Vedam Free Course platform. Follow these steps to ensure all features are working correctly after updates or deployments.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Authentication & OTP System](#authentication--otp-system)
3. [Navigation & UI](#navigation--ui)
4. [Video Content Management](#video-content-management)
5. [UTM Tracking](#utm-tracking)
6. [Progress Tracking](#progress-tracking)
7. [Analytics Dashboard](#analytics-dashboard)
8. [API Endpoints](#api-endpoints)
9. [Data Accuracy](#data-accuracy)
10. [Performance & Loading](#performance--loading)
11. [Browser Compatibility](#browser-compatibility)

---

## Prerequisites

### Environment Setup
- [ ] Application is running on correct environment
  - [ ] Development: localhost:3000
  - [ ] Production: [Production URL]
- [ ] All environment variables are properly configured
  - [ ] `SUPABASE_URL` is set
  - [ ] `SUPABASE_ANON_KEY` is set
  - [ ] `NEXT_PUBLIC_ADMIN_USERNAME` is set
  - [ ] `NEXT_PUBLIC_ADMIN_PASSWORD` is set
- [ ] Supabase database is accessible
- [ ] Required tables exist in Supabase (`utm-data`, content, progress)

### Test Data Requirements
- [ ] Sample video content uploaded to Streamable
- [ ] Test user accounts with phone numbers
- [ ] UTM data records in database
- [ ] User progress records
- [ ] Various UTM campaign parameters for testing

### Test Accounts
- [ ] Test phone numbers for OTP testing
- [ ] Admin credentials for analytics access
- [ ] Multiple user accounts at different progress levels

### Browser DevTools Setup
- [ ] Network tab ready for API monitoring
- [ ] Console ready for error tracking
- [ ] Application tab for localStorage/cookies inspection
- [ ] Responsive design mode for mobile testing

---

## Authentication & OTP System

### Initial Page Access
- [ ] Navigate to application homepage
- [ ] Verify landing page displays correctly
- [ ] Verify branding/logo visible
- [ ] Verify call-to-action buttons present

### OTP-Based Authentication Flow

#### Request OTP
- [ ] Locate phone number input field
- [ ] Verify country code selector (if available)
- [ ] Enter valid phone number
- [ ] Test phone number validation:
  - [ ] Empty field
  - [ ] Invalid format
  - [ ] Incorrect length
  - [ ] Special characters
- [ ] Click "Send OTP" or similar button
- [ ] Verify loading indicator appears
- [ ] Verify success message displays
- [ ] Verify OTP sent notification
- [ ] Verify input field becomes disabled or OTP input appears

#### Enter OTP
- [ ] Verify OTP input field appears
- [ ] Verify OTP input accepts 4-6 digit code (based on implementation)
- [ ] Test OTP validation:
  - [ ] Empty OTP
  - [ ] Incorrect OTP
  - [ ] Expired OTP
  - [ ] Already used OTP
- [ ] Enter valid OTP
- [ ] Click "Verify" or "Submit" button
- [ ] Verify loading indicator during verification
- [ ] Verify successful authentication
- [ ] Verify redirect to content page or dashboard

#### Valid OTP Test
- [ ] Request OTP for test phone number
- [ ] Check phone/SMS for OTP code
- [ ] Enter received OTP
- [ ] Verify successful login
- [ ] Verify user session is created
- [ ] Verify phone number is stored (check localStorage/cookies)
- [ ] Verify UTM data is updated with `isVerified: true`

#### Invalid OTP Test
- [ ] Enter incorrect OTP
- [ ] Verify error message displays: "Invalid OTP" or similar
- [ ] Verify user remains on verification page
- [ ] Verify OTP input is cleared or highlighted
- [ ] Verify retry option available

#### Resend OTP
- [ ] Wait for timer countdown (if implemented)
- [ ] Click "Resend OTP" button
- [ ] Verify new OTP is sent
- [ ] Verify success notification
- [ ] Verify timer resets
- [ ] Test rate limiting (multiple rapid resends)

### Session Management
- [ ] After successful authentication, refresh page
  - [ ] Verify session persists
  - [ ] Verify user remains logged in
- [ ] Close browser and reopen
  - [ ] Navigate to application
  - [ ] Verify session behavior (should remain logged in or require re-authentication based on design)
- [ ] Check session token storage
  - [ ] Verify in localStorage or cookies
  - [ ] Verify token format and expiry

### Logout (if applicable)
- [ ] Locate logout option
- [ ] Click logout
- [ ] Verify session is cleared
- [ ] Verify redirect to login/home page
- [ ] Try accessing protected content
  - [ ] Verify requires re-authentication

---

## Navigation & UI

### Header Navigation
- [ ] Verify header appears on all pages
- [ ] Verify application logo/branding visible
- [ ] Verify navigation is responsive

#### When Not Logged In
- [ ] Verify "Login" or "Sign Up" button visible
- [ ] Verify limited navigation options

#### When Logged In
- [ ] Verify user indicator (phone number or user icon)
- [ ] Verify "Analytics" button visible (in header)
- [ ] Click "Analytics" button
  - [ ] Verify navigation to `/analytics` page
  - [ ] Verify admin authentication prompt appears

### Main Navigation
- [ ] Verify navigation menu displays
- [ ] Test navigation to:
  - [ ] Home/Dashboard
  - [ ] Video Content
  - [ ] Progress (if separate page)
  - [ ] Analytics (requires admin auth)

### Responsive Navigation
- [ ] Test on mobile viewport
- [ ] Verify hamburger menu appears (if applicable)
- [ ] Click hamburger menu
- [ ] Verify menu drawer opens
- [ ] Test navigation from mobile menu
- [ ] Close menu and verify it closes properly

### Breadcrumbs (if applicable)
- [ ] Navigate to nested content pages
- [ ] Verify breadcrumb trail displays
- [ ] Click breadcrumb links
- [ ] Verify navigation works correctly

### Loading States
- [ ] Navigate between pages
- [ ] Verify loading indicators appear during:
  - [ ] Page transitions
  - [ ] Data fetching
  - [ ] Video loading
- [ ] Verify loading indicators have proper styling

---

## Video Content Management

### Video Content List
- [ ] Navigate to video content page
- [ ] Verify list of videos displays
- [ ] Verify videos are grouped correctly
- [ ] For each video card/item, verify:
  - [ ] Video title
  - [ ] Thumbnail (if available)
  - [ ] Duration (if available)
  - [ ] Group/category label
  - [ ] Progress indicator (if user has started)

### Content Grouping
- [ ] Verify content is organized by groups
- [ ] Verify group headers/sections display
- [ ] Navigate between different groups
- [ ] Verify group-based navigation works

### Video Player

#### Load Video
- [ ] Click on a video to watch
- [ ] Verify video player page loads
- [ ] Verify Streamable video player embeds correctly
- [ ] Verify video title displays above/below player
- [ ] Verify video description (if available)

#### Playback Controls
- [ ] Click play button
  - [ ] Verify video starts playing
- [ ] Click pause button
  - [ ] Verify video pauses
- [ ] Test seek/scrub functionality
  - [ ] Drag progress bar
  - [ ] Verify video seeks to correct position
- [ ] Test volume controls
  - [ ] Adjust volume slider
  - [ ] Click mute/unmute
  - [ ] Verify audio changes accordingly
- [ ] Test fullscreen mode
  - [ ] Click fullscreen button
  - [ ] Verify video enters fullscreen
  - [ ] Exit fullscreen
  - [ ] Verify video returns to normal view
- [ ] Test playback speed (if available)
  - [ ] Change speed (0.5x, 1x, 1.5x, 2x)
  - [ ] Verify playback speed changes

#### Video Quality
- [ ] Test video loads at appropriate quality
- [ ] Test on different network speeds
  - [ ] Fast connection
  - [ ] Slow connection (throttle in DevTools)
- [ ] Verify adaptive streaming works (if implemented)
- [ ] Verify buffering indicators appear when needed

#### Video Completion
- [ ] Watch video to completion
- [ ] Verify progress is automatically tracked
- [ ] Verify completion status updates
- [ ] Verify "Mark as Complete" indicator (if manual)
- [ ] Return to content list
  - [ ] Verify video shows as completed
  - [ ] Verify progress percentage updates

### Content Upload (Admin Function)

#### Access Upload Feature
- [ ] Navigate to upload page (if available)
- [ ] Verify only admins can access (if restricted)

#### Upload Video
- [ ] Click "Upload Video" button
- [ ] Verify upload form appears
- [ ] **Fill Video Details**
  - [ ] Video title (required)
  - [ ] Description
  - [ ] Group/Category
  - [ ] Order/Sequence number
- [ ] **Select Video File**
  - [ ] Click "Choose File" or drag-and-drop area
  - [ ] Select video file from device
  - [ ] Test file type validation (MP4, MOV, etc.)
  - [ ] Test file size limits
- [ ] Click "Upload" button
- [ ] Verify upload progress indicator
- [ ] Verify upload to Streamable completes
- [ ] Verify success message
- [ ] Verify video appears in content list
- [ ] Verify Streamable URL is stored in database

#### Edit Video Details
- [ ] Select existing video
- [ ] Click "Edit" option
- [ ] Modify video details:
  - [ ] Change title
  - [ ] Update description
  - [ ] Change group
  - [ ] Reorder sequence
- [ ] Save changes
- [ ] Verify success message
- [ ] Verify changes reflected immediately

#### Delete Video (if available)
- [ ] Select video to delete
- [ ] Click "Delete" option
- [ ] Verify confirmation dialog appears
- [ ] Confirm deletion
- [ ] Verify video removed from list
- [ ] Verify video removed from database
- [ ] Verify Streamable video handling (manual cleanup may be needed)

---

## UTM Tracking

### Initial UTM Capture

#### Access with UTM Parameters
- [ ] Create test URL with UTM parameters:
  - [ ] Example: `?utm_source=facebook&utm_medium=cpc&utm_campaign=spring_sale`
- [ ] Access application using UTM URL
- [ ] Open browser DevTools → Network tab
- [ ] Verify POST request to `/api/utm`
- [ ] Verify UTM parameters are sent in request body:
  - [ ] `source`
  - [ ] `medium`
  - [ ] `campaign`
- [ ] Verify `visitor_token` is generated and stored
- [ ] Check localStorage/cookies for `visitor_token`

#### UTM Data Storage
- [ ] Verify UTM data saved to database
- [ ] Check Supabase `utm-data` table
- [ ] Verify record contains:
  - [ ] `visitor_token` (unique UUID)
  - [ ] `utm` (combined UTM string)
  - [ ] `source` (UTM source parameter)
  - [ ] `medium` (UTM medium parameter)
  - [ ] `campaign` (UTM campaign parameter)
  - [ ] `isVerified: false` (initially)
  - [ ] `phoneNumber: null` (initially)
  - [ ] `created_at` (timestamp)

### UTM Parameter Variations

#### Test Different UTM Sources
- [ ] Access with `utm_source=google`
  - [ ] Verify captured correctly
- [ ] Access with `utm_source=facebook`
  - [ ] Verify captured correctly
- [ ] Access with `utm_source=instagram`
  - [ ] Verify captured correctly
- [ ] Access with `utm_source=email`
  - [ ] Verify captured correctly
- [ ] Access with custom source
  - [ ] Verify captured correctly

#### Test Different UTM Mediums
- [ ] Test with `utm_medium=cpc`
- [ ] Test with `utm_medium=social`
- [ ] Test with `utm_medium=email`
- [ ] Test with `utm_medium=organic`
- [ ] Verify all captured correctly

#### Test Different UTM Campaigns
- [ ] Test multiple campaign names
- [ ] Test campaigns with spaces (URL encoded)
- [ ] Test campaigns with special characters
- [ ] Verify all captured correctly

#### Test Missing UTM Parameters
- [ ] Access with only `utm_source` (no medium or campaign)
  - [ ] Verify partial data captured
- [ ] Access with no UTM parameters
  - [ ] Verify visitor still tracked
  - [ ] Verify default values or null values
- [ ] Access with malformed UTM parameters
  - [ ] Verify error handling

### UTM and User Verification

#### Update UTM on User Registration
- [ ] Access site with UTM parameters
- [ ] Complete OTP authentication with phone number
- [ ] Verify POST request to `/api/users`
- [ ] Check database `utm-data` table
- [ ] Verify record updated with:
  - [ ] `isVerified: true`
  - [ ] `phoneNumber: [user's phone number]`
- [ ] Verify `visitor_token` remains same

#### Returning User with UTM
- [ ] Existing verified user accesses site with new UTM parameters
- [ ] Verify behavior:
  - [ ] New visit tracked OR
  - [ ] Original UTM data preserved (based on implementation)
- [ ] Document expected behavior

### UTM Persistence
- [ ] Access site with UTM parameters
- [ ] Navigate to different pages
- [ ] Verify UTM parameters persist in session
- [ ] Refresh page
- [ ] Verify UTM data still associated with visitor
- [ ] Close browser and reopen
- [ ] Verify visitor tracking behavior

---

## Progress Tracking

### View Progress

#### Overall Progress Display
- [ ] Navigate to dashboard or progress page
- [ ] Verify overall progress displays
- [ ] Verify progress metrics:
  - [ ] Total videos
  - [ ] Completed videos count
  - [ ] Overall completion percentage
  - [ ] Current video indicator
- [ ] Verify progress visualizations:
  - [ ] Progress bar
  - [ ] Circular progress indicator
  - [ ] Percentage display

#### Video-Level Progress
- [ ] View individual video in content list
- [ ] Verify progress indicator for each video:
  - [ ] Not started (0%)
  - [ ] In progress (1-99%)
  - [ ] Completed (100%)
- [ ] Verify visual indicators:
  - [ ] Checkmark for completed
  - [ ] Progress bar or percentage
  - [ ] Color coding (gray/blue/green)

### Update Progress

#### Automatic Progress Tracking
- [ ] Start watching a video
- [ ] Watch for a few seconds
- [ ] Verify progress auto-saves (check Network tab for POST to `/api/progress`)
- [ ] Refresh page or navigate away and return
- [ ] Verify video resumes from last watched position
- [ ] Continue watching video
- [ ] Verify progress updates periodically
- [ ] Complete video
- [ ] Verify progress updates to 100%
- [ ] Verify "Completed" status displays

#### Manual Progress Update (if available)
- [ ] Navigate to video
- [ ] Click "Mark as Complete" button
- [ ] Verify progress updates to 100%
- [ ] Verify success message
- [ ] Verify completion reflected in list
- [ ] Click "Mark as Incomplete" (if available)
- [ ] Verify progress resets

### Progress Persistence
- [ ] Update progress on multiple videos
- [ ] Logout (if applicable)
- [ ] Login again with same account
- [ ] Verify all progress data restored
- [ ] Verify user can continue from last position

### Progress API Testing
- [ ] Open browser DevTools → Network tab
- [ ] Watch a video
- [ ] Verify GET request to `/api/progress` on page load
  - [ ] Check response contains user's progress data
- [ ] Continue watching
- [ ] Verify POST request to `/api/progress` periodically
  - [ ] Check request payload contains:
    - [ ] User identifier (phone number or token)
    - [ ] Video ID
    - [ ] Progress percentage or timestamp
  - [ ] Verify successful response (200 OK)

---

## Analytics Dashboard

### Access Analytics Dashboard

#### Navigate to Analytics
- [ ] Click "Analytics" button in header
- [ ] Verify navigation to `/analytics` page
- [ ] Verify admin authentication modal/page appears

#### Admin Authentication
- [ ] Enter admin username (from `NEXT_PUBLIC_ADMIN_USERNAME`)
- [ ] Enter admin password (from `NEXT_PUBLIC_ADMIN_PASSWORD`)
- [ ] Click "Login" or "Submit"
- [ ] Verify loading indicator
- [ ] **Valid Credentials Test**
  - [ ] Verify successful authentication
  - [ ] Verify analytics dashboard loads
  - [ ] Verify admin session created
- [ ] **Invalid Credentials Test**
  - [ ] Enter wrong username
  - [ ] Verify error message
  - [ ] Enter wrong password
  - [ ] Verify error message
  - [ ] Verify access denied

### Analytics Dashboard Overview

#### Key Metrics Cards
- [ ] Verify analytics dashboard displays
- [ ] **Total Visitors Metric**
  - [ ] Verify count displays
  - [ ] Verify label "Total Visitors"
  - [ ] Verify number matches database count
  - [ ] Verify icon/styling consistent
  
- [ ] **Verified Users Metric**
  - [ ] Verify count displays
  - [ ] Verify label "Verified Users"
  - [ ] Verify count matches users with `isVerified: true`
  
- [ ] **Conversion Rate Metric**
  - [ ] Verify percentage displays
  - [ ] Verify formula: (Verified Users / Total Visitors) × 100
  - [ ] Verify calculation accuracy
  - [ ] Verify formatting (e.g., "25.5%")
  
- [ ] **Traffic Sources Metric**
  - [ ] Verify count of unique sources
  - [ ] Verify matches distinct `source` values in database

### Charts and Visualizations

#### Traffic Sources Doughnut Chart
- [ ] Verify "Traffic Sources" chart displays
- [ ] Verify chart type is doughnut/pie chart
- [ ] Verify segments for each UTM source:
  - [ ] Google
  - [ ] Facebook
  - [ ] Instagram
  - [ ] Email
  - [ ] Others
- [ ] Verify color coding for each source
- [ ] Verify segment sizes proportional to visitor count
- [ ] **Hover Interactions**
  - [ ] Hover over each segment
  - [ ] Verify tooltip displays:
    - [ ] Source name
    - [ ] Visitor count
    - [ ] Percentage of total
- [ ] Verify legend displays below/beside chart
- [ ] Click legend items
  - [ ] Verify segments toggle visibility

#### Campaign Performance Bar Chart
- [ ] Verify "Campaign Performance" chart displays
- [ ] Verify chart type is bar chart
- [ ] Verify bars for top performing campaigns (e.g., top 5 or 10)
- [ ] Verify X-axis shows campaign names
- [ ] Verify Y-axis shows visitor/conversion count
- [ ] Verify bars are color-coded or uniform
- [ ] **Hover Interactions**
  - [ ] Hover over each bar
  - [ ] Verify tooltip displays:
    - [ ] Campaign name
    - [ ] Visitor count
    - [ ] Verified users count (if shown)
- [ ] Verify bars are sorted (typically highest to lowest)
- [ ] Verify responsive scaling on smaller screens

#### Traffic Mediums Doughnut Chart
- [ ] Verify "Traffic Mediums" chart displays
- [ ] Verify chart type is doughnut/pie chart
- [ ] Verify segments for each UTM medium:
  - [ ] CPC
  - [ ] Social
  - [ ] Email
  - [ ] Organic
  - [ ] Others
- [ ] Verify color coding for each medium
- [ ] Verify segment sizes proportional to visitor count
- [ ] **Hover Interactions**
  - [ ] Hover over each segment
  - [ ] Verify tooltip displays medium name and count
- [ ] Verify legend displays
- [ ] Click legend items to toggle segments

#### Daily Visitors Trend Line Chart
- [ ] Verify "Daily Visitors Trend" chart displays
- [ ] Verify chart type is line chart
- [ ] Verify X-axis shows dates (last 7, 14, or 30 days)
- [ ] Verify Y-axis shows visitor count
- [ ] Verify line connects data points for each day
- [ ] Verify data points marked on line
- [ ] **Hover Interactions**
  - [ ] Hover over data points
  - [ ] Verify tooltip displays:
    - [ ] Date
    - [ ] Visitor count
- [ ] Verify trend is visually clear
- [ ] Verify gridlines for readability
- [ ] Test with different date ranges (if date picker available)

#### Verification Trend Line Chart
- [ ] Verify "Verification Trend" chart displays
- [ ] Verify chart type is line chart with two lines
- [ ] Verify two data series:
  - [ ] Total visitors over time
  - [ ] Verified users over time
- [ ] Verify different colors for each line
- [ ] Verify legend distinguishes both lines
- [ ] **Hover Interactions**
  - [ ] Hover over data points
  - [ ] Verify tooltip shows both values for that date
- [ ] Verify gap between lines represents conversion opportunity
- [ ] Verify lines are visually distinct

### Analytics Data Refresh

#### Automatic Refresh
- [ ] Stay on analytics dashboard
- [ ] Verify data auto-refreshes at intervals (if implemented)
- [ ] Verify loading indicator during refresh
- [ ] Verify charts update with new data

#### Manual Refresh
- [ ] Locate "Refresh" button on analytics page
- [ ] Click "Refresh" button
- [ ] Verify loading indicator appears
- [ ] Verify API request to `/api/analytics`
- [ ] Verify dashboard updates with latest data
- [ ] Verify all charts and metrics refresh

### Analytics Logout
- [ ] Locate "Logout" button on analytics dashboard
- [ ] Click "Logout"
- [ ] Verify admin session cleared
- [ ] Verify redirect to login prompt or home page
- [ ] Try accessing `/analytics` again
  - [ ] Verify requires re-authentication

### Analytics Data Accuracy
- [ ] Compare dashboard metrics with database records
- [ ] **Verify Total Visitors**
  - [ ] Count records in `utm-data` table
  - [ ] Compare with dashboard count
- [ ] **Verify Verified Users**
  - [ ] Count records with `isVerified: true`
  - [ ] Compare with dashboard count
- [ ] **Verify Conversion Rate**
  - [ ] Calculate manually: (Verified / Total) × 100
  - [ ] Compare with dashboard percentage
- [ ] **Verify Chart Data**
  - [ ] Manually count visitors by source
  - [ ] Compare with Traffic Sources chart
  - [ ] Verify campaign counts
  - [ ] Verify medium distribution

---

## API Endpoints

### UTM Analytics API

#### GET /api/analytics
- [ ] Open browser DevTools → Network tab
- [ ] Navigate to `/analytics` page
- [ ] Verify GET request to `/api/analytics`
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body contains:
    - [ ] `totalVisitors` (number)
    - [ ] `verifiedUsers` (number)
    - [ ] `conversionRate` (number/percentage)
    - [ ] `trafficSources` (array)
    - [ ] `campaigns` (array)
    - [ ] `mediums` (array)
    - [ ] `dailyVisitors` (array)
    - [ ] `verificationTrend` (array)
- [ ] Verify data structure matches expected format
- [ ] Test error handling:
  - [ ] Simulate database error
  - [ ] Verify 500 error response with message

#### POST /api/utm
- [ ] Access site with UTM parameters
- [ ] Verify POST request to `/api/utm` in Network tab
- [ ] Check request payload:
  - [ ] `source` (string)
  - [ ] `medium` (string)
  - [ ] `campaign` (string)
  - [ ] `visitor_token` (UUID, generated if not exists)
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body contains:
    - [ ] `success: true`
    - [ ] `visitor_token` (UUID)
- [ ] Verify UTM data saved to database
- [ ] Test error scenarios:
  - [ ] Missing parameters
  - [ ] Invalid data types
  - [ ] Database connection error

### User Management API

#### GET /api/users
- [ ] Make GET request to `/api/users` (via code or Postman)
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body contains array of users
  - [ ] Each user object has:
    - [ ] Phone number
    - [ ] Registration date
    - [ ] Progress data (if included)
- [ ] Test pagination (if implemented)
- [ ] Test filtering (if implemented)

#### POST /api/users
- [ ] Complete OTP authentication
- [ ] Verify POST request to `/api/users` in Network tab
- [ ] Check request payload:
  - [ ] `phoneNumber` (string)
  - [ ] `visitor_token` (UUID, from UTM tracking)
- [ ] Check response:
  - [ ] Status code 200 or 201
  - [ ] Response body contains:
    - [ ] `success: true`
    - [ ] User data
- [ ] Verify user created in database
- [ ] Verify UTM data updated (`isVerified: true`, `phoneNumber` set)
- [ ] Test duplicate phone number handling
- [ ] Test error scenarios

### Content Management API

#### GET /api/content
- [ ] Navigate to video content page
- [ ] Verify GET request to `/api/content` in Network tab
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body contains grouped video data:
    - [ ] Group name/ID
    - [ ] Array of videos in each group
    - [ ] Each video has:
      - [ ] Video ID
      - [ ] Title
      - [ ] Description
      - [ ] Streamable URL
      - [ ] Duration (if available)
      - [ ] Order/sequence
- [ ] Verify data structure matches frontend requirements
- [ ] Test error handling

#### POST /api/content
- [ ] Upload new video content
- [ ] Verify POST request to `/api/content`
- [ ] Check request payload:
  - [ ] Video details (title, description, group, order)
  - [ ] Streamable URL (from upload)
- [ ] Check response:
  - [ ] Status code 201 Created
  - [ ] Response body contains created video data
- [ ] Verify video saved to database
- [ ] Test validation:
  - [ ] Missing required fields
  - [ ] Invalid data formats

#### POST /api/upload
- [ ] Upload video file
- [ ] Verify POST request to `/api/upload`
- [ ] Check request:
  - [ ] Content-Type: multipart/form-data
  - [ ] Video file in request body
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body contains:
    - [ ] `success: true`
    - [ ] `streamableUrl` (Streamable video URL)
- [ ] Verify video uploaded to Streamable
- [ ] Test file size limits
- [ ] Test file type validation
- [ ] Test error scenarios

### Progress Tracking API

#### GET /api/progress
- [ ] Navigate to video or dashboard
- [ ] Verify GET request to `/api/progress`
- [ ] Check request parameters:
  - [ ] User identifier (phone number or token)
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body contains array of progress records:
    - [ ] Video ID
    - [ ] Progress percentage or timestamp
    - [ ] Completion status
- [ ] Verify progress data matches database
- [ ] Test for non-existent user (empty response)

#### POST /api/progress
- [ ] Watch a video
- [ ] Verify POST request to `/api/progress` periodically
- [ ] Check request payload:
  - [ ] User identifier
  - [ ] Video ID
  - [ ] Progress percentage or current timestamp
  - [ ] Completion status (boolean)
- [ ] Check response:
  - [ ] Status code 200 OK
  - [ ] Response body confirms progress saved
- [ ] Verify progress updated in database
- [ ] Test error scenarios:
  - [ ] Invalid user
  - [ ] Invalid video ID
  - [ ] Database error

---

## Data Accuracy

### UTM Data Verification
- [ ] Access site with known UTM parameters
- [ ] Login to Supabase and query `utm-data` table
- [ ] Verify record created with correct:
  - [ ] `source`
  - [ ] `medium`
  - [ ] `campaign`
  - [ ] `visitor_token` (unique UUID)
  - [ ] `created_at` (timestamp)
- [ ] Complete user registration
- [ ] Verify same record updated with:
  - [ ] `isVerified: true`
  - [ ] `phoneNumber` (correct phone number)

### User Data Verification
- [ ] Register multiple test users
- [ ] Verify each user has unique phone number
- [ ] Verify user creation timestamps
- [ ] Verify users linked to correct UTM data via `visitor_token`

### Progress Data Verification
- [ ] Watch videos and mark progress
- [ ] Query progress table in database
- [ ] Verify progress records contain:
  - [ ] Correct user identifier
  - [ ] Correct video ID
  - [ ] Accurate progress percentage
  - [ ] Correct completion status
- [ ] Verify progress timestamps are recent

### Analytics Data Verification
- [ ] Open analytics dashboard
- [ ] **Manual Count Verification**
  - [ ] Count total records in `utm-data` table
  - [ ] Compare with "Total Visitors" metric
  - [ ] Count records with `isVerified: true`
  - [ ] Compare with "Verified Users" metric
  - [ ] Calculate conversion rate manually
  - [ ] Compare with dashboard conversion rate
- [ ] **Chart Data Verification**
  - [ ] Group visitors by `source` in database
  - [ ] Compare counts with Traffic Sources chart
  - [ ] Group by `campaign`
  - [ ] Compare with Campaign Performance chart
  - [ ] Verify daily visitor counts match chart data

### Video Content Verification
- [ ] Check video content in database
- [ ] Verify Streamable URLs are valid
- [ ] Click Streamable URLs directly
  - [ ] Verify videos load and play
- [ ] Verify video metadata (title, description, order) matches database
- [ ] Verify content grouping is accurate

---

## Performance & Loading

### Initial Page Load
- [ ] Measure time to first contentful paint
- [ ] Verify page loads within acceptable time (< 3 seconds)
- [ ] Check for console errors
- [ ] Verify no JavaScript errors
- [ ] Test on slow network (throttle in DevTools)
  - [ ] Verify graceful loading
  - [ ] Verify loading indicators appear

### Video Loading Performance
- [ ] Click on video to watch
- [ ] Measure time for video player to load
- [ ] Verify video buffering is minimal
- [ ] Test on different network speeds:
  - [ ] Fast (4G/WiFi)
  - [ ] Slow (3G throttled)
- [ ] Verify adaptive streaming (if available)
- [ ] Verify loading spinner displays while buffering

### Analytics Dashboard Loading
- [ ] Navigate to `/analytics`
- [ ] Measure time for dashboard to load
- [ ] Verify loading indicators for:
  - [ ] Key metrics
  - [ ] Each chart
- [ ] Verify charts render smoothly
- [ ] Test with large datasets (100+ visitors)
  - [ ] Verify performance doesn't degrade

### API Response Times
- [ ] Monitor Network tab for API requests
- [ ] Verify response times:
  - [ ] `/api/analytics` - should respond in < 2 seconds
  - [ ] `/api/utm` - should respond in < 500ms
  - [ ] `/api/users` - should respond in < 1 second
  - [ ] `/api/content` - should respond in < 1 second
  - [ ] `/api/progress` - should respond in < 500ms
- [ ] Test under load (if load testing tools available)

### Caching & Optimization