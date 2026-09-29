import { Box, Typography } from "@mui/material";

export const SectionHeader = ({
  badge,
  heading,
  description,
  align = "center",
  headingVariant = "h3",
  badgeColor = "var(--sc-rose-deep)",
  headingColor = "var(--sc-ink)",
  descriptionColor = "var(--sc-muted)",
}) => {
  return (
    <Box
      sx={{
        textAlign: align,
        mb: 6,

      }}
    >
      {badge && (
        <Typography
          sx={{
            color:badgeColor ,
            letterSpacing: 1,
            mb: 2,
            fontSize: "20px",
            fontWeight: 600,
            fontFamily: "var(--font-heading)",
          }}
        >
          {badge}
        </Typography>
      )}

      <Typography
        variant={headingVariant}
        sx={{
          fontWeight: "var(--font-bold)",
          fontFamily: "var(--font-heading)",
          color: headingColor,
          mb: 2,
        }}
      >
        {heading}
      </Typography>

      {description && (
        <Typography
          sx={{
           
            mx: align === "center" ? "auto" : 0,
            color:descriptionColor ,
            fontFamily: "var(--font-body)",
            lineHeight: 1.8,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};