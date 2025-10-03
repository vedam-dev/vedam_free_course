import { Box, SxProps, Theme } from '@mui/material';
import React, { ReactNode } from 'react';

interface HighlightTextProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const BaseDecoration: React.FC<HighlightTextProps> = ({ children, sx }) => {
  return (
    <Box
      component="span"
      sx={{
        position: 'relative',
        display: 'inline-block',
        paddingBottom: '6px',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: 0,
          right: 0,
          height: '20px',
          backgroundImage: 'url("/assets/Vector8.png")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        },
        ...sx, // Merge custom sx props
      }}
    >
      {children}
    </Box>
  );
};

export default BaseDecoration;