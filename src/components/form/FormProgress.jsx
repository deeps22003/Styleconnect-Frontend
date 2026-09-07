import { Box, Typography, LinearProgress } from "@mui/material";

export const FormProgress = ({
  step,
  totalSteps,
}) => {
  const progress = (step / totalSteps) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          color: "var(--sc-ink-soft)",
          fontWeight: 700,
          fontSize: "0.875rem",
          textTransform: "uppercase",
          mb: 1.5,
        }}
      >
        Step {step} of {totalSteps}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: "999px",
          backgroundColor: "#EAE3E6",

          "& .MuiLinearProgress-bar": {
            backgroundColor: "var(--sc-rose)",
            borderRadius: "999px",
          },
        }}
      />
    </Box>
  );
};