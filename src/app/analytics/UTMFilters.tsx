import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';

type Filters = {
  source?: string;
  medium?: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

const UTMFilters = () => {
  const [filters, setFilters] = useState<Filters>({});

  const handleDateChange = (type: 'startDate' | 'endDate', value: Date | null) => {
    console.log(`Date change - ${type}:`, value);

    if(!value) {
      setFilters((prev) => ({ ...prev, [type]: null }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    if(selectedDate > today) {
      console.log('Future date selected - ignoring');
      return;
    }

    if(type === 'endDate' && filters.startDate && selectedDate < filters.startDate) {
      console.log('End date before start date - ignoring');
      return;
    }

    setFilters((prev) => ({ ...prev, [type]: selectedDate }));
  };

  const handleSelectChange = (key: 'source' | 'medium') => (event: SelectChangeEvent<string>) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const startDate = filters.startDate;
  const endDate = filters.endDate;
  const isEndDateDisabled = !startDate;

  return (
    <>

      <div>UTM-Filters</div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FormControl fullWidth>
          <InputLabel id="source-label">Source</InputLabel>
          <Select
            labelId="source-label"
            value={filters.source || ''}
            label="Source"
            onChange={handleSelectChange('source')}
          >
            <MenuItem value="google">Google</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
          </Select>

          <InputLabel id="medium-label">Medium</InputLabel>
          <Select
            labelId="medium-label"
            value={filters.medium || ''}
            label="Medium"
            onChange={handleSelectChange('medium')}
          >
            <MenuItem value="cpc">CPC</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="organic">Organic</MenuItem>
          </Select>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => handleDateChange('startDate', newValue)}
              maxDate={endDate || new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    endAdornment: startDate && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleDateChange('startDate', null)} size="small">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => handleDateChange('endDate', newValue)}
              minDate={startDate || undefined}
              maxDate={new Date()}
              disabled={isEndDateDisabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    endAdornment: endDate && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleDateChange('endDate', null)} size="small">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </Box>
        </FormControl>
      </LocalizationProvider>
    </>
  );
};

export default UTMFilters;
