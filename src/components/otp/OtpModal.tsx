'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
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
    passout_year: string
    stream: string
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
  const [passout_year, setpassout_year] = useState('2026');
  const [stream, setStream] = useState('PCM');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
  });
  const [isVerified, setIsVerified] = useState(false);

  const dispatch = useDispatch();
  const isOtpBypassEnabled = process.env.NEXT_PUBLIC_BYPASS_OTP === 'true';
  const isLocalhost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

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
      if(isOtpBypassEnabled && isLocalhost) {
        setStep('enterOTP');
        setSuccess('Local OTP bypass enabled. Use 1234 to continue.');
        setIsLoading(false);
        setTimeout(() => setSuccess(null), 3000);
        return;
      }

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
    passout_year: string
    stream: string
    phone: string
    verificationToken: string
  }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          passout_year: userData.passout_year,
          mobile: userData.phone,
          stream: userData.stream,
          verificationToken: userData.verificationToken,
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
      if(isOtpBypassEnabled && isLocalhost && otp !== '1234') {
        throw new Error('Use 1234 when OTP bypass is enabled on localhost');
      }

      // SERVER-SIDE OTP VERIFICATION
      // Verify OTP with server instead of relying on client-side only
      const verifyResponse = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: phoneNumber,
          otp: otp,
        }),
      });

      const verifyData = await verifyResponse.json();

      if(!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'OTP verification failed');
      }

      console.log('OTP verified successfully on server');

      // Get the verification token from server response
      const verificationToken = verifyData.verificationToken;

      if(!verificationToken) {
        throw new Error('Verification token not received from server');
      }

      // Mark as verified to prevent re-verification
      setIsVerified(true);

      try {
        // Save user data to database with verification token
        const dbResult = await saveUserToDatabase({
          name: fullName,
          email: email,
          passout_year: passout_year,
          phone: phoneNumber,
          stream: stream,
          verificationToken: verificationToken,
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
        setLocalStorageItem('role', 'user');

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
          passout_year: passout_year,
          stream: stream,
          phone: phoneNumber,
        });

        // Close modal with fade effect after a short delay
        setTimeout(() => {
          setSuccess(null);
          handleModalClose();
        }, 2000);
      } catch(dbError) {
        console.error('Error saving to database:', dbError);
        const errorMessage = dbError instanceof Error ? dbError.message : 'Failed to save data. Please try again.';
        setError(errorMessage);
        setIsVerified(false);
      }
    } catch(error) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      setError(errorMessage);
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
    setpassout_year('2026');
    setStream('PCM');
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
    background: 'rgba(255, 237, 213, 0.6)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(108, 16, 188, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
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
              <FormControl fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFA41A',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFA41A',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    '&.Mui-focused': {
                      color: '#FFA41A',
                    },
                  },
                }}
              >
                <InputLabel>Year of 12th Passing</InputLabel>
                <Select
                  value={passout_year}
                  label="Year of Passing"
                  onChange={(e) => setpassout_year(e.target.value)}
                >
                  <MenuItem value="2027">2027</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2023">{'<=2023'}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFA41A',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFA41A',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    '&.Mui-focused': {
                      color: '#FFA41A',
                    },
                  },
                }}
              >
                <InputLabel>Stream</InputLabel>
                <Select
                  value={stream}
                  label="Stream"
                  onChange={(e) => setStream(e.target.value)}
                >
                  <MenuItem value="PCM">PCM</MenuItem>
                  <MenuItem value="PCB">PCB</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>

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
                    background: 'rgba(251, 127, 5, 0.82)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(251, 127, 5, 0.35)',
                    borderRadius: '12px',
                    height: '56px',
                    '&:hover': {
                      background: 'rgba(251, 127, 5, 0.95)',
                      boxShadow: '0 6px 28px rgba(251, 127, 5, 0.5)',
                    },
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

              <Box display="flex" flexDirection="column" gap={1} mt={1}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    sx={{
                      flex: 1,
                      color: '#6C10BC',
                      background: 'rgba(108, 16, 188, 0.06)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(108, 16, 188, 0.15)',
                      borderRadius: '8px',
                      '&:hover': { background: 'rgba(108, 16, 188, 0.12)' },
                    }}
                  >
                    Resend OTP
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleUpdateNumber}
                    disabled={isLoading}
                    sx={{
                      flex: 1,
                      color: '#6C10BC',
                      background: 'rgba(108, 16, 188, 0.06)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(108, 16, 188, 0.15)',
                      borderRadius: '8px',
                      '&:hover': { background: 'rgba(108, 16, 188, 0.12)' },
                    }}
                  >
                    Update Number
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" textAlign="right">
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
                    background: isVerified ? 'rgba(108, 16, 188, 0.82)' : 'rgba(251, 127, 5, 0.82)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: isVerified
                      ? '0 4px 20px rgba(108, 16, 188, 0.35)'
                      : '0 4px 20px rgba(251, 127, 5, 0.35)',
                    borderRadius: '16px',
                    height: '56px',
                    '&:hover': {
                      background: isVerified ? 'rgba(108, 16, 188, 0.95)' : 'rgba(251, 127, 5, 0.95)',
                    },
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
