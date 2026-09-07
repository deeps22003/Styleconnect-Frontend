import { FormControl,FormLabel,TextField } from "@mui/material";
export const FormTextField=({label,name,value,onChange,
    type="text",error=false,helperText="",placeholder="",
    required=false,disabled=false})=>{
    return(
        <FormControl fullWidth>
            <FormLabel
             required={required}
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
            <TextField
            fullWidth
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            disabled={disabled}
            placeholder={placeholder}
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
            />
        </FormControl>
        
    )
}