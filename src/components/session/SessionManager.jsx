import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { logout } from "../../features/auth/authSlice";
import {
  clearAuthData,
  getAuthData,
} from "../../utils/authStorage";

import ROUTES from "../../routes/routePaths";
import { SessionWarningDialog } from "./SessionWarningDialog";

export const SessionManager = () => {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const idleTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Testing
  const IDLE_TIMEOUT = 14000;

  // Production
  // const IDLE_TIMEOUT = 14 * 60 * 1000;

  const publicRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.CUSTOMER_REGISTER,
    ROUTES.EXPERT_REGISTER,
  ];

  const clearAllTimers = () => {
    clearTimeout(idleTimerRef.current);
    clearInterval(countdownTimerRef.current);
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimerRef.current);

    if (open) return;

    idleTimerRef.current = setTimeout(() => {
      setSecondsLeft(60);
      setOpen(true);
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    if (publicRoutes.includes(location.pathname)) {
      clearAllTimers();
      setOpen(false);
      return;
    }

    const authData = getAuthData();

    if (!authData) {
      clearAllTimers();
      setOpen(false);
      return;
    }

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(
          event,
          resetIdleTimer
        );
      });

      clearAllTimers();
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimerRef.current);
    };
  }, [open]);

  const handleContinue = () => {
    clearInterval(countdownTimerRef.current);

    setOpen(false);
    setSecondsLeft(60);

    resetIdleTimer();
  };

  const handleLogout = () => {
    clearAllTimers();

    setOpen(false);
    setSecondsLeft(60);

    clearAuthData();

    dispatch(logout());

    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  };

  if (publicRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <SessionWarningDialog
      open={open}
      secondsLeft={secondsLeft}
      onContinue={handleContinue}
      onLogout={handleLogout}
    />
  );
};