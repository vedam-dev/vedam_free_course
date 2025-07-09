import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React from 'react';

interface CustomModalProps {
  open: boolean;
  onClose: (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick') => void;
  title: string;
  children: React.ReactNode;
  sx?: object;
}

const CustomModal = ({ open, onClose, title, children, sx = {} }: CustomModalProps) => {
  const titleId = React.useId();

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
    ...sx,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      disableScrollLock={false}
    >
      <Box sx={modalStyle}>
        {/* Header with title and close button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography id={titleId} variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton
            onClick={(e) => onClose(e, 'closeButtonClick')}
            aria-label="close"
            sx={{ position: 'relative', top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box>
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;