import { Button, dialogActionsClasses } from "@mui/material";
export const PrimaryButton=({children,onClick,disabled=false,type="button"})=>{
    return(
        <Button fullWidth
        variant="contained"
        type={type}
        onClick={onClick}
        disabled={disabled}
        sx={{
            backgroundColor:"var(--sc-rose)",
            borderRadius:"12px",
            minHeight:"48px",
            fontWeight:600,
            "&:hover":{
                backgroundColor:"var(--sc-rose-dark)"
            }
        }}
        >
            {children}
        </Button>
    )
}