import {Box, Typography } from "@mui/material"

import discoverIcon from "../../assets/icons/feature-icons/styleconnect_discover_feature.png";
import exploreIcon from "../../assets/icons/feature-icons/styleconnect_explore_feature.png";
import connectIcon from "../../assets/icons/feature-icons/styleconnect_connect_feature.png";
import bookIcon from "../../assets/icons/feature-icons/styleconnect_book_feature.png";
import { SectionHeader } from "../common/landing/SectionHeader";

export const AboutStyleConnect=()=>{
   const workflowSteps = [
  {
    title: "Discover",
    description: "Find experts based on your needs and location",
    icon: discoverIcon,
  },
  {
    title: "Explore",
    description: "View profiles, services, portfolios and reviews",
    icon: exploreIcon,
  },
  {
    title: "Connect",
    description: "Choose the right expert for your requirement",
    icon: connectIcon,
  },
  {
    title: "Book",
    description: "Schedule your appointment with ease",
    icon: bookIcon,
  },
];
    return(
        <Box 
        sx={{
            textAlign:"center",
            minHeight:"50vh",
            py:1,
            mt:2,
            maxWidth: "1000px",
            mx: "auto"
        }}>

           <SectionHeader
            badge="What is StyleConnect?"
            heading="A Platform for Beauty & Beyond"
            description="StyleConnect is a beauty and styling marketplace designed to connect customers with skilled beauty"
            />

           <Typography
            sx={{
            fontFamily:"var(--font-body)",
            fontWeight:"var(--font-regular)",
            mb:2
            }}>
            Whether you're looking for a makeup artist for your wedding, a hairstylist for a special event, or a beauty professional for your personal needs, StyleConnect helps you discover professionals, explore their services and book appointments.
            For professionals, StyleConnect provides a platform to showcase their expertise, manage appointments and connect with customers.
           </Typography>

           <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
                },
                gap: 4,
                mt: 5,
            }}
            >
            {workflowSteps.map((step) => (
                <Box
                key={step.title}
                sx={{
                   textAlign: "center",
                    px: 2,

                }}
                >
                <Box
                    sx={{
                        width: 90,
                        height: 90,
                        mx: "auto",
                        mb: 2,  
                        borderRadius: "20px",
                        backgroundColor: "var(--sc-rose-wash)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                    >
                   
                        <Box
                        component="img"
                        src={step.icon}
                        alt={step.title}
                        sx={{
                            width: "60%",
                            height: "60%",
                            objectFit: "contain",
                        }}
                        />
                    
                    </Box>

                <Typography
                    sx={{
                    fontWeight: "var(--font-bold)",
                    }}
                >
                    {step.title}
                </Typography>

                <Typography>{step.description}</Typography>
                </Box>
            ))}
            </Box>

        </Box>
    )
}