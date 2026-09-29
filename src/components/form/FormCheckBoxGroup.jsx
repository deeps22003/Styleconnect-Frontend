import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";

export const FormCheckboxGroup = ({
  label,
  options = [],
  values = [],
  onChange,
}) => {
  return (
    <FormControl fullWidth>
      <FormLabel
        sx={{
          marginBottom: "8px",
          color: "var(--sc-ink)",
          fontSize: "14px",
          fontWeight: 600,
          "&.Mui-focused": {
            color: "var(--sc-ink)",
          },
        }}
      >
        {label}
      </FormLabel>

      <FormGroup>
        <Grid container spacing={1}>
          {options.map((option) => (
            <Grid
              key={option.id}
              size={{ xs: 12, sm: 6 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value={option.id}
                    checked={values.includes(option.id)}
                    onChange={onChange}
                    sx={{
                      borderRadius: "14px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      // background: "var(--sc-cream)",
                    }}
                  />
                }
                label={option.name}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </FormControl>
  );
};