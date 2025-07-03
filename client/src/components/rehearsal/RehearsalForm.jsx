import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Divider,
  IconButton,
  Switch,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addHours, parseISO } from 'date-fns';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RepeatIcon from '@mui/icons-material/Repeat';

const RehearsalForm = ({ 
  initialData = null, 
  bands = [], 
  venues = [], 
  songs = [], 
  onSubmit, 
  isSubmitting 
}) => {
  const navigate = useNavigate();
  const isEditMode = !!initialData;

  const defaultValues = {
    bandId: initialData?.bandId || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    startTime: initialData?.startTime ? parseISO(initialData.startTime) : new Date(),
    endTime: initialData?.endTime 
      ? parseISO(initialData.endTime) 
      : addHours(new Date(), 2),
    venueName: initialData?.venue?.name || '',
    venueAddress: initialData?.venue?.address || '',
    venueCoordinates: initialData?.venue?.coordinates || null,
    isRecurring: initialData?.isRecurring || false,
    recurringPattern: {
      frequency: initialData?.recurringPattern?.frequency || 'weekly',
      interval: initialData?.recurringPattern?.interval || 1,
      daysOfWeek: initialData?.recurringPattern?.daysOfWeek || [new Date().getDay()],
      endDate: initialData?.recurringPattern?.endDate 
        ? parseISO(initialData.recurringPattern.endDate) 
        : addHours(new Date(), 30),
      count: initialData?.recurringPattern?.count || 4,
    },
    songs: initialData?.songs || [],
    notes: initialData?.notes || '',
  };

  const { 
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors }, 
    reset 
  } = useForm({
    defaultValues,
  });

  const isRecurring = watch('isRecurring');
  const selectedBandId = watch('bandId');
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Filter venues by selected band
  const filteredVenues = venues.filter(
    venue => !selectedBandId || venue.bandId === selectedBandId
  );

  // Handle venue selection
  const handleVenueSelect = (venue) => {
    if (!venue) return;
    
    setSelectedVenue(venue);
    setValue('venueName', venue.name);
    setValue('venueAddress', venue.address);
    setValue('venueCoordinates', venue.coordinates);
  };

  // Handle form submission
  const onFormSubmit = (data) => {
    // Transform data for API
    const formattedData = {
      ...data,
      venue: {
        name: data.venueName,
        address: data.venueAddress,
        coordinates: data.venueCoordinates,
      },
    };
    
    // Remove individual venue fields
    delete formattedData.venueName;
    delete formattedData.venueAddress;
    delete formattedData.venueCoordinates;
    
    onSubmit(formattedData);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditMode ? 'Edit Rehearsal' : 'Schedule New Rehearsal'}
        </Typography>
        
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={3}>
            {/* Band Selection */}
            <Grid item xs={12}>
              <Controller
                name="bandId"
                control={control}
                rules={{ required: 'Please select a band' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.bandId}>
                    <InputLabel id="band-select-label">Band</InputLabel>
                    <Select
                      {...field}
                      labelId="band-select-label"
                      label="Band"
                      disabled={isEditMode}
                    >
                      {bands.map((band) => (
                        <MenuItem key={band._id} value={band._id}>
                          {band.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bandId && (
                      <FormHelperText>{errors.bandId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ 
                  required: 'Title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Rehearsal Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ 
                  maxLength: {
                    value: 500,
                    message: 'Description cannot exceed 500 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={
                      errors.description?.message || 
                      `${field.value.length}/500 characters`
                    }
                  />
                )}
              />
            </Grid>

            {/* Start Time */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: 'Start time is required' }}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Start Time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startTime,
                          helperText: errors.startTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* End Time */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ 
                    required: 'End time is required',
                    validate: value => 
                      value > watch('startTime') || 
                      'End time must be after start time'
                  }}
                  render={({ field }) => (
                    <DateTimePicker
                      label="End Time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endTime,
                          helperText: errors.endTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Venue Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1 }} />
                Venue Details
              </Typography>
            </Grid>

            {/* Venue Selector */}
            <Grid item xs={12}>
              <Autocomplete
                options={filteredVenues}
                getOptionLabel={(option) => option.name}
                value={selectedVenue}
                onChange={(_, newValue) => handleVenueSelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Saved Venue (Optional)"
                    helperText="Select a previously used venue or enter a new one below"
                  />
                )}
              />
            </Grid>

            {/* Venue Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="venueName"
                control={control}
                rules={{ required: 'Venue name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Venue Name"
                    error={!!errors.venueName}
                    helperText={errors.venueName?.message}
                  />
                )}
              />
            </Grid>

            {/* Venue Address */}
            <Grid item xs={12} md={6}>
              <Controller
                name="venueAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Venue Address (Optional)"
                  />
                )}
              />
            </Grid>

            {/* Recurring Pattern */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                  <RepeatIcon sx={{ mr: 1 }} />
                  Recurring Rehearsal
                </Typography>
                <Controller
                  name="isRecurring"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          {...field}
                        />
                      }
                      label=""
                      sx={{ ml: 2 }}
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* Recurring Options - Only show if recurring is enabled */}
            {isRecurring && (
              <>
                {/* Frequency and Interval */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="recurringPattern.frequency"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Frequency</InputLabel>
                        <Select {...field} label="Frequency">
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="biweekly">Bi-weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="recurringPattern.count"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Number of Occurrences"
                        type="number"
                        InputProps={{
                          inputProps: { min: 1, max: 52 }
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {/* Songs Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                <MusicNoteIcon sx={{ mr: 1 }} />
                Songs to Practice (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="songs"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={songs.filter(song => !selectedBandId || song.bandId === selectedBandId)}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.title
                    }
                    value={field.value}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Songs"
                        placeholder="Add songs to practice"
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Additional Notes (Optional)"
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? 'Saving...' 
                    : isEditMode 
                      ? 'Update Rehearsal' 
                      : 'Schedule Rehearsal'
                  }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default RehearsalForm;