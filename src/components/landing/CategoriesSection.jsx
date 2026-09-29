import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import { categoryImages } from "../../assets/icons/categoryIcons";
import { useNavigate } from "react-router-dom";

export const CategoriesSection = ({
  sectionTag,
  heading,
  description,
  services = [],
  loading,
  error,
}) => {
  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  const navigate=useNavigate();

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 10,
        bgcolor: "var(--sc-cream)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 6,
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "var(--sc-rose)",
              letterSpacing: 1,
              textTransform: "uppercase",
              mb: 2,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {sectionTag}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "var(--sc-ink)",
              fontWeight: 600,
              maxWidth: "700px",
              fontFamily: "var(--font-heading)",
              // fontSize: "26.82px",
            }}
          >
            {heading}
          </Typography>
        </Box>

        <Typography
          sx={{
            maxWidth: "450px",
            color: "var(--sc-muted)",
            fontSize: "15.5px",
            lineHeight: "23.25px",
            fontFamily: "var(--font-body)",
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Service Cards */}
      <Grid container spacing={4}>
        {services.map((service) => {
          const imageSrc = categoryImages[service.categoryIcon];

          return (
            <Grid
              key={service.serviceCategoryId}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Card
                onClick={()=>navigate(`/categories/${service.serviceCategoryId}`)}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #E5DEDA",
                  boxShadow: "none",
                  bgcolor: "#fff",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                    borderColor: "var(--sc-rose)",
                  },
                }}
              >
                {/* Service Image */}
                {imageSrc && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={imageSrc}
                    alt={service.categoryName}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Service Name */}
                <CardContent
                  sx={{
                    py: 2.5,
                    px: 2.5,
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 500,
                      color: "var(--sc-ink)",
                      lineHeight: 1.3,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {service.categoryName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};