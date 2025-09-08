import React, { 
    useEffect, 
    useState} from 'react';
import { 
    useParams 
} from 'react-router-dom';

import { 
    Box, 
    Typography, 
    CircularProgress, 
    Alert 
} from '@mui/material';

import { getStoredUrls, 
    updateUrlStats 
} from '../utils/storage';


import { 
    Log 
} from '../utils/logger';

const Redirect=()=>{
  const {shortCode}=useParams();
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    const redirectUrl=async()=>{
      try
      {
        Log('frontend','info','page',`Attempting redirect for shortcode: ${shortCode}`);
        
        const urls = getStoredUrls();
        const urlData = urls.find(url => url.shortCode === shortCode);
        
        if(!urlData) 
        {
          setError('URL not found');
          Log('frontend', 'error', 'page', `Shortcode not found: ${shortCode}`);
          return;
        }
        
        if(new Date() > new Date(urlData.expires)) 
        {
          setError('This URL has expired');
          Log('frontend', 'warn', 'page', `Expired shortcode accessed: ${shortCode}`);
          return;
        }
        
        const clickData = 
        {
          timestamp: new Date(),
          source: document.referrer || 'direct',
          location: await getLocation()
        };
        
        updateUrlStats(shortCode, clickData);
        Log('frontend', 'info', 'page', `Redirecting to: ${urlData.longUrl}`);
        
        setTimeout(() => 
            {
          window.location.href = urlData.longUrl;
        }, 1500);
        
      } 
      catch(error) 
      {
        setError('An error occurred during redirect');
        Log('frontend', 'error', 'page', `Redirect error: ${error.message}`);
      } 
      finally
       {
        setLoading(false);
      }
    };
    
    redirectUrl();
  }, [shortCode]);
  
  const getLocation=async()=>{
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();


      return {
        city: data.city,
        country: data.country_name
      };


    } 
    catch(error){
      Log('frontend',
        'error',
        'utils',
        `Failed to get location: ${error.message}`);


      return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' }}>
        <CircularProgress />
        <Typography 
        variant="h6" 
        sx={{ mt: 2 }}>
          Redirecting...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3 }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          <Typography 
          variant="h6">
            Error
            </Typography>
          <Typography>
            {error}
            </Typography>
        </Alert>
      </Box>
    );
  }

  return null;
};

export default Redirect;