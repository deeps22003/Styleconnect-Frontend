import React, { useState, useEffect } from 'react';
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
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { getFeedbackRatingByAppointmentId,createOrUpdateFeedbackRating } from '../../services/feedbackService';

export default function FeedbackModal({ appointment, onClose, onSuccess }) {
  const [ratingValue, setRatingValue] = useState(null);
  const [comments, setComments] = useState('');
  const [ratingId, setRatingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isOpen = Boolean(appointment);

  useEffect(() => {
    let isMounted = true;

    const syncOrFetchFeedback = async () => {
      if (!appointment) return;

      // 1. If appointment object already contains feedback properties, use them immediately
      const existingId = appointment.ratingId || appointment.feedbackId;
      const existingRating = appointment.ratingValue || appointment.rating;
      const existingComments = appointment.comments || appointment.review;

      if (existingId || existingRating || existingComments) {
        setRatingValue(Number(existingRating || null));
        setComments(existingComments || '');
        setRatingId(existingId || null);
        return;
      }

      // 2. Otherwise, fetch from API only if appointment ID exists
      const resolvedAppointmentId = parseInt(
        appointment.appointmentId || appointment.id || appointment.appointmentID,
        10
      );

      if (!resolvedAppointmentId || isNaN(resolvedAppointmentId)) return;

      setFetchingData(true);
      setErrorMessage('');

      try {
        const existingData = await getFeedbackRatingByAppointmentId(resolvedAppointmentId);

        if (isMounted) {
          if (existingData) {
            setRatingValue(Number(existingData.ratingValue ?? existingData.rating ?? null));
            setComments(existingData.comments || existingData.review || '');
            setRatingId(existingData.ratingId || existingData.feedbackId || null);
          } else {
            // Default reset
            setRatingValue(null);
            setComments('');
            setRatingId(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          setRatingValue(null);
          setComments('');
          setRatingId(null);
        }
      } finally {
        if (isMounted) {
          setFetchingData(false);
        }
      }
    };

    syncOrFetchFeedback();

    return () => {
      isMounted = false;
    };
  }, [appointment]);

  const handleReset = () => {
    setRatingValue(null);
    setComments('');
    setRatingId(null);
    setErrorMessage('');
  };

  const handleClose = () => {
    handleReset();
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointment) return;
     if (!ratingValue) {
        setErrorMessage("Please provide a rating.");
        return;
    }

    const resolvedAppointmentId = parseInt(
      appointment.appointmentId || appointment.id || appointment.appointmentID,
      10
    );

    if (!resolvedAppointmentId || isNaN(resolvedAppointmentId)) {
      setErrorMessage('Invalid Appointment ID. Cannot submit feedback.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const payload = {
      ratingId: ratingId ? parseInt(ratingId, 10) : 0,
      appointmentId: resolvedAppointmentId,
      ratingValue: parseInt(ratingValue, 10),
      comments: comments.trim()
    };

    try {
      await createOrUpdateFeedbackRating(payload);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      const serverMsg = error.response?.data?.message || error.response?.data || error.message;
      setErrorMessage(typeof serverMsg === 'string' ? serverMsg : 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
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
            {ratingId ? 'Edit Your Feedback' : 'Leave Feedback & Rating'}
          </Typography>
          <Typography variant="body2">
            {ratingId
              ? 'Update your previous review and rating.'
              : 'Tell us how your appointment went.'}
          </Typography>

        </Box>
        <IconButton onClick={handleClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: '#F0E6E1', position: 'relative', minHeight: 180 }}>
          {fetchingData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress size={32} sx={{ color: '#8C2B4E' }} />
            </Box>
          ) : (
            <Stack spacing={3}>
              {errorMessage && (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                  {errorMessage}
                </Alert>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1A1A1A' }}>
                  Rating
                </Typography>
                <Rating
                  name="appointment-rating"
                  value={ratingValue}
                  onChange={(event, newValue) => {
                    if (newValue !== null) setRatingValue(newValue);
                  }}
                  size="large"
                  sx={{ color: '#8C2B4E' }}
                  emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1A1A1A' }}>
                  Your Review
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Share details about punctuality, quality, and expertise..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  variant="outlined"
                  sx={fieldStyle}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || fetchingData}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : (ratingId ? 'Update Feedback' : 'Submit Feedback')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}