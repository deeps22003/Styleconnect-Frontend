import { Footer } from "../../components/landing/FooterSection"
import { HeroSection } from "../../components/landing/HeroSection"
import { HowItWorksSection } from "../../components/landing/HowItWorksSection"
import { Navbar } from "../../components/landing/Navbar"
import { WhyChooseUs } from "../../components/landing/WhyChooseUs"
import { RegistrationLayout } from "../../components/layout/RegistrationLayout"

import { expertFeatures } from "../data/customerandexpert_features";
import { expertSteps } from "../data/howItWorksData"
import heroimg from "../../assets/images/HeroImg_2.png";

export const ExpertsLandingPage=()=>{
    return(
        <RegistrationLayout>
        <Navbar
        logo="StyleConnect"
        showNavigation={true}
        showBackButton={true}
        showAuthActions={true}
        />
        <HeroSection
            badge="FOR BEAUTY PROFESSIONALS"
            // title="Grow Your Beauty Business with StyleConnect"
              title="The Ultimate Platform for Elite Beauty Professionals"
            description="Everything you need to showcase your talent, gain high-value clients, and manage your business in one place"
            primaryButtonText="Join as Expert"
            image={heroimg}
        />
        <WhyChooseUs
            badge="Why Join StyleConnect"
            heading="Why Beauty Professionals Choose StyleConnect"
            description="Grow your beauty business on a platform designed to help professionals connect with more customers."
            features={expertFeatures}
            />
        <HowItWorksSection
        heading="Grow Your Beauty Business in 4 Simple Steps"
        description="Join StyleConnect, showcase your expertise, and start connecting with customers looking for beauty professionals."
        steps={expertSteps}
        />
        <Footer/>
        </RegistrationLayout>

    )
}




