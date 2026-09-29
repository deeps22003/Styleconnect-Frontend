import { useDispatch, useSelector } from "react-redux";

import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { Navbar } from "../../components/landing/navbar";
import { HeroSection } from "../../components/landing/HeroSection";
import { useNavigate } from "react-router-dom";
import { customerNavItems } from "../data/navbarConfig";
import {guestHeroContent, customerHeroContent} from "../data/heroContent";
import ROUTES from "../../routes/routePaths";
import { SearchFilterSection } from "../../components/landing/SearchFilterSection";
import { CategoriesSection } from "../../components/landing/CategoriesSection";
import { HowItWorksSection } from "../../components/landing/HowItWorksSection";
// import { howItWorksSteps } from "../data/howItWorksData";
import HeroImg1 from "../../assets/images/HeroImg_1.png";
import { fetchCategories } from "../slices/categorySlice";
import { useEffect } from "react";
import { AboutStyleConnect } from "../../components/landing/AboutStyleConnect";
import { AudienceSection } from "../../components/landing/AudienceSection";
import { Footer } from "../../components/landing/FooterSection";
import { WhyChooseUs } from "../../components/landing/WhyChooseUs";
import { ExpertSection } from "../../components/landing/ExpertSection";
import { customerFeatures } from "../data/customerandexpert_features";
import { customerSteps } from "../data/howItWorksData";
import { getUserRole } from "../../utils/authStorage";
import { Navigate } from "react-router-dom";

export const HomePage = () => {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {categories,loading,error}=useSelector((state)=>state.categories);
  useEffect(()=>{dispatch(fetchCategories())},[dispatch]);

   if(isAuthenticated){
    const roleId=getUserRole();
    if(roleId===1){
      return(
        navigate(ROUTES.CUSTOMER_DASHBOARD,{replace:true})
       );

    }
    if(roleId===2){
      return(
        navigate(ROUTES.EXPERT_DASHBOARD,{replace:true})
      );
    }
   }


  const heroContent = isAuthenticated
    ? customerHeroContent(user?.fullName)
    : guestHeroContent;

    
  return (

    

    <RegistrationLayout>
      <Navbar
        logo="StyleConnect"
        navigationItems={customerNavItems}
        actionButtonText="Become an Expert"
      />

      <HeroSection
        badge={heroContent.badge}
        title={heroContent.title}
        description={heroContent.description}
        primaryButtonText={heroContent.primaryButtonText}
        secondaryButtonText={heroContent.secondaryButtonText}
        onPrimaryClick={() => navigate(ROUTES.EXPERTS)}
        onSecondaryClick={()=>navigate(ROUTES.REGISTER)}
        image={HeroImg1}
      />
      {/* <SearchFilterSection/> */}

      <AboutStyleConnect/>
      <WhyChooseUs
        badge="Why Choose Us"
        heading="Your Shortcut to Exceptional Beauty Care"
        description="We bring the expertise, the care, and the personalization that transforms how you present yourself to the world."
        features={customerFeatures}
      />
      {/* <AudienceSection/> */}
      
      

     

     <HowItWorksSection
      heading="Find and Book Your Perfect Beauty Expert in 4 Simple Steps"
      description="From discovering talented beauty professionals to booking appointments with confidence, StyleConnect makes finding the right expert effortless."
      steps={customerSteps}
    />
       <CategoriesSection
        sectionTag="Browse By Service"
        heading="A style for every moment"
        description="From wedding-day glam to a quick weekday trim, explore the categories our community books most."
        services={categories}
        loading={loading}
        error={error}
      />

      <ExpertSection/>

      <Footer/>

    </RegistrationLayout>
  );
};






