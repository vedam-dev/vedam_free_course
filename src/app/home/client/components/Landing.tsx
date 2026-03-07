'use client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Box,
  Container,
  Fade,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import BaseButton from '@/components/BaseButton';
import BaseDecoration from '@/components/BaseDecoration';
import OtpModal from '@/components/otp/OtpModal';
import type { RootState } from '@/lib/store';

import { useOtpModal } from '../../../../../hooks/useOtpModal';

const QUOTES = [
  { text: 'Knowledge is power.', author: 'Francis Bacon' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'Education is freedom.', author: 'Paulo Freire' },
  { text: 'Education breeds confidence.', author: 'Confucius' },
  { text: 'To teach is to learn twice.', author: 'Joseph Joubert' },
  { text: 'The expert was once a beginner.', author: 'Helen Hayes' },
  { text: 'Education is the great equalizer.', author: 'Horace Mann' },
  { text: 'The roots of education are bitter.', author: 'Aristotle' },
  { text: 'The mind is not a vessel to be filled.', author: 'Plutarch' },
  { text: 'Develop a passion for learning.', author: 'Anthony J. D\'Angelo' },
  { text: 'Education is not preparation for life.', author: 'John Dewey' },
  { text: 'The more you read, the more you know.', author: 'Dr. Seuss' },
  { text: 'A reader lives a thousand lives.', author: 'George R.R. Martin' },
  { text: 'Education is the most powerful weapon.', author: 'Nelson Mandela' },
  { text: 'Books are the quietest of teachers.', author: 'Charles W. Eliot' },
  { text: 'Anyone who stops learning is old.', author: 'Henry Ford' },
  { text: 'Change is the end result of learning.', author: 'Leo Buscaglia' },
  { text: 'Learning is not attained by chance.', author: 'Abigail Adams' },
  { text: 'Curiosity is the engine of achievement.', author: 'Ken Robinson' },
  { text: 'The wisest mind has something to learn.', author: 'George Santayana' },
  { text: 'An investment in knowledge pays best.', author: 'Benjamin Franklin' },
  { text: 'Seek knowledge from cradle to grave.', author: 'Prophet Muhammad' },
  { text: 'Live, learn, and pass it on.', author: 'H. Jackson Brown Jr.' },
  { text: 'Teaching is the best way to learn.', author: 'Frank Oppenheimer' },
  { text: 'Education makes all things possible.', author: 'Anonymous' },
  { text: 'Commit yourself to lifelong learning.', author: 'Brian Tracy' },
  { text: 'The goal of education is wisdom.', author: 'Anonymous' },
  { text: 'Education is the passport to the future.', author: 'Malcolm X' },
  { text: 'The educated differ from the uneducated.', author: 'Aristotle' },
  { text: 'Study while others are sleeping.', author: 'Anonymous' },
  { text: 'One book, one pen can change the world.', author: 'Malala Yousafzai' },
  { text: 'Real learning comes from curiosity.', author: 'Anonymous' },
  { text: 'The more you learn, the more you earn.', author: 'Warren Buffett' },
  { text: 'Each day of learning brings new light.', author: 'Anonymous' },
  { text: 'Education is light; ignorance, darkness.', author: 'Anonymous' },
];

const temp = [
  'Beginner Friendly',
  'Free of Cost',
  'No prior experience required',
];

// Helper to get random color
function stringToColor(str: string) {
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for(let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

const Landing: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const username = useSelector((state: RootState) => state.user.username);
  const [hasMounted, setHasMounted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const { showOtpModal, setShowOtpModal, handleVerificationSuccess } =
    useOtpModal();

  const handleJoinCodeSprint = () => {
    if(!isLoggedIn) {
      setShowOtpModal(true);
      return;
    } else {
      const element = document.getElementById('VideoCourses');
      if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 400);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  if(!hasMounted) return null;
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        width: '100vw',
        backgroundImage: {
          xs: "url('/home/GRADIENT-2.png')",
          md: "url('/home/GRADIENT.png')",
        },
        backgroundSize: { xs: '300% auto', md: '150% auto' },
        backgroundPosition: { xs: 'center -425px', md: 'center -450px', lg: 'center -600px' },
        backgroundRepeat: 'no-repeat',
        py: { xs: 1, md: 4 },
        mb: { lg: 10, xl: 0 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 4, md: 6 },
            minHeight: { xs: '60px', md: '80px' },
            position: 'relative',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            px: { xs: 1.5, sm: 2.5 },
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0, sm: 1, lg: 0 },
              flex: 1,
              minWidth: 0, // Allows shrinking
            }}
          >
            <Box
              sx={{
                width: { xs: '70px', sm: '88px', md: '160px' },
                height: { xs: '48px', sm: '60px', md: '100px' },
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                marginRight: { xs: '2px', sm: '1px' },
                flexShrink: 0,
              }}
            />
            {/* Line Divider */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '1px',
                height: '44px',
                backgroundColor: '#2C0052',
                mx: { xs: 0, md: 2 },
                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                display: { xs: 'block', md: 'none' },
                width: '16px',
                height: '1px',
                backgroundColor: '#858585',
                transform: 'rotate(90deg)',
                flexShrink: 0,
                mx: { xs: 0.5, sm: 1 },
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '16px', sm: '20px', md: '28px', lg: '40px' },
                fontWeight: 600,
                background:
                  'linear-gradient(90deg, #5A02A7 0%, #8A18FF 33.74%, #C14B81 54.73%, #DD6442 75%, #F97D03 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              }}
            >
              CodeSprint
            </Typography>
          </Box>

          {/* Header Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              alignItems: 'center',
              flexShrink: 0,
              ml: { xs: 1, sm: 2 },
              zIndex: 30,
            }}
          >
            {/* Quote */}
            <Fade in={quoteVisible} timeout={400}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontFamily: 'Outfit, sans-serif',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    color: 'rgba(30, 30, 30, 0.85)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    pr:1,
                    maxWidth: '280px',
                  }}
                >
                  &ldquo;{QUOTES[quoteIndex].text}&rdquo;
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    color: 'rgba(90, 2, 167, 0.65)',
                    whiteSpace: 'nowrap',
                    mt: 0.25,
                  }}
                >
                  ~ {QUOTES[quoteIndex].author}
                </Typography>
              </Box>
            </Fade>
            {isLoggedIn ? (
              <>
                <Avatar
                  sx={{
                    bgcolor: stringToColor(username || 'U'),
                    width: { xs: '28px', md: '40px' },
                    height: { xs: '28px', md: '40px' },
                    fontWeight: 700,
                    fontSize: { xs: 15, md: 22 },
                  }}
                >
                  {(username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </>
            ) : (
              <>
                <BaseButton
                  variant="outlined"
                  onClick={() => setShowOtpModal(true)}
                  sx={{
                    px: { xs: 2, md: 7 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '1rem' },
                    minWidth: { xs: 'auto', sm: 'auto' },
                    whiteSpace: 'nowrap',
                    background: 'white',
                  }}
                >
                  Login
                </BaseButton>
                <BaseButton
                  variant="contained"
                  onClick={() => setShowOtpModal(true)}
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sign Up
                </BaseButton>
              </>
            )}
          </Box>
        </Box>
      </Container>


      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 3, md: 4 },
            mt: 2,
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              flex: { xs: 1, lg: 0.8 },
              textAlign: { xs: 'center', md: 'center', lg: 'left' },
              zIndex: 30,
            }}
          >
            <Typography
              sx={{
                color: '#272727',
                fontWeight: 600,
                fontSize: { xs: '12px', md: '24px' },
                fontFamily: 'Outfit',
                mb: 2,
              }}
            >
              START SMART, START EARLY!
            </Typography>

            <Typography
              sx={{
                color: '#1E1E1E',
                fontFamily: 'Outfit',
                fontSize: { xs: '36px', md: '60px' },
                fontWeight: 600,
                lineHeight: { xs: '44px', md: '72px' },
                mb: 3,
              }}
            >
              Sprint into College
              <br />
              With a <BaseDecoration>Clear</BaseDecoration>
              <br />
              Advantage
            </Typography>

            <Typography
              sx={{
                color: '#1E1E1E',
                fontFamily: 'Outfit',
                fontSize: { xs: '20px', md: '32px' },
                fontWeight: 500,
                lineHeight: '36px',
                mb: 4,
              }}
            >
              A free program for 12th Grade
              <br />
              students starting B.Tech CS this year
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'column', lg: 'row' },
                gap: 2,
                mb: { xs: 3, md: 4 },
              }}
            >
              <BaseButton
                variant="outlined"
                size="large"
                onClick={handleJoinCodeSprint}
                sx={{
                  background: 'white',
                }}
              >
                {isLoggedIn ? "I'm Ready to Learn !" : 'Register for Codesprint'}
              </BaseButton>
              {/* <BaseButton variant="contained" size="large">
                Register for later
              </BaseButton> */}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                maxWidth: { xs: '100%', md: '70%', lg: '44%' },
                gap: { xs: 1, md: 2 },
                mb: { xs: 0, md: 0 },
              }}
            >
              {temp.map((feature) => (
                <Box
                  key={feature}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    mx: 0,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ color: '#02901A', fontSize: '20px' }}
                  />
                  <Typography
                    sx={{
                      color: 'rgba(32, 32, 32)',
                      fontWeight: 500,
                      fontSize: { xs: '14px', md: '20px' },
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flex: 1.2,
              position: { xs: 'inherit', lg: 'absolute' },
              right: { xs: '0px', md: '40px' },
              top: { xs: '', md: '120px' },
              bottom: { xs: '0', md: '' },
              minHeight: { xs: '300px', sm: '400px', md: '500px', lg: '670px' },
              width: { xs: '100%', lg: '100%' },
              maxWidth: { xs: '100%', lg: '771px' },
              backgroundImage: {
                xs: 'url("/assets/centralBox.png")',
                lg: 'url("/assets/rightBox.png")',
              },
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              zIndex: 20,

              // background:'red'
            }}
          />
        </Box>

        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            flex: 1.2,
            position: { xs: 'inherit', md: 'absolute' },
            right: { xs: '0px', md: '-8px' },
            top: { xs: '', md: '-140px' },
            bottom: { xs: '0', md: '' },
            minHeight: {
              xs: '300px',
              sm: '400px',
              md: '500px',
              lg: '1173px',
            },
            width: { xs: '100%', lg: '100%' },
            maxWidth: { xs: '100%', lg: '900px' },
            backgroundImage: 'url("/home/circlebackground.png")',
            opacity: 0.8,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        ></Box>

      </Container>
      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </Box>
  );
};

export default Landing;
