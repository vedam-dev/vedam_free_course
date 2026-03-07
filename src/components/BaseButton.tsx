'use client';

import { Button, ButtonProps, styled } from '@mui/material';
import React from 'react';

const VEDAM_PURPLE = '#6C10BC';

const StyledButton = styled(Button)<ButtonProps>(({ theme, variant }) => {
  return {
    fontWeight: 700,
    padding: '10px 50px',
    textTransform: 'none',
    borderWidth: '2px',
    borderRadius: '0.875rem',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 40px',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    ...(variant === 'contained' && {
      background: 'rgba(108, 16, 188, 0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 4px 20px rgba(108, 16, 188, 0.35)',
      color: theme.palette.getContrastText(VEDAM_PURPLE),
      '&:hover': {
        background: 'rgba(108, 16, 188, 0.95)',
        boxShadow: '0 6px 28px rgba(108, 16, 188, 0.55)',
      },
    }),
    ...(variant === 'outlined' && {
      background: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderColor: VEDAM_PURPLE,
      color: VEDAM_PURPLE,
      '&:hover': {
        background: 'rgba(108, 16, 188, 0.08)',
        borderColor: VEDAM_PURPLE,
      },
    }),
  };
});

const BaseButton: React.FC<ButtonProps> = ({
  variant = 'contained',
  sx,
  children,
  ...props
}) => (
  <StyledButton
    variant={variant}
    sx={sx}
    {...props}
  >
    {children}
  </StyledButton>
);

export default BaseButton;