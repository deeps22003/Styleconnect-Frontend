import { Grid } from "@mui/material";
import { ExpertCard } from "./ExpertsCard";
// import { expertsData } from "../../features/data/expertsData";

export const ExpertsGrid = ({experts=[]}) => {
  return (
    <Grid container spacing={3}>
      {experts.map((expert) => (
        <Grid
          key={expert.expertId}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <ExpertCard expert={expert} />
        </Grid>
      ))}
    </Grid>
  );
};