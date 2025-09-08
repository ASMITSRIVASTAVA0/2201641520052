import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Log } from '../utils/logger';

const Navigation = () => {
  const location = useLocation();

  const handleTabChange = (event, newValue) => {
    Log('frontend', 
        'info'
        , 'component'
        , `Navigated to ${newValue} page`);
  };

  return (
    <AppBar 
    position="static">
      <Toolbar>
        <Typography 
        variant="h6" 
        component="div" 
        sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>

        <Tabs 
          value={location.pathname} 
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab 
          label="Shortener" 
          value="/" 
          component={Link} to="/" />

          <Tab 
          label="Statistics" 
          value="/stats" 
          component={Link} 
          
          to="/stats" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;