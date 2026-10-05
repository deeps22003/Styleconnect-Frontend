import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM"
];

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "10:00:00";

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = Number(hours) + 12;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
};

const formatTo12Hour = (timeStr) => {
  if (!timeStr) return "";

  const clean = timeStr.trim().toUpperCase();

  if (clean.includes("AM") || clean.includes("PM")) {
    return clean;
  }

  const [hours, minutes] = clean.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  return `${String(h12).padStart(2, "0")}:${String(
    minutes || 0
  ).padStart(2, "0")} ${period}`;
};

const calculateDurationHours = (startSlot, endSlot) => {
  const startIndex = TIME_SLOTS.indexOf(startSlot);
  const endIndex = TIME_SLOTS.indexOf(endSlot);

  if (
    startIndex === -1 ||
    endIndex === -1 ||
    endIndex <= startIndex
  ) {
    return 1;
  }

  return (endIndex - startIndex) * 0.5;
};

export default function EditBookingModal({
  isOpen,
  booking,
  onClose,
  onSaveSuccess
}) {
  const todayDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
    occasion: "",
    serviceAddress: "",
    totalPrice: 0
  });

  useEffect(() => {
    if (!booking) return;

    setFormData({
      appointmentDate:
        booking.appointmentDate?.split("T")[0] ||
        booking.date?.split("T")[0] ||
        "",

      startTime: formatTo12Hour(
        booking.startTime || booking.time
      ),

      endTime: formatTo12Hour(
        booking.endTime || ""
      ),

      occasion: booking.occasion || "",

      serviceAddress:
        booking.serviceAddress ||
        booking.address ||
        "",
        totalPrice:booking.totalPrice || 0
    });
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:value
      };

      if (name === "startTime") {
        const startIndex =
          TIME_SLOTS.indexOf(value);

        const endIndex =
          TIME_SLOTS.indexOf(prev.endTime);

        if (
          startIndex !== -1 &&
          endIndex <= startIndex
        ) {
          updated.endTime =
            TIME_SLOTS[startIndex + 1] || "";
        }
      }

      return updated;
    });
  };

  const filteredEndTimeSlots =
    TIME_SLOTS.filter((slot) => {
      if (!formData.startTime) {
        return true;
      }

      return (
        TIME_SLOTS.indexOf(slot) >
        TIME_SLOTS.indexOf(formData.startTime)
      );
    });

  const durationHours =
    calculateDurationHours(
      formData.startTime,
      formData.endTime
    );

  const hourlyCharge =
    booking?.hourlyCharges ||
    booking?.pricePerHour ||
    booking?.hourlyRate ||
    0;

  const totalPrice =
    durationHours * (booking?.hourlyCharges || 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      appointmentId: booking.appointmentId,

      customerId: booking.customerId,

      expertId: booking.expertId,

      serviceCategoryId:
        booking.serviceCategoryId,

      appointmentDate:
        formData.appointmentDate,

      startTime: convertTo24Hour(
        formData.startTime
      ),

      endTime: convertTo24Hour(
        formData.endTime
      ),

      occasion: formData.occasion,
      durationHours: durationHours,

      totalPrice: Number(totalPrice.toFixed(2)),

      addressId: booking.addressId,

      serviceAddress:
        formData.serviceAddress,

      appointmentStatusId: 1
    };

    console.log(
      "Update Appointment Payload:",
      payload
    );

    onSaveSuccess(payload);
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#FAF6F0",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#E0DCD5"
      },
      "&:hover fieldset": {
        borderColor: "#8C2B4E"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#8C2B4E"
      }
    }
  };

  console.log("booking", booking);
console.log("hourlyCharges", booking?.hourlyCharges);
console.log(totalPrice)

  return (
    <Dialog
      open={Boolean(isOpen && booking)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            p: 2
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700
          }}
        >
          Edit Appointment
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service"
                disabled
                value={
                  booking?.serviceCategoryName ||
                  booking?.serviceName ||
                  booking?.service ||
                  ""
                }
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expert"
                disabled
                value={
                  booking?.expertBusinessName ||
                  booking?.expertName ||
                  ""
                }
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  min: todayDate
                }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={6}>
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
                {TIME_SLOTS.map((slot) => (
                  <MenuItem
                    key={slot}
                    value={slot}
                  >
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
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
                {filteredEndTimeSlots.map(
                  (slot) => (
                    <MenuItem
                      key={slot}
                      value={slot}
                    >
                      {slot}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Service Address"
                name="serviceAddress"
                value={formData.serviceAddress}
                onChange={handleChange}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Price (₹)"
                value={totalPrice.toFixed(2)}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#A33A5E",
              "&:hover": {
                backgroundColor: "#8C2B4E"
              }
            }}
          >
            Submit Updates
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}