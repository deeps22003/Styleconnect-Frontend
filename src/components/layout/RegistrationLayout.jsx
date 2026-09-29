import {Box} from "@mui/material";
export const RegistrationLayout=({children})=>{
    return(
        <Box
              sx={{
                minHeight: "100vh",
                backgroundColor: "var(--sc-cream)",
                // padding: "24px"
                width:"100%"
              }}
        >
        {children}
        </Box>

        
    )
}