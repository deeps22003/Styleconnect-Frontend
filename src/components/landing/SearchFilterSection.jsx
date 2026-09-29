import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export const SearchFilterSection = () => {
  return (
    <Box
      sx={{
       minHeight: "85vh",
        px: 2,
        py: 1,
        backgroundColor: "var(--sc-cream)",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
            color: "var(--sc-plum)",
            fontWeight: 600,
            letterSpacing: 1,
            mb: 2,
            
        }}
      >
        Find Experts Near You
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          maxWidth: "100%",
          mx: "1",
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search experts, services or cities..."
          variant="outlined"
        />
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Button variant="outlined">
          Location
        </Button>

        <Button variant="outlined">
          Service
        </Button>

        <Button variant="outlined">
          Budget
        </Button>

        <Button variant="outlined">
          More Filters
        </Button>
      </Box>
    </Box>
  );
};