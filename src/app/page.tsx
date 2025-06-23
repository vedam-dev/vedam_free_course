// // import UserForm from '@/components/UserForm';
// // export default function Home() {
// //   return (
// //     <>
// //       {/* <div>Heloo world This is Free course site</div> */}
// //       {/* <RegisterForm/> */}
// //       <UserForm/>
// //     </>
// //   );
// // }
// "use client";
// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   InputAdornment,
//   Paper,
//   Container,
// } from "@mui/material";

// // Validation functions
// const validateEmail = (email: string): boolean => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// };

// const validatePhoneNumber = (phone: string): boolean => {
//   return /^\d{10}$/.test(phone);
// };

// const validateName = (name: string): boolean => {
//   return name.trim().length >= 3;
// };

// interface FormData {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
// }

// interface TouchedFields {
//   fullName: boolean;
//   email: boolean;
//   phoneNumber: boolean;
// }

// export default function OtpVerificationForm() {
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//   });
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"enterDetails" | "enterOTP">("enterDetails");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [touched, setTouched] = useState<TouchedFields>({
//     fullName: false,
//     email: false,
//     phoneNumber: false,
//   });

//   const handleInputChange = (field: keyof FormData) => (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     let value = event.target.value;
//     if (field === "phoneNumber") {
//       value = value.replace(/\D/g, "");
//     }
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleBlur = (field: keyof TouchedFields) => () => {
//     setTouched({ ...touched, [field]: true });
//   };

//   const errors = {
//     fullName: !validateName(formData.fullName),
//     email: !validateEmail(formData.email),
//     phoneNumber: !validatePhoneNumber(formData.phoneNumber),
//   };

//   const sendOTP = async () => {
//     try {
//       const response = await fetch("/api/send-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: `91${formData.phoneNumber}`,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send OTP");
//       }

//       return data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const verifyOTP = async (otpCode: string) => {
//     try {
//       const response = await fetch("/api/verify-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token: otpCode, // Adjust based on your API requirements
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "OTP verification failed");
//       }

//       return data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleSendOTP = async () => {
//     // Mark all fields as touched to show errors
//     setTouched({
//       fullName: true,
//       email: true,
//       phoneNumber: true,
//     });

//     // Check for errors
//     if (errors.fullName || errors.email || errors.phoneNumber) {
//       setError("Please fix the errors before proceeding");
//       return;
//     }

//     setError(null);
//     setIsLoading(true);

//     try {
//       await sendOTP();
//       setStep("enterOTP");
//       setSuccess("OTP sent successfully!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (error: any) {
//       setError(error.message || "Failed to send OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otp || otp.length !== 4) {
//       setError("Please enter a valid 4-digit OTP");
//       return;
//     }

//     setError(null);
//     setIsLoading(true);

//     try {
//       await verifyOTP(otp);
//       setSuccess("Verification successful!");
//       // Handle successful verification (e.g., redirect, update state, etc.)
//       setTimeout(() => {
//         setSuccess(null);
//         // Add your success logic here
//         console.log("User verified successfully:", formData);
//       }, 1500);
//     } catch (error: any) {
//       setError(error.message || "Invalid OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = () => {
//     setOtp("");
//     setError(null);
//     handleSendOTP();
//   };

//   const handleGoBack = () => {
//     setStep("enterDetails");
//     setOtp("");
//     setError(null);
//     setSuccess(null);
//   };

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">
//           {step === "enterDetails" ? "Enter Your Details" : "Verify OTP"}
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {success && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {success}
//           </Alert>
//         )}

//         {step === "enterDetails" ? (
//           <Box component="form" noValidate>
//             <TextField
//               fullWidth
//               label="Full Name"
//               variant="outlined"
//               value={formData.fullName}
//               onChange={handleInputChange("fullName")}
//               onBlur={handleBlur("fullName")}
//               error={touched.fullName && errors.fullName}
//               helperText={
//                 touched.fullName && errors.fullName
//                   ? "Name must be at least 3 characters"
//                   : ""
//               }
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               fullWidth
//               label="Email"
//               type="email"
//               variant="outlined"
//               value={formData.email}
//               onChange={handleInputChange("email")}
//               onBlur={handleBlur("email")}
//               error={touched.email && errors.email}
//               helperText={
//                 touched.email && errors.email
//                   ? "Please enter a valid email"
//                   : ""
//               }
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               fullWidth
//               label="Mobile Number"
//               type="tel"
//               variant="outlined"
//               value={formData.phoneNumber}
//               onChange={handleInputChange("phoneNumber")}
//               onBlur={handleBlur("phoneNumber")}
//               error={touched.phoneNumber && errors.phoneNumber}
//               helperText={
//                 touched.phoneNumber && errors.phoneNumber
//                   ? "Please enter a valid 10-digit number"
//                   : ""
//               }
//               inputProps={{ maxLength: 10 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">+91</InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//             />

//             <Button
//               fullWidth
//               variant="contained"
//               size="large"
//               onClick={handleSendOTP}
//               disabled={isLoading}
//               sx={{
//                 height: 48,
//                 borderRadius: 2,
//               }}
//             >
//               {isLoading ? (
//                 <>
//                   <CircularProgress size={20} sx={{ mr: 1 }} />
//                   Sending...
//                 </>
//               ) : (
//                 "Send OTP"
//               )}
//             </Button>
//           </Box>
//         ) : (
//           <Box>
//             <Typography variant="body1" mb={2} textAlign="center">
//               OTP sent to +91{formData.phoneNumber}
//             </Typography>

//             <TextField
//               fullWidth
//               label="Enter OTP"
//               type="text"
//               variant="outlined"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//               inputProps={{ maxLength: 4 }}
//               sx={{ mb: 2 }}
//             />

//             <Box display="flex" gap={1} mb={2}>
//               <Button
//                 variant="text"
//                 size="small"
//                 onClick={handleResendOTP}
//                 disabled={isLoading}
//               >
//                 Resend OTP
//               </Button>
//               <Button
//                 variant="text"
//                 size="small"
//                 onClick={handleGoBack}
//                 disabled={isLoading}
//               >
//                 Change Number
//               </Button>
//             </Box>

//             <Typography variant="caption" color="text.secondary" mb={2} display="block">
//               Valid for 5 minutes
//             </Typography>

//             <Button
//               fullWidth
//               variant="contained"
//               size="large"
//               onClick={handleVerifyOTP}
//               disabled={isLoading || otp.length !== 4}
//               sx={{
//                 height: 48,
//                 borderRadius: 2,
//               }}
//             >
//               {isLoading ? (
//                 <>
//                   <CircularProgress size={20} sx={{ mr: 1 }} />
//                   Verifying...
//                 </>
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           </Box>
//         )}
//       </Paper>
//     </Container>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import OtpModal from "@/components/otp/OtpModal";

export default function HomePage() {
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Initialize MSG91 OTP widget
  useEffect(() => {
    if (showOtpModal && typeof window !== "undefined") {
      const configuration = {
        widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID,
        tokenAuth: process.env.NEXT_PUBLIC_MSG91_AUTH_KEY,
        exposeMethods: true,
        success: (data: any) => {
          console.log("Verification success:", data);
        },
        failure: (error: any) => {
          console.error("Verification failed:", error);
        },
      };

      const script = document.createElement("script");
      script.src =
        "https://control.msg91.com/app/assets/otp-provider/otp-provider.js";
      script.onload = () => {
        if (window.initSendOTP) {
          window.initSendOTP(configuration);
        }
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [showOtpModal]);

  const handleVerificationSuccess = (userData: {
    name: string;
    email: string;
    phone: string;
  }) => {
    console.log("User verified successfully:", userData);
    // Handle successful verification here
    // Save user data, redirect, etc.
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        OTP Verification Demo
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => setShowOtpModal(true)}
        sx={{ mt: 2 }}
      >
        Open OTP Modal
      </Button>

      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </Box>
  );
}