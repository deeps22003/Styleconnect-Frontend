import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedExpert,setBookingIntent,fetchExperts } from "../slices/expertSlice";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";
import { Navbar } from "../../components/landing/Navbar";
import BookingModal from "../../components/appointments/BookingModal";
import { createBookingThunk } from "../../store/slices/appointmentSlice";



export const ExpertProfilePage = () => {
  const { expertId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

    const selectedCategoryId =
      location.state?.serviceCategoryId;

    const selectedCategoryName =
      location.state?.categoryName;

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] =useState(false);

  const { isAuthenticated ,user} = useSelector((state) => state.auth);
  const { experts, loading, error } = useSelector((state) => state.experts);

  const [userAddresses, setUserAddresses] = useState([]);

    useEffect(() => {
    const savedAddresses = localStorage.getItem("userAddresses");

    if (savedAddresses) {
      setUserAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const customerId =user?.customerId ||user?.customer_id ||user?.id;



  useEffect(() => {
    if (experts.length === 0) {
      dispatch(fetchExperts());
    }
  }, [dispatch, experts.length]);

  const selectedExpert = useMemo(() => {
    return experts.find(
      (expert) => String(expert.expertId) === String(expertId)
    );
  }, [experts, expertId]);

  const handleBookAppointment = () => {
    if (!isAuthenticated) {

      dispatch(setSelectedExpert(selectedExpert));
      dispatch(setBookingIntent(true));

      setOpenLoginDialog(true);
      return;
    }


     setIsBookingModalOpen(true);
    
  };

  if (loading && experts.length === 0) {
    return <Typography align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography align="center">{error}</Typography>;
  }

  if (!selectedExpert) {
    return <Typography align="center">Expert not found</Typography>;
  }

    const handleBookingSubmit = async (formData) => {
  const payload = {
    ...formData,
    appointmentId: 0,
    customerName: user?.fullName,
    appointmentStatusId: 1,
  };

  console.log("Final Payload:", payload);

  try {
    await dispatch(createBookingThunk(payload)).unwrap();

    setIsBookingModalOpen(false);

    navigate("/customer/dashboard");
  } catch (error) {
      console.log("Full Error:", error);

      console.log("Response Data:", error?.response?.data);

      console.log("Status:", error?.response?.status);

      console.log("Payload:", payload);
    }
};


  return (
    <RegistrationLayout>
     <Navbar
         logo="StyleConnect"
         showNavigation={false}
         showBackButton={true}
        showAuthActions={false}
        />

      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 4,
          borderRadius: 4,
          border: "1px solid #E5DEDA",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} >
            <Avatar
              src={selectedExpert.profileImage}
              alt={selectedExpert.name}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "var(--sc-rose-wash)",
                color: "#5C4033",
                fontSize: "2rem",
                fontWeight: 600,
                alignItems:"center"
              }}
            >
              {!selectedExpert.profileImage &&
                selectedExpert.name?.charAt(0)}
            </Avatar>

            <Typography variant="h4">{selectedExpert.name}</Typography>

            <Typography color="text.secondary">
              📍 {selectedExpert.location}
            </Typography>

            <Typography fontWeight={600}>
              ⭐ {selectedExpert.rating}
            </Typography>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            About
          </Typography>

          <Typography color="text.secondary" paragraph>
            {selectedExpert.bio || "No bio available"}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Services
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap:"wrap",
           
            }}
             useFlexGap
            
          >
            {selectedExpert.services?.map((service, index) => (
              <Chip key={index} label={service} />
            ))}
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6">Experience</Typography>
              <Typography>
                {selectedExpert.experienceYears} Years
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6">Charges</Typography>
              <Typography>
                ₹{selectedExpert.hourlyCharges}/hour
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleBookAppointment}
            sx={{
              mt: 4,
              py: 1.5,
              textTransform: "none",
              bgcolor: "var(--sc-rose)",
            }}
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle>Login Required</DialogTitle>

        <DialogContent>
          To book an appointment with{" "}
          <strong>{selectedExpert.name}</strong>, please login to your account.
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              dispatch(setSelectedExpert(selectedExpert));
              navigate("/login");
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {isBookingModalOpen && (
        <BookingModal
          open={isBookingModalOpen}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
          userAddresses={userAddresses}
          selectedExpert={selectedExpert}
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
        />
      )}
    </RegistrationLayout>
  );
};