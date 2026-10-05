import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";

import ROUTES from "../../routes/routePaths";
import { clearAuthData } from "../../utils/authStorage";
import { logout } from "../../features/auth/authSlice";


export const Navbar = ({
  logo = "StyleConnect",
  navigationItems = [],
  showNavigation = true,
  showAuthActions = true,
  showBackButton = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {

  if (isAuthenticated) {
    dispatch(logout());
    clearAuthData();
  }

  navigate(ROUTES.HOME);
};
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        bgcolor: "var(--sc-cream)",
        color: "var(--sc-ink)",
        boxShadow: "none",
        borderBottom: "1px solid #D9D1CC",
      }}
    >
      <Toolbar>
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          

          <Box
            onClick={handleLogoClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "var(--sc-rose)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  color: "#fff",
                  fontSize: 24,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--sc-plum)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {logo}
            </Typography>
          </Box>
        </Box>

        {/* Center Navigation */}
        {showNavigation && (
          <Box
            sx={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                onClick={item.onClick}
                sx={{
                  textTransform: "none",
                  color: "var(--sc-muted)",
                  fontSize: "15px",
                  p: 0,
                  minWidth: "auto",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {!showNavigation && <Box sx={{ flex: 2 }} />}

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {!isAuthenticated ? (
            <>
              {showAuthActions && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "14px",
                    color: "var(--sc-muted)",
                  }}
                >
                  <Box>Already a member?</Box>

                  <Button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    sx={{
                      textTransform: "none",
                      minWidth: "auto",
                      p: 0,
                      color: "var(--sc-plum)",
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Button>

                  <Box>|</Box>

                  <Button
                    onClick={() => navigate(ROUTES.REGISTER)}
                    sx={{
                      textTransform: "none",
                      minWidth: "auto",
                      p: 0,
                      color: "var(--sc-plum)",
                      fontWeight: 600,
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <>
              <IconButton
                onClick={handleOpenMenu}
                sx={{
                  bgcolor: "var(--sc-rose-wash)",
                  color: "var(--sc-rose-deep)",
                  border: "1px solid var(--sc-rose-light)",
                  "&:hover": {
                    bgcolor: "var(--sc-rose-light)",
                  },
                }}
              >
                <AccountCircleIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                slotProps={{
                  sx: {
                    width: 250,
                    borderRadius: 4,
                    mt: 1.5,
                    p: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseMenu();
                  }}
                >
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/dashboard");
                    handleCloseMenu();
                  }}
                >
                  Dashboard
                </MenuItem>

                <MenuItem
                 onClick={() => {
                  dispatch(logout());
                  clearAuthData();
                  handleCloseMenu();
                  navigate(ROUTES.HOME);
                }}
              >
              Logout
            </MenuItem>
              </Menu>
            </>
          )}
        </Box>
        {showBackButton && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                color: "var(--sc-muted)",
                minWidth: "auto",
              }}
            >
              Back
            </Button>
          )}
      </Toolbar>
    </AppBar>
  );
};