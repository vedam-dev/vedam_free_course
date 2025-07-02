import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Container, Link, Typography } from '@mui/material';
import Image from 'next/image';
import * as React from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const FOOTER_LINKS: FooterColumn[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Terms of use', href: '/terms-of-use' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { label: 'connect@vedam.org', href: 'mailto:connect@vedam.org' },
      { label: '+91 92010 10176', href: 'tel:9201010176' },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [ // Correctly named in uppercase
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@VedamSchoolofTech_Official',
    icon: <YouTubeIcon sx={{ color: 'white' }} />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/vedamschooloftech_official/?igsh=MTRscTNtdGxnNG1yMQ%3D%3D#',
    icon: <InstagramIcon sx={{ color: 'white' }} />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/vedam-school-of-technology/',
    icon: <LinkedInIcon sx={{ color: 'white' }} />,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/vedamschooloftechnology',
    icon: <TelegramIcon sx={{ color: 'white' }} />,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/vedamschooltech',
    icon: <XIcon sx={{ color: 'white' }} />,
  },
];


const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        background: 'linear-gradient(to right, #6C10BC, #FB7F05)',
        color: 'white',
        py: { xs: 3, sm: 8 },
      }}
    >
      <Container maxWidth='lg'>
        <Box
          sx={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main Footer Columns */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { xs: 'center', md: 'space-between' },
              alignItems: { xs: 'center', md: 'flex-start' },
              pb: 4,
              gap: { xs: 1, md: 0 },
            }}
          >
            {/* Logo Column */}
            <Box sx={{
              width: { xs: '100%', md: '25%' },
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mt : { xs:'0px' ,md:'-30px' },
              mr:  { xs: '0', md: '40px' }
            }}>
              <Box sx={{
                width: '262px',
                height: '147px',
                position: 'relative',
              }}>
                <Image
                  src="/home/videoInfo/Vedam_Final_Logo_White-1.png"
                  alt="Navbar Logo"
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>

            {/* Links Columns */}
            {FOOTER_LINKS.map((column) => (
              <Box
                key={column.title}
                sx={{
                  width: { xs: '100%', md: '25%' },
                  textAlign: { xs: 'center', md: 'left' },
                  ml : '10px'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: 16, sm: 20 },
                  }}
                >
                  {column.title}
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' },

                }}>
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      color="inherit"
                      underline="hover"
                      sx={{
                        fontSize: { xs: 14, sm: 16 },
                        '&:hover': { color: '#FFA41A' },
                        mb: 1,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Box>
            ))}

            {/* Social Links Column */}
            <Box sx={{
              width: { xs: '100%', md: '25%' },
              textAlign: { xs: 'center', md: 'left' },
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  mb: { xs: 1, sm: 2 },
                  fontSize: { xs: 16, sm: 20 },
                }}
              >
              Follow Us
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                {SOCIAL_LINKS.map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'white',
                      '&:hover': { color: '#FFA41A' },
                      textDecoration: 'none',
                    }}
                  >
                    {social.icon}
                    <Typography sx={{
                      fontSize: 16,
                      display: { xs: 'none', sm: 'block' },
                      ml: 1,
                    }}>
                      {social.name}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Copyright Section */}
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              pt: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 14 }}>
            Copyright © Vedam School of Technology 2025
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;