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
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { JSX, useEffect, useMemo, useState } from 'react';

import { UTMAnalytics } from './page';

export type Filters = {
  source?: string;
  medium?: string;
  startDate: Date | null;
  endDate: Date | null;
};

type AnalyticsProp = {
  analytics: UTMAnalytics;
 setFilter: (filters: Filters) => void;
};

const UTMFilters = ({ analytics, setFilter }: AnalyticsProp): JSX.Element => {
  const [filters, setFilters] = useState<Filters>({
    source: '',
    medium: '',
    startDate: null,
    endDate: null,
  });
  const { allSources, allMediums } = useMemo(() => {
    const sourcesSet = new Set<string>();
    const mediumsSet = new Set<string>();

    analytics.usersData.forEach(user => {
      const source = user.userSource || 'Direct';
      const medium = user.userMedium || 'None';
      sourcesSet.add(source);
      mediumsSet.add(medium);
    });

    return {
      allSources: Array.from(sourcesSet).sort(),
      allMediums: Array.from(mediumsSet).sort(),
    };
  }, [analytics.usersData]);

  const handleDateChange = (type: 'startDate' | 'endDate', value: Date | null) => {
    if(!value) {
      setFilters(prev => ({ ...prev, [type]: null }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    if(selectedDate > today) return;

    if(type === 'endDate' && filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      if(selectedDate < start) return;
    }

    setFilters(prev => ({ ...prev, [type]: selectedDate }));
  };

  const handleSelectChange = (key: 'source' | 'medium') => (event: SelectChangeEvent<string>) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const startDate = filters.startDate;
  const endDate = filters.endDate;
  const isEndDateDisabled = !startDate;

  useEffect(() => {
    setFilter(filters);
  }, [filters, setFilter]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          UTM Filters
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="source-label">Source</InputLabel>
            <Select
              labelId="source-label"
              value={filters.source || ''}
              label="Source"
              onChange={handleSelectChange('source')}
            >
              <MenuItem value="">
                <em>All Sources</em>
              </MenuItem>
              {allSources.map((source, idx) => (
                <MenuItem key={idx} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="medium-label">Medium</InputLabel>
            <Select
              labelId="medium-label"
              value={filters.medium || ''}
              label="Medium"
              onChange={handleSelectChange('medium')}
            >
              <MenuItem value="">
                <em>All Mediums</em>
              </MenuItem>
              {allMediums.map((medium, idx) => (
                <MenuItem key={idx} value={medium}>
                  {medium}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: 2,
          }}
        >
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
                      <IconButton
                        onClick={() => handleDateChange('startDate', null)}
                        size="small"
                        edge="end"
                        aria-label="clear start date"
                      >
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
                      <IconButton
                        onClick={() => handleDateChange('endDate', null)}
                        size="small"
                        edge="end"
                        aria-label="clear end date"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default UTMFilters;