import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

interface HighlightTextProps {
  children: ReactNode;
}

const BaseDecoration: React.FC<HighlightTextProps> = ({ children }) => {
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
          bottom: 0,
          left: 0,
          right: 0,
          height: '20px',
          backgroundImage: 'url("/assets/Vector8.png")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        },
      }}
    >
      {children}
    </Box>
  );
};

export default BaseDecoration;
