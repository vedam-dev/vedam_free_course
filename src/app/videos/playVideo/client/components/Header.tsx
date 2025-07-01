'use client';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const handleSignIn = () => {
    setIsSignedIn(!isSignedIn);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        boxShadow: 'sm',
        height: '64px',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
          minHeight: '64px',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Toggle sidebar"
          sx={{ color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        <Link href="/" passHref>
          <Box
            component="a"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: { xs: 2, md: 3 },
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Image
              src="/home/videoInfo/VedamLogo.png"
              alt="YouTube Logo"
              width={60}
              height={40}
              style={{
                height: '32px',
                width: 'auto',
              }}
              draggable="false"
            />
          </Box>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {isSignedIn ? (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleSignIn}
            sx={{
              ml: 2,
              borderRadius: '9999px',
              fontWeight: 'semibold',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: 'primary.50',
              },
            }}
          >

            <Typography>  Sign Out</Typography>
            Sign Out
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PersonOutlineIcon />}
            onClick={handleSignIn}
            sx={{
              ml: { xs: 2, md: 3 },
              borderRadius: '9999px',
              fontWeight: 'semibold',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: 'primary.50',
              },
            }}
          >


            <Typography>
                              Sign In
            </Typography>

          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;