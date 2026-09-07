import { Typography } from "@mui/material";

export const Caption = ({ children }) => {
  return (
    <Typography
      variant="body1"
      sx={{
        color: "var(--sc-ink-soft)",
        fontSize:"14.5px",
        lineHeight: 1.5,
        background:"var(-sc-cream)",
        fontFamily:"var(--font-body)"
      }}
    >
      {children}
    </Typography>
    
  );
};