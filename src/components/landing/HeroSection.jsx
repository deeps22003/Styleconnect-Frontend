import { Box, Typography, Button } from "@mui/material";

export const HeroSection = ({
  badge,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  image
}) => {
  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
        backgroundColor: "var(--sc-cream)",
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: "600px",
        }}
      >
        <Typography
          sx={{
            color: "var(--sc-rose)",
            fontWeight: 600,
            letterSpacing: 1,
            mb: 2,
          }}
        >
          {badge}
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "var(--sc-ink)",
            fontFamily:"var(--font-heading)"
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "18px",
            color: "var(--sc-muted)",
            mb: 4,
            fontFamily:"var(--font-body)"
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
         <Button
              variant="outlined"
              onClick={onPrimaryClick}
              sx={{
                textTransform: "none",
                borderRadius: "var(--radius-pill)",
                borderColor: "var(--sc-rose)",
                color: "var(--sc-rose)",
                fontWeight: "var(--font-medium)",
                fontFamily: "var(--font-body)",
                px: 2.5,
                "&:hover": {
                  borderColor: "var(--sc-rose-deep)",
                  bgcolor: "var(--sc-rose-wash)",
                },
              }}
            >
            {primaryButtonText}
          </Button>

            {secondaryButtonText && (
           <Button
            
              variant="outlined"
              onClick={onSecondaryClick}
              sx={{
                textTransform: "none",
                borderRadius: "var(--radius-pill)",
                borderColor: "var(--sc-rose)",
                color: "var(--sc-rose)",
                fontWeight: "var(--font-medium)",
                fontFamily: "var(--font-body)",
                px: 2.5,
                "&:hover": {
                  borderColor: "var(--sc-rose-deep)",
                  bgcolor: "var(--sc-rose-wash)",
                },
              }}
              
            >
            {secondaryButtonText}
          </Button>
          )}
        </Box>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 500,
            height: 500,
            borderRadius: "50%",
            backgroundColor: "#F4E4EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={image}
            alt="Hero"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // borderRadius:"50%"
            }}
        />
        </Box>
      </Box>
    </Box>
  );
};