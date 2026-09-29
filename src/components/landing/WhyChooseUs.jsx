import {
  Box,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { SectionHeader } from "../common/landing/SectionHeader";

export const WhyChooseUs = ({
  badge,
  heading,
  description,
  features,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: 6, md: 8 },
        py: { xs: 4, md: 6 },
        px: { xs: 3, md: 5 },

        background:
          "linear-gradient(135deg, var(--sc-cream) 0%, var(--sc-rose-wash) 100%)",

        border: "1px solid var(--sc-rose-light)",
        borderRadius: "32px",

        position: "relative",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "var(--sc-rose-light)",
          opacity: 0.35,
        },

        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "var(--sc-gold-light)",
          opacity: 0.3,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <SectionHeader
          badge={badge}
          heading={heading}
          description={description}
          align="center"
        />

        <Box
          sx={{
            mt: 5,

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },

            gap: 2,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,

                p: 2.5,

                backgroundColor: "var(--sc-card)",

                borderRadius: "20px",

                border:
                  "1px solid rgba(156, 52, 87, 0.12)",

                boxShadow:
                  "0 4px 14px rgba(44, 17, 48, 0.05)",

                transition: "all 0.3s ease",

                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "var(--sc-rose)",

                  boxShadow:
                    "0 12px 30px rgba(156, 52, 87, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,

                  borderRadius: "50%",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  background:
                    "linear-gradient(135deg, var(--sc-rose) 0%, var(--sc-rose-deep) 100%)",

                  flexShrink: 0,
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    color: "#FFFFFF",
                    fontSize: 22,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "var(--sc-ink)",
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.95rem",
                    md: "1rem",
                  },
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};