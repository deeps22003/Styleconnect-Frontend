import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Button, Chip } from '@mui/material';

export default function ProfileCard({ 
  user, 
  name, 
  roleBadge, 
  avatarInitial, 
  actionButtonText, 
  onActionClick, 
  onBookClick 
}) {
  // Resolve name and login state dynamically across all sources
  const displayName = name || user?.name || user?.fullName || 'Guest User';
  const isLoggedIn = displayName !== 'Guest User' || Boolean(user && Object.keys(user).length > 0);

  // Role detection
  const userRole = user?.role || user?.userType || user?.roleBadge;
  const isExpert = String(userRole).toLowerCase().includes('expert');

  // Dynamic Badge Label
  const displayBadge = roleBadge || (
    !isLoggedIn 
      ? 'Guest Mode' 
      : isExpert 
        ? 'Expert Account' 
        : 'Customer Account'
  );

  // Initial letter
  const displayInitial = avatarInitial || (displayName !== 'Guest User' ? displayName.charAt(0).toUpperCase() : 'G');

  const handleClick = (e) => {
    // Directly call the handler provided by CustomerDashboard
    const handler = onActionClick || onBookClick;
    if (typeof handler === 'function') {
      handler(e);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        p: { xs: 1, sm: 2 },
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        mb: 3
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          p: 1,
          '&:last-child': { pb: 1 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: '#8C2B4E',
              color: '#FFFFFF',
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            {displayInitial}
          </Avatar>
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#1A1A1A',
                fontFamily: 'serif',
                lineHeight: 1.2
              }}
            >
              {displayName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666666',
                mt: 0.5,
                fontWeight: 500
              }}
            >
              {displayBadge}
            </Typography>
          </Box>
        </Box>

        {isExpert ? (
          <Chip
            label={`• ${user?.status || 'Accepting Bookings'}`}
            sx={{
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              fontWeight: 600,
              fontSize: '0.875rem',
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
          />
        ) : (
          <Button 
            variant="contained"
            disableElevation
            onClick={handleClick}
            sx={{
              backgroundColor: '#8C2B4E',
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '24px',
              px: 3,
              py: 1,
              alignSelf: { xs: 'flex-start', sm: 'center' },
              ml: { sm: 'auto' },
              '&:hover': { backgroundColor: '#6E213D' }
            }}
          >
            {actionButtonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}