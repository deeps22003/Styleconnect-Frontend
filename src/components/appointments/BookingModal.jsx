import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 12-hour format time slots (10:00 AM to 06:00 PM)
const TIME_SLOTS = [
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

const INITIAL_STATE = {
  serviceId: '',
  expertId: '',
  appointmentDate: '',
  startTime: '',
  endTime: '',
  totalPrice: '',
  locationType: 'At Home (Doorstep)',
  serviceAddress: ''
};

export default function BookingModal({
  open = false,
  onClose,
  onSubmit,
  services = [],
  experts = []
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleReset = () => {
    setFormData(INITIAL_STATE);
  };

  const handleClose = (e) => {
    // Blur active element to prevent aria-hidden focus console warnings
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    handleReset();
    if (onClose) onClose(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'serviceId') {
        const selectedService = services.find(
          (s) => String(s.id || s.serviceId) === String(value)
        );
        if (selectedService && (selectedService.price || selectedService.totalPrice)) {
          updated.totalPrice = selectedService.price || selectedService.totalPrice;
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSubmit) return;

    const sanitizedPayload = {
      ...formData,
      serviceId: Number(formData.serviceId),
      expertId: Number(formData.expertId),
      totalPrice: Number(String(formData.totalPrice).replace(/[^0-9.-]+/g, '')) || 0
    };

    onSubmit(sanitizedPayload);
    handleReset();
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FAF6F0',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#E0DCD5' },
      '&:hover fieldset': { borderColor: '#8C2B4E' },
      '&.Mui-focused fieldset': { borderColor: '#8C2B4E' }
    },
    '& .MuiInputLabel-root': { color: '#1A1A1A', fontWeight: 600 }
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 2,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }
        }
      }}
    >
      <DialogTitle component="div" sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="span" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>
          Book a New Service
        </Typography>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 1 }}>
          <Grid container spacing={2}>
            
            {/* Select Service */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Select Service"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>Choose a service...</MenuItem>
                {services.map((item) => {
                  const id = item.id || item.serviceId;
                  const name = item.name || item.serviceName;
                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            {/* Select Expert */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Select Expert"
                name="expertId"
                value={formData.expertId}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>Choose an expert...</MenuItem>
                {experts.map((exp) => {
                  const id = exp.id || exp.expertId;
                  const name = exp.name || exp.expertName;
                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            {/* Date */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldStyle}
              />
            </Grid>

            {/* Start Time Dropdown */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                select
                fullWidth
                required
                label="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>Select Start</MenuItem>
                {TIME_SLOTS.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* End Time Dropdown */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                select
                fullWidth
                required
                label="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>Select End</MenuItem>
                {TIME_SLOTS.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Total Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Total Price (₹)"
                placeholder="Auto-calculated or enter price"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            {/* Location Type */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Location Type"
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="At Home (Doorstep)">At Home (Doorstep)</MenuItem>
                <MenuItem value="At Expert Studio">At Expert Studio</MenuItem>
              </TextField>
            </Grid>

            {/* Service Address */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Service Address"
                placeholder="Enter your address"
                name="serviceAddress"
                value={formData.serviceAddress}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 1, pt: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#A33A5E',
              '&:hover': { backgroundColor: '#8C2B4E' },
              borderRadius: '30px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Confirm & Book Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}