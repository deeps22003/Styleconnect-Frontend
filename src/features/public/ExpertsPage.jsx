  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";

  import { ExpertsHero } from "../../components/experts/ExpertsHero";
  import { ExpertsSearch } from "../../components/experts/ExpertsSearch";
  import { ExpertsGrid } from "../../components/experts/ExpertsGrid";
  import { ExpertFilters } from "../../components/experts/ExpertsFilters";

  import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
  import { Navbar } from "../../components/landing/Navbar";

  import { useNavigate,useParams} from "react-router-dom";
  import { categoryImages } from "../../assets/icons/categoryIcons";

  import ROUTES from "../../routes/routePaths";
  import { fetchExperts } from "../slices/expertSlice";
  import { fetchCategories } from "../slices/categorySlice";
  import { categoryDetails } from "../data/categoryDetails";

  export const ExpertsPage = () => {
    const [searchText, setSearchText] =
      useState("");

    const {categoryId}=useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { experts, loading, error } =
      useSelector((state) => state.experts);

    const {categories}=useSelector((state)=>state.categories);
    const selectedCategory=categories?.find((service)=>
        service.serviceCategoryId===Number(categoryId)
    );

    const categoryExperts = categoryId
      ? experts.filter((expert) =>
          expert.services?.some(
            (service) =>
              service.toLowerCase() ===
              selectedCategory?.categoryName?.toLowerCase()
          )
        )
      : experts;

        const categoryInfo=selectedCategory?
        categoryDetails[selectedCategory.categoryName]:null;

    useEffect(() => {
      if (experts.length === 0) {
        dispatch(fetchExperts());
      }
    }, [dispatch, experts.length]);

    useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

    const filteredExperts = categoryExperts.filter(
    (expert) =>
      expert.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      expert.services
        ?.join(", ")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      expert.location
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
  );

    const handleBack = () => {
      navigate(ROUTES.HOME);
    };

    if (loading && experts.length === 0) {
      return (
        <RegistrationLayout>
          <Navbar
            logo="StyleConnect"
            showNavigation={false}
            showBackButton={true}
            showAuthActions={false}
            onBackClick={handleBack}
          />

          Loading experts...
        </RegistrationLayout>
      );
    }

    if (error) {
      return (
        <RegistrationLayout>
          <Navbar
            logo="StyleConnect"
            showNavigation={false}
            showBackButton={true}
            showAuthActions={false}
            onBackClick={handleBack}
          />

          Error: {error}
        </RegistrationLayout>
      );
    }

    return (
      <RegistrationLayout>
        <Navbar
          logo="StyleConnect"
          showNavigation={false}
          showBackButton={true}
          showAuthActions={false}
          onBackClick={handleBack}
        />

        <ExpertsHero
          title={
            categoryInfo?.title ||
            "Beauty Experts"
          }
          description={
            categoryInfo?.description ||
            "Discover and connect with top-rated beauty experts."
          }
          image={categoryInfo?.image}
        />

        <ExpertsSearch
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <ExpertFilters />

        <ExpertsGrid experts={filteredExperts} />
      </RegistrationLayout>
    );
  };