import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from '@mui/material';
import React from 'react';

import BaseDecoration from '@/components/BaseDecoration';
const Faq = () => {
  const Data = [
    {
      id: '1',
      question: 'What is Code Sprint?',
      ans: 'A free program for 12th Grade students starting B.Tech CS this year to build coding fundamentals before college begins.',
    },
    {
      id: '2',
      question: 'Who can join Code Sprint?',
      ans: 'Any student who has completed 12th grade and is about to start their B.Tech in Computer Science or related fields.',
    },
    {
      id: '3',
      question: 'What will I learn in Code Sprint?',
      ans: "You'll learn programming fundamentals, problem-solving skills, and get introduced to key concepts you'll encounter in your first year of engineering.",
    },
    {
      id: '4',
      question: 'How long is the program?',
      ans: 'Code Sprint is a 4-hours intensive program designed to give you a head start before your college begins.',
    },
    {
      id: '5',
      question: 'Is there any certification?',
      ans: "Yes, upon successful completion of the program, you'll receive a certificate that you can showcase in your college and internship applications.",
    },
  ];
  return (
    <Container maxWidth="lg">
      <Box>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'Outfit, sans‑serif',
            fontWeight: '600',
            fontSize: { xs: '32px', md: '48px' },
            color: '#2B2B2B',
          }}
        >
          Got Some
          {' '}<BaseDecoration>Questions</BaseDecoration>{' '}?
        </Typography>

        <Typography
          component="h2"
          sx={{
            fontFamily: 'Outfit, sans‑serif',
            fontWeight: '600',
            fontSize: { xs: '32px', md: '48px' },
            color: '#2B2B2B',
          }}
        >
          We Have Answered them for you
        </Typography>
      </Box>
      <Box sx={{ width: { sm: '100%', md: '100%' }, my: { xs:5,md:8 }, mt: { xs:4,md:8 } }}>
        {Data.map(({ id, question, ans }) => (
          <Box
            key={id}
            sx={{
              mb: { xs:2,md:4.5 },
              borderRadius: '1.25rem',
              background: 'linear-gradient(90deg, #FF7829 0%, #8A18FF 100%)',
              padding: '2px',
            }}
          >
            <Box
              sx={{
                borderRadius: 'inherit',
                overflow: 'hidden',
              }}
            >
              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        width: { xs: '2rem', md: '3rem' },
                        height: { xs: '1.5rem', md: '2.5rem' },
                        color: 'black',
                      }}
                    />
                  }
                  sx={{
                    bgcolor: '#FFFFFF',
                    px: 3,
                    py: 2,
                    minHeight: '72px',
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                      alignItems: 'center',
                    },
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: '#666666',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: { xs: '16px', md: '35px' },
                      fontWeight: '500',
                      color: '#000',
                    }}
                  >
                    {question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    bgcolor: '#FFFFFF',
                    px: 3,
                    pb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: { xs: '12px', md: '24px' },
                      textAlign: 'left',
                      fontWeight: 400,
                      color: '#333333',
                    }}
                  >
                    {ans}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Faq;
