// src/components/session/SessionWarningDialog.jsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export const SessionWarningDialog = ({
  open,
  secondsLeft,
  onContinue,
  onLogout,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>
        Session Expiring Soon
      </DialogTitle>

      <DialogContent>
        <Typography>
          Your session will expire in {secondsLeft} seconds.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          color="error"
          variant="outlined"
          onClick={onLogout}
        >
          Logout
        </Button>

        <Button
          variant="contained"
          onClick={onContinue}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};