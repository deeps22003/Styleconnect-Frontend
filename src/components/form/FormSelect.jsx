import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  helperText="",
  error=false,
  required=false,
  disabled=false,
  placeholder="Select an option"
}) => {
  return (
    <FormControl
      fullWidth
      required={required}
      error={error}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--sc-rose)"
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--sc-rose)",
            borderWidth: "2px"
          }
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--sc-rose)"
        }
      }}
    >
        <FormLabel
                sx={{
                    marginBottom:"8px",
                    color:"var(--sc-ink)",
                    fontSize:"14px",
                    fontWeight:600,
                    "&.Mui-focused":{
                        color:"var(--sc-ink)"
                    }

                }}
                >
                {label}
            </FormLabel>

      <Select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};