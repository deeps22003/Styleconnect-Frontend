import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
  Paper,
  Rating,
  Divider
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaceIcon from '@mui/icons-material/Place';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function ExpertAppointmentList({ 
  appointments = [], 
  feedbacks,
  onStatusChange,
  onConfirm,
  onDecline,
  onComplete 
}) {
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        setServicesList(JSON.parse(savedServices));
      } catch (err) {
        console.error('Error parsing services from localStorage', err);
      }
    }
  }, []);

  // Helper to format time strings safely
  const formatSingleTime = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;

    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    if (isNaN(h)) return timeStr;

    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Helper to format appointment date & time
  const formatDateTime = (item) => {
    if (!item) return 'Date not specified';
    const dateStr = item.appointmentDate || item.date || '';
    const startTimeStr = item.startTime || item.time || item.slotTime || '';
    const endTimeStr = item.endTime || item.slotEndTime || '';

    let formattedDate = 'Date not specified';

    if (dateStr) {
      const cleanDateStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      const dateObj = new Date(`${cleanDateStr}T00:00:00`);

      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else {
        formattedDate = dateStr;
      }
    }

    const startTimeFormatted = formatSingleTime(startTimeStr);

    if (endTimeStr) {
      const endTimeFormatted = formatSingleTime(endTimeStr);
      return `${formattedDate} at ${startTimeFormatted} - ${endTimeFormatted}`;
    }

    if (startTimeFormatted) {
      try {
        const [timePart, modifier] = startTimeFormatted.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(startDate.getTime() + 90 * 60000);

        let endHours = endDate.getHours();
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        const endModifier = endHours >= 12 ? 'PM' : 'AM';

        endHours = endHours % 12 || 12;
        const calculatedEndTime = `${String(endHours).padStart(2, '0')}:${endMinutes} ${endModifier}`;

        return `${formattedDate} at ${startTimeFormatted} - ${calculatedEndTime}`;
      } catch (err) {
        return `${formattedDate} at ${startTimeFormatted}`;
      }
    }

    return formattedDate;
  };

  const resolveStatus = (item) => {
    const statusId = item.appointmentStatusId ?? item.statusId;
    if (typeof statusId === 'number') {
      switch (statusId) {
        case 2: return 'confirmed';
        case 3: return 'declined';
        case 4: return 'completed';
        default: return 'pending';
      }
    }

    const rawStr = item.statusName || item.appointmentStatusName || item.status || 'pending';
    const lower = rawStr.toLowerCase();
    if (lower.includes('confirm')) return 'confirmed';
    if (lower.includes('declin') || lower.includes('cancel')) return 'declined';
    if (lower.includes('complet')) return 'completed';
    return 'pending';
  };

  const getBadgeStyle = (statusKey) => {
    switch (statusKey) {
      case 'confirmed':
        return { bg: '#E8F5E9', color: '#2E7D32', label: '• Confirmed' };
      case 'completed':
        return { bg: '#E1F5FE', color: '#0288D1', label: '• Completed' };
      case 'declined':
        return { bg: '#FFEBEE', color: '#C62828', label: '• Declined' };
      default:
        return { bg: '#FFF3E0', color: '#E65100', label: '• Pending Request' };
    }
  };

  const handleConfirm = (id) => {
    if (onConfirm) onConfirm(id);
    else if (onStatusChange) onStatusChange(id, 2);
  };

  const handleDecline = (id) => {
    if (onDecline) onDecline(id);
    else if (onStatusChange) onStatusChange(id, 3);
  };

  const handleComplete = (id) => {
    if (onComplete) onComplete(id);
    else if (onStatusChange) onStatusChange(id, 4);
  };

  // -------------------------------------------------------------
  // RENDER PATH 1: FEEDBACKS LIST VIEW (IF 'feedbacks' PROP PASSED)
  // -------------------------------------------------------------
  if (Array.isArray(feedbacks)) {
    if (feedbacks.length === 0) {
      return (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#FDFBF7', borderRadius: 3, border: '1px solid #E0E0E0' }}>
          <Typography variant="body1" color="text.secondary">
            No feedback or ratings received yet.
          </Typography>
        </Paper>
      );
    }

    return (
      <Stack spacing={2.5}>
        {feedbacks.map((fb, index) => {
          const feedbackId = fb.feedbackId || fb.ratingId || fb.id || index;
          const appointmentId = fb.appointmentId || fb.appointment_id;

          // Match appointment details from appointments array
          const matchedApt = appointments.find(
            (apt) => (apt.appointmentId || apt.id) === appointmentId
          ) || fb.appointment || {};

          const addressText = matchedApt.address?.addressLine1 
            || matchedApt.serviceAddress 
            || matchedApt.address 
            || 'Doorstep Address';

          const clientName = matchedApt.customerName 
            || matchedApt.clientName 
            || `${matchedApt.customer?.userProfile?.firstName || ''} ${matchedApt.customer?.userProfile?.lastName || ''}`.trim()
            || fb.customerName 
            || 'Valued Client';

        const serviceTitle =
          matchedApt.serviceCategoryName ||
          matchedApt.serviceName ||
          matchedApt.service ||
          fb.serviceCategoryName ||
          null;

          const occasionTitle = matchedApt.occasion;

          let displayTitle = 'Beauty Service';
          if (serviceTitle && occasionTitle) {
            displayTitle = `${serviceTitle} - ${occasionTitle}`;
          } else if (serviceTitle) {
            displayTitle = serviceTitle;
          } else if (occasionTitle) {
            displayTitle = occasionTitle;
          }

          const ratingVal = fb.ratingValue ?? fb.rating ?? fb.score ?? 5;
          const reviewText = fb.comments || fb.review || fb.comment || 'No comments provided.';

          // UPDATED: Added fb.ratingDate fallback
          const submittedDateStr = fb.ratingDate || fb.createdDate || fb.submittedDate || fb.feedbackDate;
          let formattedSubmittedDate = '';
          if (submittedDateStr) {
            const d = new Date(submittedDateStr);
            formattedSubmittedDate = !isNaN(d.getTime()) 
              ? d.toLocaleDateString('en-GB') 
              : submittedDateStr;
          }

          return (
            <Card 
              key={feedbackId} 
              variant="outlined" 
              sx={{ 
                borderRadius: 4, 
                borderColor: '#EFEFEF', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                bgcolor: '#FFFFFF',
                p: 0.5
              }}
            >
              <CardContent>
                {/* APPOINTMENT HEADER */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>
                      {displayTitle}{' '}
                      <Typography component="span" variant="body1" sx={{ color: '#555', fontWeight: 500 }}>
                        — Client: {clientName}
                      </Typography>
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                      Type:{' '}
                      <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: '#222' }}>
                        {matchedApt.locationType || 'At Home Service (Doorstep)'}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>

                {/* META INFO (DATE/TIME & ADDRESS) */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ my: 2, color: '#555' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventNoteIcon sx={{ fontSize: 18, color: '#1976D2' }} />
                    <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                      {formatDateTime(matchedApt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlaceIcon sx={{ fontSize: 18, color: '#D32F2F' }} />
                    <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                      {addressText}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2, borderColor: '#F0F0F0' }} />

                {/* FEEDBACK & RATING ROW */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ pr: 2 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic', 
                        color: '#333', 
                        fontWeight: 500, 
                        mb: 0.5 
                      }}
                    >
                      "{reviewText}"
                    </Typography>
                    {formattedSubmittedDate && (
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        Submitted: {formattedSubmittedDate}
                      </Typography>
                    )}
                  </Box>

                  <Rating 
                    value={Number(ratingVal)} 
                    readOnly 
                    precision={0.5} 
                    sx={{ color: '#8C2B4E' }} 
                  />
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  }

  // -------------------------------------------------------------
  // RENDER PATH 2: STANDARD APPOINTMENTS LIST VIEW
  // -------------------------------------------------------------
  if (!appointments || appointments.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#FDFBF7', borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Typography variant="body1" color="text.secondary">
          No appointment requests found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2.5}>
      {appointments.map((item, index) => {
        const statusKey = resolveStatus(item);
        const isConfirmed = statusKey === 'confirmed';
        const isPending = statusKey === 'pending';
        const appointmentId = item.appointmentId || item.id || index;
        const badgeStyle = getBadgeStyle(statusKey);

        const addressText = item.address?.addressLine1 
          || item.serviceAddress 
          || item.address 
          || 'Doorstep Address';

        const clientName = item.customerName 
          || item.clientName 
          || `${item.customer?.userProfile?.firstName || ''} ${item.customer?.userProfile?.lastName || ''}`.trim()
          || 'Valued Client';

       const serviceTitle =
          item.serviceCategoryName ||
          item.serviceName ||
          item.service ||
          null;
        const occasionTitle = item.occasion;

        let displayTitle = 'Beauty Service';
        if (serviceTitle && occasionTitle) {
          displayTitle = `${serviceTitle} - ${occasionTitle}`;
        } else if (serviceTitle) {
          displayTitle = serviceTitle;
        } else if (occasionTitle) {
          displayTitle = occasionTitle;
        }

        return (
          <Card 
            key={appointmentId} 
            variant="outlined" 
            sx={{ 
              borderRadius: 4, 
              borderColor: '#EFEFEF', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              bgcolor: '#FFFFFF',
              p: 0.5
            }}
          >
            <CardContent>
              {/* TOP ROW: SERVICE & CLIENT INFO */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>
                    {displayTitle}{' '}
                    <Typography component="span" variant="body1" sx={{ color: '#555', fontWeight: 500 }}>
                      — Client: {clientName}
                    </Typography>
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                    Type:{' '}
                    <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: '#222' }}>
                      {item.locationType || 'At Home Service (Doorstep)'}
                    </Typography>
                  </Typography>
                </Box>

                {/* STATUS BADGE */}
                <Chip
                  label={badgeStyle.label}
                  size="small"
                  sx={{
                    bgcolor: badgeStyle.bg,
                    color: badgeStyle.color,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    borderRadius: 5,
                    px: 0.5
                  }}
                />
              </Box>

              {/* META INFO ROW */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ my: 2, color: '#555' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventNoteIcon sx={{ fontSize: 18, color: '#1976D2' }} />
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                    {formatDateTime(item)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlaceIcon sx={{ fontSize: 18, color: '#D32F2F' }} />
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                    {addressText}
                  </Typography>
                </Box>
              </Stack>

              {/* ACTION BUTTONS */}
              {isPending && (
                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleConfirm(appointmentId)}
                    sx={{
                      bgcolor: '#2E7D32',
                      '&:hover': { bgcolor: '#1B5E20' },
                      fontWeight: 700,
                      borderRadius: 5,
                      px: 2.5,
                      textTransform: 'none'
                    }}
                  >
                    Confirm Booking
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => handleDecline(appointmentId)}
                    sx={{
                      borderColor: '#D32F2F',
                      color: '#D32F2F',
                      '&:hover': { bgcolor: '#FFEBEE', borderColor: '#C62828' },
                      fontWeight: 700,
                      borderRadius: 5,
                      px: 2.5,
                      textTransform: 'none'
                    }}
                  >
                    Decline
                  </Button>
                </Stack>
              )}

              {isConfirmed && (
                <Stack direction="row" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<DoneAllIcon />}
                    onClick={() => handleComplete(appointmentId)}
                    sx={{
                      bgcolor: '#8C2B4E',
                      '&:hover': { bgcolor: '#6E213D' },
                      fontWeight: 700,
                      borderRadius: 5,
                      px: 2.5,
                      textTransform: 'none'
                    }}
                  >
                    Mark as Completed
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}