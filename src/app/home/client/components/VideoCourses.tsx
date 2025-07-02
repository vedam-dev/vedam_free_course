'use client';
import { Alert, Box, Container, Divider, Snackbar,Stack, Typography ,useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import CourseCard from '@/components/CourseCard';
import BaseDecoration from '@/components/BaseDecoration';

interface Video {
  id: string;
  title: string;
  topic: string;
}

const courseData = [
  {
    color: 'linear-gradient(90deg, #FF995D 0%, #FFD47E 33.46%, #FFEAB0 51.58%, #FFF 66.62%)',
    color2: 'linear-gradient(180deg, #FF995D 0%, #FFD47E 33.46%, #FFEAB0 51.58%, #FFF 66.62%)',
    image: '/home/instructors/instructor.png',
    companyname: 'GOOGLE',
    level: 'Beginner',
    time: '4',
    viewed: 'true',
    usedby: 'Google, Microsoft, and Adobe',
  },
  {
    color: 'linear-gradient(90deg, #B66FFF 0%, #FF83BC 24.35%, #FFB990 40.36%, #FFF 66.62%)',
    color2: 'linear-gradient(180deg, #B66FFF 0%, #FF83BC 24.35%, #FFB990 40.36%, #FFF 66.62%)',
    image: '/home/instructors/instructor.png',
    companyname: 'MICROSOFT',
    level: 'Intermediate',
    time: '6',
    viewed: 'false',
    usedby: 'Microsoft, Amazon, and Facebook',
  },
  {
    color: 'linear-gradient(90deg, #02A390 0%, #B9FFB4 33.46%, #86F3FF 51.58%, #FFF 66.62%)',
    color2: 'linear-gradient(180deg, #02A390 0%, #B9FFB4 33.46%, #86F3FF 51.58%, #FFF 66.62%)',
    image: '/home/instructors/instructor.png',
    companyname: 'ADOBE',
    level: 'Advanced',
    time: '8',
    viewed: 'true',
    usedby: 'Adobe, Google, and Netflix',
  },
  {
    color: 'linear-gradient(90deg, #A64EFF 0%, #DDB6FF 33.46%, #EEDBFF 51.58%, #FFF 66.62%)',
    color2: 'linear-gradient(180deg, #A64EFF 0%, #DDB6FF 33.46%, #EEDBFF 51.58%, #FFF 66.62%)',
    image: '/home/instructors/instructor.png',
    companyname: 'AMAZON',
    level: 'Beginner',
    time: '3',
    viewed: 'false',
    usedby: 'Amazon, Google, and Microsoft',
  },
];

const topicTemplateMap: Record<string, number> = {
  'DSA': 0,
  'Machine Learning': 1,
  'Template 1': 2,
  'Template 2': 3,
  'Template 3': 0,
};

export default function VideoCourses() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [groupedContent, setGroupedContent] = useState<Record<string, Video[]>>({});
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(json => setGroupedContent(json.data || {}));
  }, []);

  const handleVideoCardClick = (firstVideo: Video) => {
    const user_id = localStorage.getItem('userId');
    if(!user_id) {
      setSnackbarMsg('You must be logged in to mark as completed.');
      setSnackbarOpen(true);
      return;
    } else {
      router.push(`/videos/${'shortcode' in firstVideo && firstVideo.shortcode ? firstVideo.shortcode : firstVideo.id}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        component="section"
        sx={{
          py: { xs: 4, md: 8 },
          px: 1,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontSize: { xs: '20px', md: '30px', lg: '40px' },
            color: '#000',
            textAlign: 'left',
            marginBottom: '48px',
          }}
        >
          Build for coders who want to {' '}<BaseDecoration>start early</BaseDecoration> 
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'auto auto auto auto auto',
            },
            alignItems: 'center',
            justifyContent: { md: 'space-between' },
            gap: { xs: 1, md: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              background: isMobile
                ? 'linear-gradient(to right, #A64EF4, #FE7E2B)'
                : '#fff',
              padding: '1.5px',
              borderRadius: '16px',
            }}
          >
            <Box
              sx={{
                borderRadius: '14px',
                backgroundColor: '#fff',
                padding: '8px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: '10px', md: '24px' },
                  lineHeight: { xs: '16px', md: '36px' },
                  color: '#565656',
                  textAlign: 'left',
                }}
              >
                Courses offered
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans‑serif',
                  fontWeight: 600,
                  fontSize: { xs: '10px', md: '32px' },
                  lineHeight: { xs: '16px', md: '36px' },
                  color: '#1E1E1E',
                  mt: 0.5,
                  textAlign: 'left',
                }}
              >
                4 Industry-Led Modules
              </Typography>
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem={false}
            sx={{
              display: { xs: 'none', md: 'block' },
              height: '4rem',
              mx: 2,
              backgroundColor: '#BEBEBE',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              background: isMobile
                ? 'linear-gradient(to right, #A64EF4, #FE7E2B)'
                : '#fff',
              padding: '1.5px',
              borderRadius: '16px',
            }}
          >
            <Box
              sx={{
                borderRadius: '14px',
                backgroundColor: '#fff',
                padding: '8px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: '10px', md: '24px' },
                  llineHeight: { xs: '16px', md: '36px' },
                  color: '#565656',
                  textAlign: 'left',
                }}
              >
                Duration
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans‑serif',
                  fontWeight: 600,
                  fontSize: { xs: '10px', md: '32px' },
                  lineHeight: { xs: '16px', md: '36px' },
                  color: '#1E1E1E',
                  mt: 0.5,
                  textAlign: 'left',
                }}
              >
                Less than 2 hour
              </Typography>
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem={false}
            sx={{
              display: { xs: 'none', md: 'block' },
              height: '4rem',
              mx: 2,
              backgroundColor: '#BEBEBE',
            }}
          />

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              border: isMobile ? '1px solid #02901A' : '2px solid #02901A',
              borderRadius: '100px',
              px: 4,
              py: 0.5,
              gridColumn: { xs: '1 / -1', md: 'auto' },
            }}
          >
            <Typography
              component="span"
              sx={{
                display: 'flex',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: { xs: '12px', md: '24px' },
                color: '#02901A',
                ml: 1,
                lineHeight: 1.1,
                mx: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  mr: isMobile ? '0px' : '8px',
                  display: 'flex',
                  flex: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? '20' : '36'}
                  height={isMobile ? '10' : '30'}
                  viewBox="0 0 36 35"
                  fill="none"
                >
                  <path
                    d="M18.0183 0.5C14.5535 0.5 11.1665 1.49703 8.28566 3.36502C5.40479 5.233 3.15943 7.88804 1.83351 10.9944C0.50759 14.1007 0.16067 17.5189 0.836617 20.8165C1.51256 24.1142 3.18102 27.1433 5.631 29.5208C8.08097 31.8983 11.2024 33.5174 14.6006 34.1733C17.9989 34.8293 21.5212 34.4926 24.7223 33.2059C27.9233 31.9193 30.6593 29.7403 32.5842 26.9447C34.5092 24.1491 35.5366 20.8623 35.5366 17.5C35.5317 12.9928 33.6844 8.67153 30.4002 5.48444C27.1159 2.29735 22.6629 0.50476 18.0183 0.5ZM25.7095 14.5021L16.2766 23.656C16.1514 23.7775 16.0028 23.874 15.8392 23.9398C15.6756 24.0056 15.5003 24.0395 15.3232 24.0395C15.1461 24.0395 14.9707 24.0056 14.8071 23.9398C14.6435 23.874 14.4949 23.7775 14.3698 23.656L10.3271 19.7329C10.0742 19.4875 9.93218 19.1547 9.93218 18.8077C9.93218 18.4607 10.0742 18.1279 10.3271 17.8825C10.58 17.6371 10.9229 17.4993 11.2805 17.4993C11.6381 17.4993 11.981 17.6371 12.2339 17.8825L15.3232 20.882L23.8027 12.6517C23.9279 12.5302 24.0765 12.4339 24.2401 12.3681C24.4037 12.3023 24.579 12.2685 24.7561 12.2685C24.9332 12.2685 25.1085 12.3023 25.2721 12.3681C25.4357 12.4339 25.5843 12.5302 25.7095 12.6517C25.8347 12.7732 25.934 12.9175 26.0018 13.0762C26.0695 13.235 26.1044 13.4051 26.1044 13.5769C26.1044 13.7487 26.0695 13.9189 26.0018 14.0776C25.934 14.2364 25.8347 14.3806 25.7095 14.5021Z"
                    fill="#02901A"
                  />
                </svg>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { sm: 'row', md: 'column' },
                  textAlign: 'left',
                }}
              >
                <Box component="span">Beginner</Box>
                <Box component="span">Friendly</Box>
              </Box>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ py: 4 }}>
          <Stack spacing={4}>
            {Object.entries(groupedContent).map(([topic, videos], idx) => {
              const templateIdx = topicTemplateMap[topic] ?? (idx % courseData.length);
              const ref = courseData[templateIdx];
              const firstVideo = videos[0];
              return (
                <Box key={topic} sx={{ mb: 6 }} >
                  <CourseCard
                    onClick={() => {handleVideoCardClick(firstVideo);}}
                    course={{
                      id: firstVideo.id,
                      color: ref.color,
                      color2: ref.color2,
                      image: ref.image,
                      companyname: ref.companyname,
                      coursename: topic,
                      level: ref.level,
                      time: ref.time,
                      viewed: ref.viewed,
                      usedby: ref.usedby,
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
