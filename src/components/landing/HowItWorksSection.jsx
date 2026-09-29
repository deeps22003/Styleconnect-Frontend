import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { SectionHeader } from "../common/landing/SectionHeader";
export const HowItWorksSection = ({
  badge = "How It Works",
  heading,
  description,
  steps,
}) => {
  return (
    <Box
      sx={{
        px: { xs: 3, md: 6 },
        py: 8,
        bgcolor: "var(--sc-plum)",
        borderRadius: "40px",
        mt: 8,
      }}
    >
     <SectionHeader
      badge={badge}
      heading={heading}
      description={description}
      badgeColor="var(--sc-gold)"
      headingColor="var(--sc-card)"
      descriptionColor="var(--sc-rose-wash)"
      />

      <Grid container spacing={3}>
        {steps.map((step) => (
          <Grid
            key={step.id}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                minHeight: 260,
                borderRadius: "24px",
                textAlign: "center",
                backgroundColor: "#fff",
                transition: "0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  bgcolor: "var(--sc-rose-wash)",
                  color: "var(--sc-plum)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "24px",
                  mx: "auto",
                  mb: 3,
                }}
              >
                {step.id}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "var(--sc-ink)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {step.title}
              </Typography>

              <Typography
                sx={{
                  color: "var(--sc-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};