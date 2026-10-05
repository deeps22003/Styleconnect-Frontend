import React, { useState, useEffect } from 'react';
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
  Typography,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import { getCategories } from '../../services/categoryService';
// import { getAllExperts } from '../../services/expertService';
import { getCustomerByUserId } from '../../services/customerService';
import { getAuthData } from '../../utils/authStorage';

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

const LOCATION_TYPES = [
  { id: 1, label: 'At Home (Doorstep)' },
  { id: 2, label: 'At Expert Studio' }
];

const INITIAL_STATE = {
  serviceTypeId: '',
  appointmentDate: '',
  startTime: '',
  endTime: '',
  occasion: '',
  totalPrice: '',
  serviceAddress: ''
};

// Helper function to convert 12-hour AM/PM string to 24-hour HH:mm:ss for C# TimeOnly
const convertTo24Hour = (timeStr) => {
  if (!timeStr) return '10:00:00';
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
};

// Helper function to calculate duration in hours between two time slots
const calculateDurationHours = (startSlot, endSlot) => {
  const startIndex = TIME_SLOTS.indexOf(startSlot);
  const endIndex = TIME_SLOTS.indexOf(endSlot);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return 1;
  return (endIndex - startIndex) * 0.5;
};

export default function BookingModal({
  open = false,
  onClose,
  onSubmit,
  selectedExpert,
  selectedCategoryId,
  selectedCategoryName
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  // const [fetchedCategories, setFetchedCategories] = useState([]);
  // const [loadingCategories, setLoadingCategories] = useState(false);

  // const [fetchedExperts, setFetchedExperts] = useState([]);
  // const [loadingExperts, setLoadingExperts] = useState(false);

  const [addressOptions, setAddressOptions] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [selectedAddress, setSelectedAddress] =useState(null);

  const todayDate = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//   if (selectedExpert?.hourlyCharges) {
//     setFormData((prev) => ({
//       ...prev,
//       totalPrice: selectedExpert.hourlyCharges
//     }));
//   }
// }, [selectedExpert]);

  useEffect(() => {
    if (open) {
      /*
      // 1. Fetch Categories
      // if (!services || services.length === 0) {
      //   setLoadingCategories(true);
      //  getCategories()
      //     .then((data) => setFetchedCategories(Array.isArray(data) ? data : (data?.data || [])))
      //     .catch((err) => console.error('Failed to load categories:', err))
      //     .finally(() => setLoadingCategories(false));
      // }

     

      // // 2. Fetch Experts
      // if (!experts || experts.length === 0) {
      //   setLoadingExperts(true);
      //   getAllExperts()
      //     .then((data) => setFetchedExperts(Array.isArray(data) ? data : (data?.data || [])))
      //     .catch((err) => console.error('Failed to load experts:', err))
      //     .finally(() => setLoadingExperts(false));
      // }

      

      // 3. Fetch Registered Address matching database schema
      const loadUserAddresses = async () => {
          setLoadingAddresses(true);

          try {
            const authData = getAuthData();

            const userId = authData?.userId;

            if (!userId) return;

            const profileData = await getCustomerByUserId(userId);
            console.log("profileData", profileData);

            setCustomerProfile(profileData);

            const options = [];

            if (profileData?.location) {
              options.push({
                label: `${profileData.location} (Registered Address)`,
                value: profileData.location,
                addressId: profileData.addressId
              });
            }
            console.log("options", options);

            setAddressOptions(options);
          } catch (error) {
            console.error(
              "Error loading customer profile:",
              error
            );
          } finally {
            setLoadingAddresses(false);
          }
        };

      loadUserAddresses();
    }
  }, [open,selectedExpert]);

  // const availableCategories = services.length > 0 ? services : fetchedCategories;
  // const availableExperts = experts.length > 0 ? experts : fetchedExperts;

  const handleReset = () => {
    setFormData(INITIAL_STATE);
  };

  const handleClose = (e) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    handleReset();
    if (onClose) onClose(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, 
        [name]: value 
      };

      // if (name === 'serviceCategoryId') {
      //   const selectedService = availableCategories.find(
      //     (s) => String(s.serviceCategoryId || s.id || s.serviceId) === String(value)
      //   );
      //   if (selectedService && (selectedService.price || selectedService.totalPrice || selectedService.cost)) {
      //     updated.totalPrice = selectedService.price || selectedService.totalPrice || selectedService.cost;
      //   }
      // }

      if (name === 'startTime' && value) {
        const startIndex = TIME_SLOTS.indexOf(value);
        if (startIndex !== -1 && startIndex + 1 < TIME_SLOTS.length) {
          const currentEndIndex = TIME_SLOTS.indexOf(prev.endTime);
          if (currentEndIndex <= startIndex) {
            updated.endTime = TIME_SLOTS[startIndex + 1];
          }
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!onSubmit) return;

  if (!customerProfile) {
    console.error("Customer profile not found");
    return;
  }

  const matchedOption = addressOptions.find(
    (opt) =>
      opt.value.toLowerCase() ===
      formData.serviceAddress.trim().toLowerCase()
  );

  const duration = calculateDurationHours(
    formData.startTime,
    formData.endTime
  );

 console.log("customerProfile", customerProfile);
console.log("matchedOption", matchedOption);
console.log("addressOptions", addressOptions);
console.log("selectedAddress", selectedAddress);

  const sanitizedPayload = {
    appointmentId: null,

    customerId: customerProfile.customerId,

    // expertId: Number(formData.expertId),

    // serviceCategoryId: Number(
    //   formData.serviceCategoryId
    // ),

    expertId: Number(selectedExpert?.expertId),

    serviceCategoryId: Number( selectedCategoryId ),

    appointmentDate:
      formData.appointmentDate,

    startTime: convertTo24Hour(
      formData.startTime
    ),

    endTime: convertTo24Hour(
      formData.endTime
    ),

    occasion: formData.occasion.trim(),

    durationHours: duration,

    // totalPrice:
    //   Number(
    //     String(formData.totalPrice).replace(
    //       /[^0-9.-]+/g,
    //       ""
    //     )
    //   ) || 0,

    totalPrice:Number(totalPrice.toFixed(2)),

   addressId: Number(selectedAddress?.addressId || 0),

    serviceAddress:
      formData.serviceAddress.trim()
  };

  console.log("Final Payload:", sanitizedPayload);
  onSubmit(sanitizedPayload);

  handleReset();
};

  const filteredEndTimeSlots = TIME_SLOTS.filter((slot) => {
    if (!formData.startTime) return true;
    return TIME_SLOTS.indexOf(slot) > TIME_SLOTS.indexOf(formData.startTime);
  });

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

  const durationHours = calculateDurationHours(formData.startTime,formData.endTime);

const totalPrice =(selectedExpert?.hourlyCharges || 0) *durationHours;

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

            {/* Service */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Service"
                value={selectedCategoryName || ''}
                disabled
                sx={fieldStyle}
              />
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Select Service"
                name="serviceCategoryId"
                value={formData.serviceCategoryId}
                onChange={handleChange}
                disabled={loadingCategories}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>
                  {loadingCategories ? 'Loading services...' : 'Choose a service...'}
                </MenuItem>
                {availableCategories.map((item) => {
                  const id = item.serviceCategoryId || item.id || item.serviceId;
                  const name = item.categoryName || item.name || item.serviceName;
                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid> */}

            {/* Expert */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Expert"
                value={selectedExpert?.fullName || selectedExpert?.name || ''}
                disabled
                sx={fieldStyle}
              />
            </Grid>
            
            {/* <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Select Expert"
                name="expertId"
                value={formData.expertId}
                onChange={handleChange}
                disabled={loadingExperts}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>
                  {loadingExperts ? 'Loading experts...' : 'Choose an expert...'}
                </MenuItem>
                {availableExperts.map((exp) => {
                  const id = exp.expertId || exp.id || exp.userId;
                  const name = exp.fullName || exp.name || exp.expertName || exp.user?.fullName;
                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid> */}

            {/* Location Type */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Location Type"
                name="serviceTypeId"
                value={formData.serviceTypeId}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>
                  Select Location Type
                </MenuItem>
                {LOCATION_TYPES.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: todayDate }
                }}
                sx={fieldStyle}
              />
            </Grid>

            {/* Start Time */}
            <Grid size={{ xs: 6, sm: 6 }}>
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

            {/* End Time */}
            <Grid size={{ xs: 6, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                disabled={!formData.startTime}
                sx={fieldStyle}
              >
                <MenuItem value="" disabled>Select End</MenuItem>
                {filteredEndTimeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Occasion */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Occasion"
                placeholder="e.g. Wedding, Party, Engagement"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                slotProps={{
                  htmlInput: { minLength: 2, maxLength: 100 }
                }}
                sx={fieldStyle}
              />
            </Grid>

            {/* Service Address */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                loading={loadingAddresses}
                options={addressOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label || option.value}
                inputValue={formData.serviceAddress}
                onInputChange={(event, newInputValue) => {
                  setFormData((prev) => ({ ...prev, serviceAddress: newInputValue }));
                }}
                onChange={(event, newValue) => {
                  setSelectedAddress(newValue);

                  const val =
                    typeof newValue === "string"
                      ? newValue
                      : newValue?.label || "";

                  setFormData((prev) => ({
                    ...prev,
                    serviceAddress: val,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Service Address"
                    placeholder={loadingAddresses ? 'Loading registered address...' : 'Select or type custom address'}
                    sx={fieldStyle}
                  />
                )}
              />
            </Grid>

            {/* Total Price */}
            <Grid size={{ xs: 12 }}>
             <TextField
              fullWidth
              label="Total Price (₹)"
              value={totalPrice.toFixed(2)}
              disabled
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
            disabled={false}
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