'use client';

import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';
import type { IconButtonProps, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

import { resetUser } from '@/lib/store';
import type { AppDispatch } from '@/lib/store';

const defaultButtonSx: SxProps<Theme> = {
  color: '#b42318',
  background: 'rgba(255, 243, 240, 0.9)',
  border: '1px solid rgba(180, 35, 24, 0.2)',
  boxShadow: '0 4px 14px rgba(180, 35, 24, 0.12)',
  '&:hover': {
    background: 'rgba(180, 35, 24, 0.08)',
  },
};

interface AdminLogoutButtonProps extends Omit<IconButtonProps, 'aria-label' | 'onClick'> {
  redirectTo?: string;
}

export default function AdminLogoutButton({
  redirectTo = '/login',
  sx,
  ...props
}: AdminLogoutButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const buttonSx = sx
    ? [defaultButtonSx, ...(Array.isArray(sx) ? sx : [sx])]
    : defaultButtonSx;

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch(error) {
      console.error('Admin logout failed:', error);
    }

    dispatch(resetUser());
    router.replace(redirectTo);
  };

  return (
    <Tooltip title="Admin Logout">
      <IconButton
        aria-label="Admin Logout"
        onClick={handleLogout}
        sx={buttonSx}
        {...props}
      >
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

