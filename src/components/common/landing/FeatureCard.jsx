import { Card, CardContent, Box, Typography } from "@mui/material";

export const FeatureCard = ({
  icon,
  title,
  description,
  dark = false,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: "20px",
        backgroundColor: dark
          ? "var(--sc-ink)"
          : "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          borderColor: "var(--sc-rose)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
        {icon && (
          <Box component="img" 
          src={icon} 
          sx={{
             mb: 2 ,
             height:100,
             width:100,
             borderRadius:"50%"
             }}>
            
          </Box>
        )}

        <Typography
          variant="h6"
          sx={{
            fontWeight: "var(--font-bold)",
            fontFamily: "var(--font-heading)",
            
            mb: 2,
            color: dark
              ? "var(--sc-gold)"
              : "var(--sc-ink)",
          }}
        >
          {title}
        </Typography>
        </Box>

        <Typography
          sx={{
            lineHeight: 1.8,
            fontFamily: "var(--font-body)",
            color: dark
              ? "var(--sc-cream)"
              : "var(--sc-muted)",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};