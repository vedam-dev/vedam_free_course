import { Box, BoxProps, CSSProperties } from '@mui/material';
import React from 'react';

interface OptimizedBackgroundImageProps extends Omit<BoxProps, 'sx'> {
  src: string;
  priority?: boolean;
  children?: React.ReactNode;
  sx?: CSSProperties;
}

const OptimizedBackgroundImage: React.FC<OptimizedBackgroundImageProps> = ({
  src,
  priority = false,
  children,
  sx,
  ...props
}) => {
  React.useEffect(() => {
    if(priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority]);

  return (
    <Box
      {...props}
      sx={{
        backgroundImage: `url("${src}")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default OptimizedBackgroundImage;