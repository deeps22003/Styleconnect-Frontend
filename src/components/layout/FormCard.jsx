import { Box } from "@mui/material"
export const FormCard=({children})=>{
    return(
        <Box
        sx={{
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "var(--sc-card)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}
      >
        {children}
      </Box>
    )
}