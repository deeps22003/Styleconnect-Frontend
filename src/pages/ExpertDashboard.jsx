import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Card, 
  Tabs, 
  Tab, 
  Typography, 
  Alert, 
  CircularProgress 
} from '@mui/material';

import { 
  fetchAppointmentsThunk, 
  updateAppointmentStatusThunk 
} from '../store/slices/appointmentSlice';

import ProfileCard from '../components/appointments/ProfileCard';
import ExpertAppointmentList from '../components/appointments/ExpertAppointmentList';

export default function ExpertDashboard() {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth?.user || state.user);
  const [currentUser] = useState(() => {
    if (authUser && Object.keys(authUser).length > 0) return authUser;
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  // Ensure expertId is parsed as an integer
  const expertId = parseInt(currentUser.expertId || currentUser.id || currentUser.userId || localStorage.getItem('expertId') || 1, 10);

  const { items: appointments = [], loading = false, error = null } = useSelector(
    (state) => state.appointments || {}
  );

  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    if (expertId) {
      // Pass userType: 0 (0 = Expert, 1 = Customer) to match backend route /api/Appointments/{userType:int}/{userId:int}
      dispatch(fetchAppointmentsThunk({ userType: 0, userId: expertId }));
    }
  }, [dispatch, expertId]);

  // Handler for updating appointment status using integer IDs matching backend expectations
  const handleStatusChange = async (appointmentId, statusId) => {
    try {
      await dispatch(
        updateAppointmentStatusThunk({ appointmentId, appointmentStatusId: statusId })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#FAF6F0', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        
        {/* Profile Header */}
        <ProfileCard 
          user={currentUser}
          name={currentUser.name || currentUser.fullName || 'Expert'}
          roleBadge="Expert Account"
          statusBadge="• Accepting Bookings"
          avatarInitial={(currentUser.name || currentUser.fullName || 'E').charAt(0).toUpperCase()}
        />

        {/* Navigation Tabs */}
        <Box sx={{ my: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="expert dashboard tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#8C2B4E',
                height: 3,
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#4A4A4A',
                '&.Mui-selected': {
                  color: '#8C2B4E'
                }
              }
            }}
          >
            <Tab label="Appointments & Location Requests" value="requests" />
            <Tab label="Client Feedback & Ratings" value="feedback" />
          </Tabs>
        </Box>

        {/* Tab View Switcher */}
        {activeTab === 'requests' ? (
          <Card 
            elevation={0}
            sx={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '24px', 
              p: 4, 
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
            }}
          >
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontFamily: 'Georgia, serif', 
                fontWeight: 700, 
                color: '#1A1A1A', 
                mb: 3 
              }}
            >
              Manage Appointment Requests
            </Typography>

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <CircularProgress size={24} sx={{ color: '#8C2B4E' }} />
                <Typography color="text.secondary">Loading appointments...</Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                {typeof error === 'string' ? error : 'Failed to load appointments.'}
              </Alert>
            )}

            {!loading && !error && (
              <ExpertAppointmentList 
                appointments={appointments}
                onStatusChange={handleStatusChange}
                /* Map status actions to your backend Status IDs:
                   1 = Pending, 2 = Confirmed, 3 = Cancelled/Declined, 4 = Completed */
                onConfirm={(id) => handleStatusChange(id, 2)}
                onDecline={(id) => handleStatusChange(id, 3)}
                onComplete={(id) => handleStatusChange(id, 4)}
              />
            )}
          </Card>
        ) : (
          <Card 
            elevation={0}
            sx={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '24px', 
              p: 4, 
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
            }}
          >
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1A1A1A', mb: 2 }}
            >
              Client Feedback & Ratings
            </Typography>
            <Typography color="text.secondary">
              No feedback submitted yet.
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
}