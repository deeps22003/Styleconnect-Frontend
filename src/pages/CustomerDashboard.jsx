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

import { fetchAppointmentsThunk,createBookingThunk,updateAppointmentThunk,cancelAppointmentThunk } from '../store/slices/appointmentSlice';

import ProfileCard from '../components/appointments/ProfileCard';
import AppointmentList from '../components/appointments/AppointmentList';
import BookingModal from '../components/appointments/BookingModal';
import EditBookingModal from '../components/appointments/EditBookingModal';
import FeedbackModal from '../components/appointments/FeedbackModal';
import { RegistrationLayout } from '../components/layout/RegistrationLayout';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { useNavigate } from 'react-router-dom';
import HeroImg1 from "../assets/images/HeroImg_1.png";
import ROUTES from '../routes/routePaths';
import { CategoriesSection } from '../components/landing/CategoriesSection';
import { fetchCategories } from '../features/slices/categorySlice';
import { getAllExperts } from '../services/expertService';
import { fetchExperts } from '../features/slices/expertSlice';
import { Footer } from '../components/landing/FooterSection';

const EMPTY_OBJECT = {};

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const  navigate=useNavigate();

  const {
  categories,
  loading: categoriesLoading,
  error: categoriesError
} = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
  dispatch(fetchExperts());
}, [dispatch]);

  

   

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
  const customerId = parseInt(
      currentUser?.customerId ||
      currentUser?.id ||
      currentUser?.userId ||
      localStorage.getItem("customerId"),
      10
    );
  console.log("currentUser", currentUser);
// console.log("resolved userId", userId);
console.log("customerId", currentUser?.customerId);
console.log("customer_id", currentUser?.customer_id);
console.log("id", currentUser?.id);
console.log("userId", currentUser?.userId);
console.log("currentUser", currentUser);
  const isExpert = String(currentUser?.role || currentUser?.roleId || '').toLowerCase().includes('expert') || currentUser?.roleId === 2;

  // 2. Extract Redux state
  const appointmentsState = useSelector((state) => state.appointments) || EMPTY_OBJECT;
  const reduxAppointments = appointmentsState.items || [];
  const loading = appointmentsState.loading || false;
  const error = appointmentsState.error || null;

  const [services, setServices] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  // const [experts, setExperts] = useState([]);
 const experts = useSelector(
  (state) => state.experts?.experts || []
);
const expertState = useSelector((state) => state.experts);
console.log("Experts Array", experts);

console.log("Full Expert Slice", expertState);
console.log("Experts Array", expertState?.experts);
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
      if (customerId) {
        dispatch(
          fetchAppointmentsThunk({
            userType: 1,
            userId: customerId
          })
        );
      }
    };

  useEffect(() => {
    loadAppointments();

    const savedServices = localStorage.getItem('services');
    // const savedExperts = localStorage.getItem('experts');
    const savedAddresses = localStorage.getItem('userAddresses');
    

    if (savedServices) setServices(JSON.parse(savedServices));
    // if (savedExperts) setExperts(JSON.parse(savedExperts));
    if (savedAddresses) setUserAddresses(JSON.parse(savedAddresses));
  }, [dispatch, customerId]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
  console.log("Success Message Changed:", successMessage);
}, [successMessage]);



  console.log("Experts", experts);

  // Modal Toggle Handlers
  const handleOpenModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

 const handleOpenEditModal = (appointment) => {
  const expert = experts.find(
    (e) =>
      Number(e.expertId) ===
      Number(appointment.expertId)
  );

  console.log("Appointment ExpertId:", appointment.expertId);
  console.log("Matched Expert:", expert);

  setEditingAppointment({
    ...appointment,
    hourlyCharges: expert?.hourlyCharges || 0
  });

  setIsEditModalOpen(true);
};

  const handleOpenFeedbackModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsFeedbackModalOpen(true);
  };


  const handleCancelAppointment = async (appointment) => {
      try {
        await dispatch(
          cancelAppointmentThunk(
            appointment.appointmentId
          )
        ).unwrap();
        setSuccessMessage("Appointment cancelled successfully!");

        loadAppointments();
      } catch (err) {
        setSubmitError(
          typeof err === "string"
            ? err
            : "Failed to cancel appointment."
        );
      }
    };

  // Submit Handlers
  const handleAddBooking = async (rawFormData) => {
    setSubmitError(null);
    const loggedInName = currentUser?.name || currentUser?.fullName || (currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Customer');

    const formattedPayload = {
      appointmentId: 0,
      customerId: Number(customerId),
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
      setSuccessMessage("Appointment booked successfully!");
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
      setSuccessMessage("Appointment updated successfully!");
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
  const user=useSelector(
        (state)=>state.auth.user
    )

    const handleExploreExperts = () => {
      navigate(ROUTES.EXPERTS);
    };

  return (
  
      <RegistrationLayout>
        {/* Profile Card Header */}
       <Navbar
         logo="StyleConnect"
         showNavigation={true}
         showBackButton={false}
        showAuthActions={false}
        />
      

        <HeroSection
          badge="Beauty & Wellness"
          title={`Welcome ${user?.fullName || "Customer"}`}
          description="Discover professional beauty experts and premium services tailored to your needs. Book appointments, explore new styles, and connect with trusted experts."
          primaryButtonText="Explore Experts"
          onPrimaryClick={handleExploreExperts}
          image={HeroImg1}
        />

        <CategoriesSection
        sectionTag="Book an Appointment by a Service"
        heading="A style for every moment"
        description="From wedding-day glam to a quick weekday trim, explore the categories our community books most."
        services={categories}
        loading={categoriesLoading}
        error={categoriesError}
      />

        {/* <ProfileCard 
          user={currentUser}
          name={currentUser?.name || currentUser?.fullName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
          roleBadge={isExpert ? 'Expert Account' : 'Customer Account'}
          actionButtonText="+ Book New Service"
          onActionClick={handleOpenModal}
          onBookClick={handleOpenModal}
        /> */}



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

          {successMessage && (
            <Alert
              severity="success"
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setSuccessMessage("")}
            >
              {successMessage}
            </Alert>
          )}


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
          customerId={customerId}
          onLeaveFeedback={handleOpenFeedbackModal}
          onEditAppointment={handleOpenEditModal}
          onCancelAppointment={handleCancelAppointment}
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
        <Footer/>
   </RegistrationLayout>
  );
}