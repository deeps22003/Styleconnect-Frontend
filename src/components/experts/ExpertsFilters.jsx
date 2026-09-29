import { Box, Button } from "@mui/material";

export const ExpertFilters = () => {
  return (
    <Box
      sx={{
        px: 2,
        mb: 4,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Button
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-pill)",
          borderColor: "var(--sc-rose)",
          color: "var(--sc-ink)",
          textTransform: "none",
        }}
      >
        Location
      </Button>

      <Button
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-pill)",
          borderColor: "var(--sc-rose)",
          color: "var(--sc-ink)",
          textTransform: "none",
        }}
      >
        Service
      </Button>

      <Button
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-pill)",
          borderColor: "var(--sc-rose)",
          color: "var(--sc-ink)",
          textTransform: "none",
        }}
      >
        Budget
      </Button>

      <Button
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-pill)",
          borderColor: "var(--sc-rose)",
          color: "var(--sc-ink)",
          textTransform: "none",
        }}
      >
        Rating
      </Button>

      <Button
        variant="outlined"
        sx={{
          borderRadius: "var(--radius-pill)",
          borderColor: "var(--sc-rose)",
          color: "var(--sc-ink)",
          textTransform: "none",
        }}
      >
        More Filters
      </Button>
    </Box>
  );
};