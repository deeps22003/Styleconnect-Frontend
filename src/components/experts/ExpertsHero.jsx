
import { Box, Typography } from "@mui/material";

export const ExpertsHero = ({
  title = "",
  description = "",
  image = "",
}) => {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 5, md: 8 },
        bgcolor: "var(--sc-cream)",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: { xs: 4, md: 6 },
          // alignItems: "center",
        }}
      >
        {/* Left Content */}
        <Box>
          {title && (
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                lineHeight: 1.2,
                color: "var(--sc-ink)",
                mb: 2,
                fontFamily: "var(--font-heading)",
              }}
            >
              {title}
            </Typography>
          )}

          {description && (
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.8,
                color: "var(--sc-ink-soft)",
                maxWidth: "600px",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Right Image */}
        {image && (
          <Box
            component="img"
            src={image}
            alt={title || "Hero banner image"}
            loading="lazy"
            sx={{
              width: "100%",
              height: {
                xs: 250,
                sm: 320,
                md: 400,
              },
              objectFit: "cover",
              borderRadius: 4,
              border: "1px solid var(--sc-border, #E5DEDA)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

