import { Box } from "@mui/material"
import { Heading } from "../typography/Heading"
import { Caption } from "../typography/Caption"


export const RegistrationHeader=({heading,caption})=>{
    return(
    <Box 
        sx={{
                display:"flex",
                flexDirection:"column",
                gap:1,
                mb:4
            }}
    >
      <Heading>
        {heading}
      </Heading>
      <Caption>
        {caption}
      </Caption>
    </Box>
    )
}