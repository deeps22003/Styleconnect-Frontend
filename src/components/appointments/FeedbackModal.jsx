 import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  Rating,
  Button, 
  Box,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';

export default function FeedbackModal({ appointment, onClose, onSubmit }) {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');

  const isOpen = Boolean(appointment);

  const handleReset = () => {
    setRating(4);
    setReview('');
  };

  const handleClose = () => {
    handleReset();
    if (onClose) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && appointment) {
      onSubmit({
        appointmentId: appointment.appointmentId || appointment.id,
        rating,
        review,
      });
    }
    handleClose();
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FAF6F0',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#E0DCD5' },
      '&:hover fieldset': { borderColor: '#8C2B4E' },
      '&.Mui-focused fieldset': { borderColor: '#8C2B4E' }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle 
        component="div" 
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}
      >
        <Box>
          <Typography 
            variant="h5" 
            component="span" 
            sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1A1A1A', display: 'block' }}
          >
            Leave Feedback & Rating
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            How was your experience with the expert?
          </Typography>
        </Box>
        <IconButton autoFocus onClick={handleClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        {/* FORM BODY */}
        <DialogContent dividers sx={{ borderColor: '#F0E6E1' }}>
          <Stack spacing={3}>
            {/* RATING SECTION */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1A1A1A' }}>
                Rating
              </Typography>
              <Rating
                name="appointment-rating"
                value={rating}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setRating(newValue);
                  }
                }}
                size="large"
                sx={{ color: '#8C2B4E' }}
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
            </Box>

            {/* REVIEW SECTION */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1A1A1A' }}>
                Your Review
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share details about punctuality, quality, and expertise..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                variant="outlined"
                sx={fieldStyle}
              />
            </Box>
          </Stack>
        </DialogContent>

        {/* SUBMIT ACTION */}
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              backgroundColor: '#8C2B4E',
              '&:hover': { backgroundColor: '#70223E' },
              borderRadius: '30px',
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}