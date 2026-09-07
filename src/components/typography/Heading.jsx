import { Typography } from "@mui/material"

export const Heading=({children})=>{
return(
    <Typography
    variant="h4"
    sx={{
        color:"var(--sc-ink)",
        fontWeight:600,
        fontSize: "26px",
        lineHeight:1.2,
        letterSpacing: "-0.01em",
        fontFamily:"var(--font-heading)"
    }}
    >
        {children}
    </Typography>
)
}