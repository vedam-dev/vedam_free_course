'use client';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Card, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import BaseButton from './BaseButton';

type Course = {
  id: string;
  color: string;
  color2: string;
  image: string;
  companyname: string;
  coursename: string;
  level: string;
  time: string;
  viewed: string;
  usedby: string;
};

interface CourseCardProps {
  course: Course;
  onClick(): void;
}
const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: { xs: '36px', md: '40px' },
        boxShadow: 3,
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: 300 },
        background: { xs: course.color2, md: course.color },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <Box
          component="img"
          src="/home/eclipse.png"
          alt="Eclipse background"
          sx={{
            position: 'absolute',
            left: { xs: -350, md: -100 },
            bottom: { xs: 0, md: 60 },
            top: { xs: -50, md: 30, lg: 0 },
            transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' },
            opacity: 1,
            width: { xs: 500, md: 600 },
            height: { xs: 600, md: 700 },
          }}
        />
      </Box>
      <Box
        sx={{
          position: 'relative',
          flex: { xs: 'none', md: '0 0 60%' },
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: 250, md: 300 },
          overflow: 'hidden',
        }}
      >
        <Box>
          <Box
            component="img"
            src={course.image}
            alt={`${course.companyname} instructor`}
            sx={{
              alignSelf: 'flex-start',
              position: 'absolute',
              top: { xs: 0, md: 32, lg: 8 },
              left: isMobile ? -5 : 0,
              borderRadius: isMobile ? '50% 50% 50% 0%' : '0%',
              width: isMobile ? 200 : 290,
              height: isMobile ? 250 : 350,
            }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            right: { xs: '10px', sm: '30px', md: '40px' },
            top: isMobile ? '60%' : '45%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <Box sx={{ mb: -1 }}>
            <Image
              src="/home/star.png"
              width={isMobile ? 60 : 80}
              height={isMobile ? 60 : 80}
              alt="star"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: { xs: 25, md: 60 },
                height: { xs: '1px', md: '2px' },
                backgroundColor: '#333',
                borderRadius: '1px',
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: '10px', md: '16px' },
                fontWeight: 600,
                letterSpacing: { xs: '1px', md: '3px' },
                color: '#333',
                whiteSpace: 'nowrap',
              }}
            >
              TAUGHT BY
            </Typography>
            <Box
              sx={{
                width: { xs: 25, md: 60 },
                height: { xs: '1px', md: '2px' },
                backgroundColor: '#333',
                borderRadius: '1px',
              }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: { xs: '28px', md: '56px' },
              fontWeight: 700,
              lineHeight: { xs: '32px', md: '58px' },
              color: '#fff',
              textShadow: {
                xs: [
                  '-2px  0    0 #000',
                  ' 0   -2px  0 #000',
                  ' 0    2px  0 #000',
                  '-2px -2px  0 #000',
                  ' 2px -2px  0 #000',
                  '-2px 2px   0 #000',
                  ' 2px 2px   0 #000',
                  '0px  5px  0px #000',
                ].join(','),
                md: [
                  '-2px  0    0 #000',
                  ' 0   -2px  0 #000',
                  ' 0    2px  0 #000',
                  '-2px -2px  0 #000',
                  ' 2px -2px  0 #000',
                  '-2px 2px   0 #000',
                  ' 2px 2px   0 #000',
                  '0px  6px  0px #000',
                ].join(','),
              },
              mb: { sm: 0.5, md: 1 },
            }}
          >
            {course.companyname}
          </Typography>

          <Typography
            sx={{
              color: '#F25C05',
              fontFamily: 'Outfit, Arial, sans-serif',
              fontSize: { xs: '24px', md: '64px' },
              fontWeight: 600,
              lineHeight: { xs: '26px', md: '50px' },
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Instructor
          </Typography>
        </Box>
      </Box>

      {/* Right white panel */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 4 },
          pl: { xs: 3, md: 2 },
          pr: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: '3',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'left',
            color: '#000',
            fontFamily: 'Outfit, sans-serif',
            fontSize: { xs: '22px', lg: '30px' },
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: { xs: '28px', md: '36px' },
            display: 'inline-block',
            verticalAlign: 'text-top',
            mb: 1,
          }}
        >
          {course.coursename}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonIcon sx={{ fontSize: { xs: 15, md: 20 }, color: '#666' }} />

            <Typography
              variant="body2"
              sx={{
                color: '#000',
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '12px', md: '20px' },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: { xs: '18px', md: '36px' },
                display: 'inline-block',
                verticalAlign: 'text-top',
              }}
            >
              {course.level} Level
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon
              sx={{ fontSize: { xs: 15, md: 20 }, color: '#666' }}
            />

            <Typography
              variant="body2"
              sx={{
                color: '#000',
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '12px', md: '20px' },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: { xs: '18px', md: '36px' },
                display: 'inline-block',
                verticalAlign: 'text-top',
              }}
            >
              Less than {course.time} hours
            </Typography>
          </Box>
        </Box>

        {course.viewed === 'true' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <VisibilityIcon
              sx={{ fontSize: { xs: 15, md: 20 }, color: '#666' }}
            />

            <Typography
              variant="body2"
              sx={{
                color: '#000',
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '12px', md: '20px' },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: { xs: '18px', md: '36px' },
                display: 'inline-block',
                verticalAlign: 'text-top',
              }}
            >
              Popular
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
          <StarIcon
            sx={{
              fontSize: { xs: 15, md: 20 },
              color: '#666',
              mt: { xs: '0px', md: '4px' },
            }}
          />

          <Typography
            variant="body2"
            sx={{
              color: '#171717',
              fontFamily: 'Outfit, sans-serif',
              fontSize: { xs: '12px', md: '18px' },
              fontStyle: 'normal',
              fontWeight: { xs: 300, md: 400 },
              lineHeight: { xs: '18px', md: '28px' },
              display: 'inline-block',
              textAlign: 'left',
            }}
          >
            Used by top companies like {course.usedby}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <BaseButton
            variant="contained"
            fullWidth
            sx={{
              fontSize: '16px',
              lineHeight: { xs: '14px', md: '28px' },
              textWrap: 'nowrap',
              order: { xs: 1, sm: 2 },
            }}
            onClick={onClick}
          >
            Start Free
          </BaseButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CourseCard;
