import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert 
} from '@mui/material';

import { 
  fetchAppointmentsThunk, 
  createBookingThunk, 
  updateAppointmentThunk
} from '../store/slices/appointmentSlice';

import ProfileCard from '../components/appointments/ProfileCard';
import AppointmentList from '../components/appointments/AppointmentList';
import BookingModal from '../components/appointments/BookingModal';
import EditBookingModal from '../components/appointments/EditBookingModal';
import FeedbackModal from '../components/appointments/FeedbackModal';

const EMPTY_OBJECT = {};

export default function CustomerDashboard() {
  const dispatch = useDispatch();

  // 1. Resolve logged-in user dynamically from Redux or localStorage
  const authUser = useSelector((state) => state.auth?.user || state.user || EMPTY_OBJECT);
  const [currentUser, setCurrentUser] = useState(() => {
    if (authUser && Object.keys(authUser).length > 0) return authUser;
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Keep state updated if auth state updates dynamically
  useEffect(() => {
    if (authUser && Object.keys(authUser).length > 0) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  // Priority mapping: Ensure customerId is checked before primary userId/id
  const userId = currentUser?.customerId || currentUser?.customer_id || currentUser?.id || currentUser?.userId;
  const isExpert = String(currentUser?.role || currentUser?.roleId || '').toLowerCase().includes('expert') || currentUser?.roleId === 2;

  // 2. Extract Redux state
  const appointmentsState = useSelector((state) => state.appointments) || EMPTY_OBJECT;
  const reduxAppointments = appointmentsState.items || [];
  const loading = appointmentsState.loading || false;
  const error = appointmentsState.error || null;

  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);

  // Modal Visibility States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Active Selected Appointments
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Load Data
  const loadAppointments = () => {
    if (userId) {
      // Pass userType (1 for Customer) along with numeric userId
      dispatch(fetchAppointmentsThunk({ userType: 1, userId: Number(userId) }));
    }
  };

  useEffect(() => {
    loadAppointments();

    const savedServices = localStorage.getItem('services');
    const savedExperts = localStorage.getItem('experts');
    const savedAddresses = localStorage.getItem('userAddresses');

    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedExperts) setExperts(JSON.parse(savedExperts));
    if (savedAddresses) setUserAddresses(JSON.parse(savedAddresses));
  }, [dispatch, userId]);

  // Modal Toggle Handlers
  const handleOpenModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleOpenFeedbackModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsFeedbackModalOpen(true);
  };

  // Submit Handlers
  const handleAddBooking = async (rawFormData) => {
    setSubmitError(null);
    const loggedInName = currentUser?.name || currentUser?.fullName || (currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Customer');

    const formattedPayload = {
      appointmentId: 0,
      customerId: Number(userId),
      customerName: loggedInName,
      serviceCategoryId: Number(rawFormData.serviceCategoryId),
      expertId: Number(rawFormData.expertId),
      appointmentDate: rawFormData.appointmentDate,
      startTime: rawFormData.startTime || '10:00 AM',
      endTime: rawFormData.endTime || '11:30 AM',
      occasion: rawFormData.occasion || '',
      totalPrice: parseFloat(String(rawFormData.totalPrice || 0).replace(/[^0-9.-]+/g, '')) || 0,
      addressId: Number(rawFormData.addressId) || 0,
      appointmentStatusId: 1
    };

    try {
      await dispatch(createBookingThunk(formattedPayload)).unwrap();
      setIsModalOpen(false);
      loadAppointments(); // Refresh list to sync state
    } catch (err) {
      setSubmitError(typeof err === 'string' ? err : 'Failed to create booking.');
    }
  };

  const handleEditSubmit = async (updatedData) => {
    setSubmitError(null);
    try {
      await dispatch(updateAppointmentThunk(updatedData)).unwrap();
      setIsEditModalOpen(false);
      setEditingAppointment(null);
      loadAppointments(); // Refresh list to sync state
    } catch (err) {
      setSubmitError(typeof err === 'string' ? err : 'Failed to update booking.');
    }
  };

  // RE-FETCH APPOINTMENTS ON SUCCESSFUL FEEDBACK SUBMISSION
  const handleFeedbackSubmit = () => {
    setIsFeedbackModalOpen(false);
    setSelectedAppointment(null);
    loadAppointments(); // Re-fetch appointments to update state instantly
  };

  return (
    <Box sx={{ backgroundColor: '#FAF6F0', minHeight: '100vh', py: 4, px: 2 }}>
      <Container maxWidth="md">

        {/* Profile Card Header */}
        <ProfileCard 
          user={currentUser}
          name={currentUser?.name || currentUser?.fullName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
          roleBadge={isExpert ? 'Expert Account' : 'Customer Account'}
          actionButtonText="+ Book New Service"
          onActionClick={handleOpenModal}
          onBookClick={handleOpenModal}
        />

        {/* Tab Navigation */}
        <Box sx={{ my: 3.5, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: '#8C2B4E',
              color: '#FFFFFF',
              borderRadius: '24px',
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': { backgroundColor: '#70223E' }
            }}
          >
            Appointments
          </Button>
        </Box>

        {/* Appointment List Container */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: '16px', 
            p: { xs: 2.5, md: 4 }, 
            backgroundColor: '#FFFFFF',
            border: '1px solid #E0E0E0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontFamily: 'serif', 
              fontWeight: 700, 
              color: '#1A1A1A', 
              textAlign: 'center', 
              mb: 3 
            }}
          >
            Appointment History
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {typeof error === 'string' ? error : 'Failed to load appointments.'}
            </Alert>
          )}

          {loading && reduxAppointments.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#8C2B4E' }} />
            </Box>
          )}

          <AppointmentList 
            appointments={reduxAppointments} 
            customerId={userId}
            onLeaveFeedback={handleOpenFeedbackModal}
            onEditAppointment={handleOpenEditModal}
          />
        </Paper>

        {/* Modals */}
        {isModalOpen && (
          <BookingModal 
            open={isModalOpen}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleAddBooking} 
            onSave={handleAddBooking}
            services={services}
            experts={experts}
            userAddresses={userAddresses}
          />
        )}

        {isEditModalOpen && (
          <EditBookingModal
            open={isEditModalOpen}
            isOpen={isEditModalOpen}
            booking={editingAppointment}
            appointment={editingAppointment}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingAppointment(null);
            }}
            onSubmit={handleEditSubmit}
            onSaveSuccess={handleEditSubmit}
          />
        )}

        {isFeedbackModalOpen && (
          <FeedbackModal
            open={isFeedbackModalOpen}
            isOpen={isFeedbackModalOpen}
            appointment={selectedAppointment}
            onClose={() => {
              setIsFeedbackModalOpen(false);
              setSelectedAppointment(null);
            }}
            onSuccess={handleFeedbackSubmit}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </Container>
    </Box>
  );
}