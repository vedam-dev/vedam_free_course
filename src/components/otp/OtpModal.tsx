'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Modal,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setIsLoggedIn, setMobile, setUserId, setUsername } from '@/lib/store';

import StyledInput from '../shared/StyledInput';

// Validation functions
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhoneNumber = (phone: string) => {
  return /^\d{10}$/.test(phone);
};

const validateName = (name: string) => {
  return name.trim().length >= 3;
};

interface OtpModalProps {
  open: boolean
  onClose: () => void
  onVerificationSuccess: (userData: {
    name: string
    email: string
    phone: string
  }) => void
}

export default function OtpModal({ open, onClose, onVerificationSuccess }: OtpModalProps) {
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enterPhone' | 'enterOTP'>('enterPhone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
  });
  const [isVerified, setIsVerified] = useState(false);

  const dispatch = useDispatch();

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const errors = {
    fullName: !validateName(fullName),
    email: !validateEmail(email),
    phoneNumber: !validatePhoneNumber(phoneNumber),
  };

  const handleSendOTP = async () => {
    // Mark all fields as touched to show errors
    setTouched({
      fullName: true,
      email: true,
      phoneNumber: true,
    });

    // Check for errors
    if(errors.fullName || errors.email || errors.phoneNumber) {
      setError('Please fix the errors before proceeding');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Using MSG91 widget method
      const formattedPhone = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;

      if(window.sendOtp) {
        window.sendOtp(
          formattedPhone,
          () => {
            setStep('enterOTP');
            setSuccess('OTP sent successfully!');
            setIsLoading(false);
            setTimeout(() => setSuccess(null), 3000);
          },
          (error: unknown) => {
            console.error('Error sending OTP:', error);
            setError('Failed to send OTP. Please try again.');
            setIsLoading(false);
          },
        );
      } else {
        setError('OTP service not initialized. Please try again.');
        setIsLoading(false);
      }
    } catch(error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const saveUserToDatabase = async (userData: {
    name: string
    email: string
    phone: string
  }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          mobile: userData.phone,
        }),
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to save user data');
      }

      const data = await response.json();
      return data;
    } catch(error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  // Helper function to safely set localStorage
  const setLocalStorageItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      // Verify it was set correctly
      const stored = localStorage.getItem(key);
      if(stored !== value) {
        console.warn(`Failed to set localStorage item: ${key}`);
      }
    } catch(error) {
      console.error('Error setting localStorage:', error);
    }
  };

  const handleVerifyOTP = async () => {
    if(!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    if(isVerified) {
      return; 
    }

    setError(null);
    setIsLoading(true);

    try {
      if(window.verifyOtp) {
        // Create a promise to handle the OTP verification
        const verifyOtpPromise = new Promise<void>((resolve, reject) => {
          window.verifyOtp(
            otp,
            () => resolve(),
            (error: unknown) => reject(error),
          );
        });

        // Wait for OTP verification to complete
        await verifyOtpPromise;
        console.log('OTP verified successfully');

        // Mark as verified to prevent re-verification
        setIsVerified(true);

        try {
          // Save user data to database
          const dbResult = await saveUserToDatabase({
            name: fullName,
            email: email,
            phone: phoneNumber,
          });

          // Try multiple ways to extract userId from the response
          let userId = null;

          // Check common response structures
          if(dbResult?.id) {
            userId = dbResult.id;
          } else if(dbResult?._id) {
            userId = dbResult._id;
          } else if(dbResult?.user?.id) {
            userId = dbResult.user.id;
          } else if(dbResult?.user?._id) {
            userId = dbResult.user._id;
          } else if(dbResult?.data?.id) {
            userId = dbResult.data.id;
          } else if(dbResult?.data?._id) {
            userId = dbResult.data._id;
          } else if(dbResult?.insertedId) {
            userId = dbResult.insertedId;
          } else if(dbResult?.result?.insertedId) {
            userId = dbResult.result.insertedId;
          } else if(Array.isArray(dbResult?.user) && dbResult.user.length > 0) {
            // Handle case where user is an array (like your response)
            userId = dbResult.user[0]?.id ?? dbResult.user[0]?._id;
          }

          if(!userId) {
            console.error('No userId found in database response');
            setError('User data saved but ID not found. Please contact support.');
            setIsLoading(false);
            setIsVerified(false); 
            return;
          }

          console.log('User authenticated successfully with ID:', userId);

          // Update Redux state first
          dispatch(setUserId(userId));
          dispatch(setMobile(phoneNumber));
          dispatch(setUsername(fullName));
          dispatch(setIsLoggedIn(true));

          // Set localStorage items with verification
          setLocalStorageItem('userId', String(userId));
          setLocalStorageItem('isLoggedIn', 'true');
          setLocalStorageItem('username', fullName);
          setLocalStorageItem('mobile', phoneNumber);

          // Verify localStorage was set correctly
          const storedUserId = localStorage.getItem('userId');
          console.log('Stored userId in localStorage:', storedUserId);

          if(storedUserId !== String(userId)) {
            console.error('localStorage userId mismatch!', { expected: userId, stored: storedUserId });
          }

          setSuccess('Verification successful! Data saved.');

          // Call the success callback with user data
          onVerificationSuccess({
            name: fullName,
            email: email,
            phone: phoneNumber,
          });

          // Close modal with fade effect after a short delay
          setTimeout(() => {
            setSuccess(null);
            handleModalClose();
          }, 2000);
        } catch(dbError) {
          console.error('Error saving to database:', dbError);
          setError('Verification successful but failed to save data. Please try again.');
          setIsVerified(false); 
        }
      } else {
        setError('OTP service not initialized. Please try again.');
      }
    } catch(error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
      setIsVerified(false); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setError(null);
    setIsVerified(false); 
    handleSendOTP();
  };

  const handleUpdateNumber = () => {
    setStep('enterPhone');
    setOtp('');
    setError(null);
    setSuccess(null);
    setIsVerified(false); 
  };

  const handleModalClose = () => {
    // Reset all states
    setStep('enterPhone');
    setOtp('');
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setError(null);
    setSuccess(null);
    setIsVerified(false); 
    setTouched({
      fullName: false,
      email: false,
      phoneNumber: false,
    });
    onClose();
  };

  useEffect(() => {
    if(open) {
      console.log('Modal opened, current localStorage userId:', localStorage.getItem('userId'));
    }
  }, [open]);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: '#fee5cd',
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
    outline: 0,
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="otp-modal-title"
      aria-describedby="otp-modal-description"
      closeAfterTransition
    >
      <Fade in={open} timeout={500}>
        <Box sx={modalStyle} position="relative">
          <IconButton onClick={handleModalClose} sx={{ position: 'absolute', top: 12, right: 12 }} aria-label="close">
            <CloseIcon />
          </IconButton>

          <Typography id="otp-modal-title" variant="h6" mb={2}>
            {step === 'enterPhone' ? 'Enter Your Details' : 'Verify OTP'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {step === 'enterPhone' ? (
            <>
              <StyledInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName}
                helperText={touched.fullName && errors.fullName ? 'Name must be at least 3 characters' : ''}
                placeholder="Enter your full name"
              />

              <StyledInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
                helperText={touched.email && errors.email ? 'Please enter a valid email' : ''}
                placeholder="Enter your email"
              />

              <StyledInput
                label="Mobile No."
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                onBlur={handleBlur('phoneNumber')}
                error={touched.phoneNumber && errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber ? 'Please enter a valid 10-digit number' : ''}
                placeholder="Enter your phone number"
                inputProps={{ maxLength: 10 }}
                startAdornment={<InputAdornment position="start">+91</InputAdornment>}
              />

              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button
                  variant="contained"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    backgroundColor: '#FFA41A',
                    borderRadius: '12px',
                    height: '56px',
                  }}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" mb={2}>
                OTP sent to +91{phoneNumber}
              </Typography>

              <StyledInput
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4-digit OTP"
                inputProps={{ maxLength: 4 }}
              />

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Box>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    sx={{ mr: 1, color: '#6C10BC' }}
                  >
                    Resend OTP
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleUpdateNumber}
                    disabled={isLoading}
                    sx={{ ml: 1, color: '#6C10BC' }}
                  >
                    Update Number
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Valid for 5 minutes
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 4 || isVerified}
                  fullWidth
                  sx={{
                    backgroundColor: isVerified ? '#4CAF50' : '#FFA41A',
                    borderRadius: '16px',
                    height: '56px',
                  }}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? 'Verifying...' : isVerified ? 'Verified' : 'Verify'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

// Extend Window interface for MSG91 methods
declare global {
  interface Window {
    sendOtp: (phone: string, success: () => void, error: (err: unknown) => void) => void
    verifyOtp: (otp: string, success: () => void, error: (err: unknown) => void) => void
    initSendOTP: (config: unknown) => void
  }
}