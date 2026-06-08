'use client';

import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';
import type { IconButtonProps, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

import { resetUser } from '@/lib/store';
import type { AppDispatch } from '@/lib/store';

const AUTH_STORAGE_KEYS = ['userId', 'isLoggedIn', 'username', 'mobile'];

interface LogoutButtonProps extends Omit<IconButtonProps, 'aria-label' | 'onClick'> {
  redirectTo?: string;
}

const defaultButtonSx: SxProps<Theme> = {
  color: '#6C10BC',
  background: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(108, 16, 188, 0.18)',
  boxShadow: '0 4px 14px rgba(108, 16, 188, 0.12)',
  '&:hover': {
    background: 'rgba(108, 16, 188, 0.08)',
  },
};

export default function LogoutButton({
  redirectTo = '/',
  sx,
  ...props
}: LogoutButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const buttonSx = sx
    ? [defaultButtonSx, ...(Array.isArray(sx) ? sx : [sx])]
    : defaultButtonSx;

  const handleLogout = () => {
    AUTH_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    dispatch(resetUser());
    router.replace(redirectTo);
  };

  return (
    <Tooltip title="Logout">
      <IconButton
        aria-label="Logout"
        onClick={handleLogout}
        sx={buttonSx}
        {...props}
      >
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
