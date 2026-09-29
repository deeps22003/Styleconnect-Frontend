import React from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography, Grid, Stack } from "@mui/material";

import customercard from "../../assets/images/customercard.png";

const customerCard = {
  
  heading: "Discover Trusted Beauty Professionals",
  description:
    "Find experienced makeup artists, hairstylists, mehendi artists, nail artists, and other beauty experts for every occasion. Explore portfolios, compare services, and book with confidence.",
  points: [
    "Browse verified expert profiles",
    "Explore portfolios and services",
    "Find experts near your location",
    "Book appointments with ease",
  ],
  icon: <PersonSearchIcon />,
  image: customercard,
  bgColor: "var(--sc-light)",
};

export const AudienceSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        px: 1,
        py: 6,
      }}
    >

      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, lg: 12 }}>
          <Box
            sx={{
              backgroundColor: customerCard.bgColor,
              borderRadius: "24px",
              // p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              alignItems: "center",
              gap: 4,
              overflow: "hidden",
              width:"100%"
            }}
          >
            <Box sx={{ flex: 1 }}>
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                {customerCard.icon}

                <Typography
                  sx={{
                    color: "var(--sc-rose-deep)",
                    fontWeight: "var(--font-bold)",
                    textTransform: "uppercase",
                  }}
                >
                  {customerCard.title}
                </Typography>
              </Box> */}

              <Typography
                variant="h4"
                sx={{
                  fontFamily: "var(--font-heading)",
                  mb: 2,
                }}
              >
                {customerCard.heading}
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 3,
                  lineHeight: 1.8,
                }}
              >
                {customerCard.description}
              </Typography>

              <Stack spacing={1.5}>
                {customerCard.points.map((point) => (
                  <Box
                    key={point}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "var(--sc-rose-deep)",
                        fontSize: 20,
                      }}
                    />

                    <Typography>{point}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box
              component="img"
              src={customerCard.image}
              alt="StyleConnect Customers"
              sx={{
                flex: 1,
                width: "100%",
                maxWidth: {
                  xs: "100%",
                  md: "450px",
                },
                height: {
                  xs: "280px",
                  md: "380px",
                },
                objectFit: "cover",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "rgba(0, 0, 0, 0.08)",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.06)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.12)",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};