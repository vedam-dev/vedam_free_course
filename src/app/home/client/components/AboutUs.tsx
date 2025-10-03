'use client';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import BaseDecoration from '@/components/BaseDecoration';

const AboutUs: React.FC = () => {
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
                minHeight: '100vh',
                backgroundImage: 'url("/assets/Background.png")',
                backgroundSize: '100% auto',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                py: { xs: 4, md: '48px' },
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                    <Typography
                        sx={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: { xs: '18px', md: '44px' },
                            fontWeight: 500,
                            color: '#000',
                            // mb: 1,
                        }}
                    >
                        Introducing
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: { xs: '28px', md: '56px' },
                            fontWeight: 700,
                            mb: '48px',
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(90deg, #8A18FF 0%, #F5790D 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Vedam School of{' '}
                        </Box>
                        <BaseDecoration
                            sx={{
                                background: 'linear-gradient( #F5790D 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Technology
                        </BaseDecoration>
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: { xs: '14px', md: '32px' },
                            fontWeight: 500,
                            color: '#000',
                        }}
                    >
                        4 Year Undergrad Program in CS & AI
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;