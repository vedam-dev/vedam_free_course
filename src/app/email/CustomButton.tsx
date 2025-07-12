import { Button, ButtonProps } from '@mui/material';
import React from 'react';

type CustomButtonProps = ButtonProps & {
  label: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({ label, ...props }) => {
  return (
    <Button variant="contained" color="primary" {...props}>
      {label}
    </Button>
  );
};

export default CustomButton;
