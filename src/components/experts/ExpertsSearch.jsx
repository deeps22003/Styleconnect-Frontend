import { Box, TextField } from "@mui/material";

export const ExpertsSearch = ({searchText,setSearchText}) => {
  return (
    <Box
      sx={{
        px: 1,
        mb: 4,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search experts, services or city..."
        value={searchText}
        onChange={(e)=>setSearchText(e.target.value)}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "var(--radius-pill)",
            backgroundColor: "var(--sc-cream)",

            "& fieldset": {
              borderColor: "var(--sc-rose-light)",
            },

            "&:hover fieldset": {
              borderColor: "var(--sc-rose)",
            },

            "&.Mui-focused fieldset": {
              borderColor: "var(--sc-rose-deep)",
              borderWidth: 2,
            },
          },

          "& .MuiInputBase-input": {
            py: 1.75,
            px: 2,
            fontFamily: "var(--font-body)",
            color: "var(--sc-ink)",
          },

          "& .MuiInputBase-input::placeholder": {
            color: "var(--sc-muted)",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
};