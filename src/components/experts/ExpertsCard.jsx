import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routePaths";
import { useLocation } from "react-router-dom";

export const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #E5DEDA",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "var(--sc-rose-wash)",
            mx: "auto",
            mb: 2,
          }}
        />

        <Typography
          align="center"
          variant="h6"
        >
          {expert.name}
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
        >
          {expert.services?.join(", ")}
        </Typography>

        <Typography
          align="center"
          sx={{ mt: 1 }}
        >
          ⭐ {expert.rating}
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
        >
          {expert.location}
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            mt: 2,
            textTransform: "none",
          }}
          onClick={() =>
           navigate(`/experts/${expert.expertId}`, {
              state: {
                expert,
                serviceCategoryId: location.state?.serviceCategoryId,
                categoryName: location.state?.categoryName,
              },
            })
          }
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};