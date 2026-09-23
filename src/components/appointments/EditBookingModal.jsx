import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Box,
  Stack,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Standard 12-hour slots (10:00 AM to 06:00 PM)
const BASE_TIME_SLOTS = [
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM'
];

// Get current date string in YYYY-MM-DD format
const getTodayIsoDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Clean incoming date value to YYYY-MM-DD string format
const formatToIsoDate = (dateVal) => {
  if (!dateVal) return getTodayIsoDate();
  if (typeof dateVal === 'string' && dateVal.includes('T')) {
    return dateVal.split('T')[0];
  }
  return dateVal;
};

// Normalize incoming 24h or varied time strings to 12h format
const formatTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  const cleanStr = timeStr.trim().toUpperCase();
  if (cleanStr.includes('AM') || cleanStr.includes('PM')) {
    return cleanStr;
  }
  const [hours, minutes] = cleanStr.split(':').map(Number);
  if (isNaN(hours)) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const formattedHour = h12 < 10 ? `0${h12}` : `${h12}`;
  const formattedMin = minutes < 10 ? `0${minutes || 0}` : `${minutes}`;
  return `${formattedHour}:${formattedMin} ${period}`;
};

// Normalize location values
const formatLocationType = (loc) => {
  if (!loc) return 'At Home (Doorstep)';
  if (loc.toLowerCase().includes('doorstep') || loc.toLowerCase().includes('home')) {
    return 'At Home (Doorstep)';
  }
  if (loc.toLowerCase().includes('studio') || loc.toLowerCase().includes('expert')) {
    return 'At Expert Studio';
  }
  return loc;
};

// Ensures current value exists in the options list to prevent MUI out-of-range warnings
const ensureValueInSlots = (slots, value) => {
  if (!value || slots.includes(value)) return slots;
  return [...slots, value].sort();
};

export default function EditBookingModal({ 
  isOpen, 
  onClose, 
  booking, 
  onSaveSuccess,
  serviceOptions = [],
  expertOptions = []
}) {
  const todayStr = getTodayIsoDate();

  const [formData, setFormData] = useState({
    serviceName: '',
    expertName: '',
    appointmentDate: todayStr,
    startTime: '',
    endTime: '',
    totalPrice: '',
    locationType: '',
    serviceAddress: ''
  });

  useEffect(() => {
    if (booking) {
      const parsedDate = formatToIsoDate(booking.appointmentDate || booking.date);
      setFormData({
        serviceName: booking.serviceName || booking.occasion || booking.service || '',
        expertName: booking.expertBusinessName || booking.expertName || booking.expertFullName || '',
        appointmentDate: parsedDate || todayStr,
        startTime: formatTo12Hour(booking.startTime || booking.time || ''),
        endTime: formatTo12Hour(booking.endTime || ''),
        totalPrice: booking.totalPrice ?? booking.price ?? '',
        locationType: formatLocationType(booking.locationType),
        serviceAddress: booking.serviceAddress || booking.address || ''
      });
    }
  }, [booking, todayStr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure selected date is not in the past relative to today
    const finalDate = (formData.appointmentDate && formData.appointmentDate >= todayStr)
      ? formData.appointmentDate 
      : todayStr;

    if (onSaveSuccess) {
      onSaveSuccess({
        ...booking,
        ...formData,
        appointmentDate: finalDate,
        date: finalDate,
        expertBusinessName: formData.expertName,
        address: formData.serviceAddress
      });
    }
    if (onClose) onClose();
  };

  const isModalOpen = Boolean(isOpen && booking);

  // Safely build options that include the loaded booking values
  const startTimeSlots = ensureValueInSlots(BASE_TIME_SLOTS, formData.startTime);
  const endTimeSlots = ensureValueInSlots(BASE_TIME_SLOTS, formData.endTime);

  return (
    <Dialog 
      open={isModalOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 }
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h5" component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Edit Booking Request
        </Typography>
        <IconButton autoFocus onClick={onClose} size="small" aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: '#f0e6e1' }}>
          <Stack spacing={2.5}>
            
            {/* SELECT SERVICE */}
            {serviceOptions.length > 0 ? (
              <TextField
                select
                fullWidth
                label="Select Service"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {serviceOptions.map((service, index) => {
                  const val = typeof service === 'object' ? service.name : service;
                  return (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  );
                })}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Service Name"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="Service Name"
                required
                variant="outlined"
                size="small"
              />
            )}

            {/* SELECT EXPERT */}
            {expertOptions.length > 0 ? (
              <TextField
                select
                fullWidth
                label="Select Expert"
                name="expertName"
                value={formData.expertName}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {expertOptions.map((expert, index) => {
                  const val = typeof expert === 'object' ? (expert.name || expert.expertBusinessName) : expert;
                  return (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  );
                })}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Expert Name"
                name="expertName"
                value={formData.expertName}
                onChange={handleChange}
                placeholder="Expert Name"
                required
                variant="outlined"
                size="small"
              />
            )}

            {/* DATE */}
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: todayStr } // Disallows picking past dates in browser picker
              }}
            />

            {/* START & END TIME */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                fullWidth
                required
                label="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                variant="outlined"
                size="small"
              >
                <MenuItem value="" disabled>Select Start Time</MenuItem>
                {startTimeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                required
                label="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                variant="outlined"
                size="small"
              >
                <MenuItem value="" disabled>Select End Time</MenuItem>
                {endTimeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* TOTAL PRICE */}
            <TextField
              fullWidth
              type="number"
              label="Total Price"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              placeholder="0.00"
              variant="outlined"
              size="small"
              slotProps={{
                htmlInput: { min: '0', step: 'any' },
                input: {
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }
              }}
            />

            {/* LOCATION TYPE */}
            <TextField
              select
              fullWidth
              label="Location Type"
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="At Home (Doorstep)">At Home (Doorstep)</MenuItem>
              <MenuItem value="At Expert Studio">At Expert Studio</MenuItem>
            </TextField>

            {/* SERVICE ADDRESS */}
            <TextField
              fullWidth
              label="Service Address"
              name="serviceAddress"
              value={formData.serviceAddress}
              onChange={handleChange}
              placeholder="Enter address details"
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />

            {/* WARNING NOTE */}
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Submitting updates will send this request back to the Expert for confirmation.
            </Alert>

          </Stack>
        </DialogContent>

        {/* FOOTER ACTIONS */}
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            type="button" 
            onClick={onClose} 
            variant="outlined" 
            color="inherit"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ px: 3, fontWeight: 700 }}
          >
            Submit Updates
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}