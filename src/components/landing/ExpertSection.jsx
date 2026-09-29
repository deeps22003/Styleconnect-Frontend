import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routePaths";

export const ExpertSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        px: { xs: 3, md: 2 },
        py: { xs: 8, md: 4 },
        mt: 10,
        textAlign: "center",
        background:
          "linear-gradient(135deg, var(--sc-plum) 0%, #5A345D 100%)",
      }}
    >
      {/* Decorative Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(212, 163, 115, 0.15)",
          top: -100,
          right: -100,
          filter: "blur(50px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(244, 216, 223, 0.12)",
          bottom: -100,
          left: -80,
          filter: "blur(50px)",
        }}
      />

      <Typography
        sx={{
          color: "var(--sc-gold)",
          textTransform: "uppercase",
          letterSpacing: 2,
          fontWeight: 600,
          mb: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        FOR BEAUTY PROFESSIONALS
      </Typography>

      <Typography
        variant="h3"
        sx={{
          color: "#fff",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          maxWidth: "800px",
          mx: "auto",
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        Turn Your Talent Into a Growing Beauty Business
      </Typography>

      <Typography
        sx={{
          color: "var(--sc-rose-wash)",
          maxWidth: "700px",
          mx: "auto",
          mb: 5,
          fontSize: "1.05rem",
          lineHeight: 1.8,
          position: "relative",
          zIndex: 1,
        }}
      >
        Are you a makeup artist, hairstylist, nail artist, mehendi artist,
        or beauty professional? Join StyleConnect and connect with customers
        looking for services tailored to their special moments and everyday
        beauty needs.
      </Typography>

     
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.EXPERT_LANDING)}
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: "14px",
            fontWeight: 600,
            textTransform: "none",
            backgroundColor: "var(--sc-rose-deep)",
            "&:hover": {
              backgroundColor: "var(--sc-rose-deep)",
              opacity: 0.9,
            },
          }}
        >
          Join Our Expert Network
        </Button>

      
     
    </Box>
  );
};