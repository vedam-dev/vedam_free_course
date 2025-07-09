'use client';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useState } from 'react';

import CustomModal from '../../components/CustomModal';

const ModalPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open Modal</Button>

      <CustomModal
        open={open}
        onClose={handleClose}
        title="Payment Details"
      >
        {/* Your custom content here */}
        <Box>
          <Typography><strong>Transaction ID:</strong> 198026VEDAM</Typography>
          <Typography><strong>Date:</strong> 07/04/2025</Typography>
          <Typography><strong>Amount:</strong> ₹105,000</Typography>
          <Typography><strong>Status:</strong> Success</Typography>
        </Box>
      </CustomModal>
    </div>
  );
};

export default ModalPage;