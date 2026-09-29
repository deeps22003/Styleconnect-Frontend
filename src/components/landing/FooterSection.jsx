import {
  Box,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Instagram,
  Facebook,
  LinkedIn,
} from "@mui/icons-material";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "var(--sc-ink)",
        color: "#fff",
        mt: 5,
        width: "100%", 
        px: 0,        
        mx: 0,       
        overflowX: "hidden",
      }}
    >
      {/* CTA Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          px: 2,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          width: "100%",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "var(--font-heading)",
            fontWeight: "var(--font-semibold)",
            mb: 1,
          }}
        >
          Ready to Transform Your Look?
        </Typography>

        <Typography
          sx={{
            maxWidth: "600px",
            mx: "auto",
            color: "rgba(255,255,255,0.75)",
            fontSize: "14px",
          }}
        >
          Discover trusted beauty professionals, explore services and
          book appointments with confidence through StyleConnect.
        </Typography>
      </Box>

      {/* Main Footer - Spans full width without horizontal restriction */}
      <Box
        sx={{
          width: "100%",
          py: 4,
          px: { xs: 3, md: 6 }, // Controlled responsive inner content padding
        }}
      >
        <Grid container spacing={3}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--sc-rose)",
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--font-bold)",
                mb: 1,
              }}
            >
              Social Links
            </Typography>

            <Box>
              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  "&:hover": { color: "var(--sc-rose)" },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  "&:hover": { color: "var(--sc-rose)" },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  "&:hover": { color: "var(--sc-rose)" },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1.5,
                color: "var(--sc-rose)",
                fontSize: "15px",
              }}
            >
              Quick Links
            </Typography>

            {["Home", "Services", "Experts", "About Us", "Contact"].map(
              (item) => (
                <Link
                  key={item}
                  underline="none"
                  sx={{
                    display: "block",
                    color: "rgba(255,255,255,0.75)",
                    mb: 1,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "var(--sc-rose)",
                    },
                  }}
                >
                  {item}
                </Link>
              )
            )}
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1.5,
                color: "var(--sc-rose)",
                fontSize: "15px",
              }}
            >
              Contact
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.75)",
                mb: 1,
                fontSize: "13px",
              }}
            >
              support@styleconnect.com
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.75)",
                mb: 1,
                fontSize: "13px",
              }}
            >
              +91 98765 43210
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "13px",
              }}
            >
              Chennai, Tamil Nadu
            </Typography>
          </Grid>
        </Grid>

        <Divider
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
            my: 2.5,
          }}
        />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
            }}
          >
            © {currentYear} StyleConnect. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2.5,
            }}
          >
            <Link
              underline="none"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                cursor: "pointer",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "var(--sc-rose)",
                },
              }}
            >
              Privacy Policy
            </Link>

            <Link
              underline="none"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                cursor: "pointer",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "var(--sc-rose)",
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};