import {Box,Button} from "@mui/material"
export const RegistrationNavbar=({onBack,backLabel ="Back"})=>{
    return(
        <Box sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            width:"100%"

        }}>
            <Box sx={{
                fontSize:"20px",
                fontWeight:700,
                color:"var(--sc-plum)"

            }}>
                Style Connect
            </Box>
            <Button onClick={onBack}
            sx={{
                color:"var(--sc-muted)",
                textTransform:"none",
                fontSize:"14px",
                fontWeight:500,
                minWidth:"auto",
                padding:0
            }}>
                 {backLabel}
            </Button>
        </Box>
    )
}