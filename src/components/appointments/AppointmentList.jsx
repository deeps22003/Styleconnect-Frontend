import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentsThunk } from '../../store/slices/appointmentSlice';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Box,
  Stack, 
  CircularProgress 
} from '@mui/material';
import apiClient from '../../services/apiClient';

const EMPTY_OBJECT = {};

const formatTime12Hour = (timeStr) => {
  if (!timeStr) return '';
  const cleanStr = timeStr.trim().toUpperCase();
  if (cleanStr.includes('AM') || cleanStr.includes('PM')) {
    return cleanStr;
  }

  const parts = cleanStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';

  if (isNaN(hours)) return timeStr;

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHour = String(hours).padStart(2, '0');

  return `${formattedHour}:${minutes} ${period}`;
};

const formatDateTime = (appointment) => {
  let dateVal = appointment.appointmentDate || appointment.date || appointment.feedbackDate || '';
  if (!dateVal) return 'Scheduled Time N/A';

  if (typeof dateVal === 'string' && dateVal.includes(' ') && !dateVal.includes('T')) {
    dateVal = dateVal.trim().replace(' ', 'T');
  }

  const parsedDate = new Date(dateVal);
  if (isNaN(parsedDate.getTime())) return 'Scheduled Time N/A';

  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const rawStartTime = appointment.startTime || appointment.time || appointment.slotTime;
  const rawEndTime = appointment.endTime || appointment.slotEndTime;

  if (rawStartTime) {
    const startTime = formatTime12Hour(rawStartTime);
    const endTime = rawEndTime ? formatTime12Hour(rawEndTime) : '';
    return endTime ? `${formattedDate} at ${startTime} - ${endTime}` : `${formattedDate} at ${startTime}`;
  }

  const formattedTime = parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `${formattedDate} at ${formattedTime}`;
};

export default function AppointmentList({ 
  appointments: propsAppointments, 
  onLeaveFeedback, 
  onEditAppointment, 
  customerId: propCustomerId
}) {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth?.user);

  const activeCustomerId = 
    propCustomerId || 
    authUser?.customerId || 
    JSON.parse(localStorage.getItem('user') || '{}')?.customerId;

  const appointmentsState = useSelector((state) => state.appointments) || EMPTY_OBJECT;
  const reduxAppointments = appointmentsState.items;
  const loading = appointmentsState.loading || false;
  const error = appointmentsState.error || null;

  const [expertsList, setExpertsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    if (!propsAppointments && activeCustomerId) {
      dispatch(fetchAppointmentsThunk({ userType: 1, userId: activeCustomerId }));
    }

    const savedExperts = localStorage.getItem('experts');
    if (savedExperts) {
      try {
        setExpertsList(JSON.parse(savedExperts));
      } catch (err) {
        console.error('Error parsing experts from localStorage', err);
      }
    }

    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        setServicesList(JSON.parse(savedServices));
      } catch (err) {
        console.error('Error parsing services from localStorage', err);
      }
    }
  }, [dispatch, activeCustomerId, propsAppointments]);

  const appointments = propsAppointments || reduxAppointments;

  const handleFeedbackClick = async (appointment) => {
    if (!onLeaveFeedback) return;

    const targetAppointmentId = appointment.appointmentId || appointment.id;

    if (appointment.feedbackId || appointment.ratingId || appointment.ratingValue || appointment.comments) {
      onLeaveFeedback({
        ...appointment,
        appointmentId: targetAppointmentId,
        feedbackId: appointment.feedbackId || appointment.ratingId,
        ratingId: appointment.ratingId || appointment.feedbackId,
        ratingValue: appointment.ratingValue || appointment.rating,
        comments: appointment.comments || appointment.review
      });
      return;
    }

    try {
      const existingFeedback = await apiClient.getFeedbackRatingByAppointmentId(targetAppointmentId);

      if (existingFeedback) {
        onLeaveFeedback({
          ...appointment,
          appointmentId: targetAppointmentId,
          feedbackId: existingFeedback.feedbackId || existingFeedback.ratingId,
          ratingId: existingFeedback.ratingId || existingFeedback.feedbackId,
          ratingValue: existingFeedback.ratingValue || existingFeedback.rating,
          comments: existingFeedback.comments || existingFeedback.review
        });
        return;
      }
    } catch (err) {
      // Missing feedback fallback
    }

    onLeaveFeedback({
      ...appointment,
      appointmentId: targetAppointmentId
    });
  };

  if (loading && (!appointments || !appointments.length)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error && (!appointments || !appointments.length)) {
    return (
      <Typography color="error" align="left" sx={{ py: 2 }}>
        ⚠️ {typeof error === 'string' ? error : 'Failed to load appointments.'}
      </Typography>
    );
  }

  if (!activeCustomerId && (!appointments || appointments.length === 0)) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        Please log in as a customer to view appointments.
      </Typography>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        No appointments found.
      </Typography>
    );
  }

  const getStatusStyles = (status) => {
    const raw = status?.toLowerCase();
    if (raw === 'completed') return { bg: '#e0f7fa', text: '#006064' };
    if (raw === 'confirmed') return { bg: '#e8f5e9', text: '#2e7d32' };
    if (raw === 'declined' || raw === 'cancelled') return { bg: '#ffebee', text: '#c62828' };
    return { bg: '#fff8e1', text: '#f57f17' };
  };

  return (
    <Stack spacing={2.5} sx={{ mt: 2, textAlign: 'left' }}>
      {appointments.map((item, index) => {
        const currentStatus = item.statusName || item.status || 'Pending';
        const rawStatus = currentStatus.toLowerCase();
        
        const isCompleted = rawStatus === 'completed';
        const isCancelled = rawStatus === 'cancelled';
        const isDeclined = rawStatus === 'declined';
        const isStudio = item.locationType === 'At Expert Studio';
        const badgeStyle = getStatusStyles(currentStatus);

        const matchedExpert = expertsList.find(
          (exp) => exp.expertId === item.expertId || exp.id === item.expertId
        );

        const matchedService = servicesList.find(
          (srv) => srv.serviceCategoryId === item.serviceCategoryId || srv.id === item.serviceCategoryId
        );

        const serviceTitle = 
          item.serviceCategoryName || 
          item.serviceName || 
          item.service || 
          (matchedService ? matchedService.categoryName || matchedService.serviceName || matchedService.name : null);

        const occasionTitle = item.occasion;

        // COMBINED DISPLAY TITLE FOR SERVICE NAME & OCCASION
        let displayTitle = 'General Service';
        if (serviceTitle && occasionTitle) {
          displayTitle = `${serviceTitle} - ${occasionTitle}`;
        } else if (serviceTitle) {
          displayTitle = serviceTitle;
        } else if (occasionTitle) {
          displayTitle = occasionTitle;
        }

        const expertDisplayName = 
          item.expertBusinessName || 
          item.expertName || 
          item.expertFullName || 
          (matchedExpert ? matchedExpert.name || `${matchedExpert.firstName} ${matchedExpert.lastName}` : null) || 
          `Expert #${item.expertId || 'N/A'}`;

        const displayAddress = 
          item.address || 
          item.serviceAddress || 
          (item.addressId ? `Address ID #${item.addressId}` : 'Doorstep Service');

        const itemKey = item.appointmentId 
          ? `apt-${item.appointmentId}-${index}` 
          : item.id 
            ? `apt-${item.id}-${index}` 
            : `apt-${index}`;

        const hasFeedback = Boolean(
          item.feedbackId || 
          item.ratingId || 
          item.ratingValue || 
          item.comments || 
          item.hasFeedback
        );

        return (
          <Card 
            key={itemKey} 
            variant="outlined" 
            sx={{ p: 1, textAlign: 'left', borderRadius: 2 }}
          >
            <CardContent sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, textAlign: 'left' }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" component="h3" sx={{ color: 'text.primary', textAlign: 'left', fontWeight: 700 }}>
                    {displayTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25, textAlign: 'left' }}>
                    Expert: <strong style={{ color: '#333' }}>{expertDisplayName}</strong>
                  </Typography>
                </Box>
                <Chip 
                  label={`• ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}`} 
                  size="small"
                  sx={{ 
                    backgroundColor: badgeStyle.bg, 
                    color: badgeStyle.text, 
                    fontWeight: 600,
                    px: 1,
                    py: 0.5,
                    fontSize: '0.82rem'
                  }}
                />
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center',
                  columnGap: 4, 
                  rowGap: 1,
                  my: 1.5, 
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  textAlign: 'left'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🗓️</span>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left', fontWeight: 500 }}>
                    {formatDateTime(item)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>📍</span>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                    {item.locationType || 'Doorstep Service'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>💳</span>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                    Price: ₹{(item.totalPrice || item.price || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: 'text.primary', my: 1.5, fontSize: '0.88rem', textAlign: 'left', width: '100%' }}>
                <strong>{isStudio ? 'Studio Address:' : 'Address:'}</strong>{' '}
                {displayAddress}
              </Typography>

              <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: 'flex-start' }}>
                {isCompleted && (
                  <Button 
                    variant={hasFeedback ? "outlined" : "contained"} 
                    color="primary"
                    size="small"
                    onClick={() => handleFeedbackClick(item)}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2
                    }}
                  >
                    {hasFeedback ? '✏️ Edit Feedback & Rating' : '★ Leave Feedback & Rating'}
                  </Button>
                )}

                {!isCompleted && !isCancelled && (
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="small"
                    disabled={isDeclined}
                    onClick={() => onEditAppointment && onEditAppointment(item)}
                  >
                    ✏️ Edit Details
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}