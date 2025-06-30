"use client";

import React from "react";
import { Button, ButtonProps, styled } from "@mui/material";

const SECONDARY_HEX = "#8A18FF";

const StyledButton = styled(Button)<ButtonProps>(({ theme, variant }) => {
  const hex = SECONDARY_HEX;
  const hoverHex = SECONDARY_HEX;

  return {
    fontWeight: 700,
    padding: '10px 50px',
    textTransform: 'none',
    borderWidth:'2px',
    borderRadius: "0.875rem",
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: {
      padding: '10px 40px',
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    ...(variant === "contained" && {
      backgroundColor: hex,
      color: theme.palette.getContrastText(hex),
      "&:hover": {
        backgroundColor: hoverHex,
      },
    }),
    ...(variant === "outlined" && {
      borderColor: hex,
      color: hex,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
        borderColor: hoverHex,
      },
    }),
  };
});

const BaseButton: React.FC<ButtonProps> = ({
  variant = "contained",
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