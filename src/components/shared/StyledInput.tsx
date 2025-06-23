import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
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
  marginBottom: theme.spacing(2),
}));

interface StyledInputProps extends Omit<TextFieldProps, 'variant'> {
  startAdornment?: React.ReactNode;
}

export default function StyledInput({ startAdornment, ...props }: StyledInputProps) {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      InputProps={{
        startAdornment,
        ...props.InputProps,
      }}
      {...props}
    />
  );
}