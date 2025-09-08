import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  IconButton
} from '@mui/material';

import { Add
    , Remove } from '@mui/icons-material';

import { isValidUrl
    ,isValidShortCode,
    isShortCodeUnique } from '../utils/validators';

import {saveUrl} from '../utils/storage';

import {Log} from '../utils/logger';

// i has initially set all the values to empty then will assing there when user will enter else default wilil be set my me
const UrlShortener=()=>{
  const [urls, setUrls]=useState([{
    longUrl: ''
    ,validity: ''
    ,shortCode:''}
]);

// i have used here usestate so that i can change the component

  const [errors,setErrors]=useState([]);
  const [success,setSuccess]=useState([]);

  const handleInputChange=(index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

//   i am checking her length 
  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortCode: '' }]);
      Log('frontend', 'info', 'component', 'Added new URL field');
    }
  };

//   when expires time arrive then remove it my me

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      Log('frontend', 'info', 'component', 'Removed URL field');
    }
  };

//   i has made here event hander to set values
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];
    const newSuccess = [];
    
    urls.forEach((url,index) => {
      if(!url.longUrl) 
        {
        newErrors[index] = { ...newErrors[index], longUrl: 'URL is required' };
        Log('frontend'
            , 'error'
            , 'component', 
            `URL at position ${index + 1} is empty`);

        return;
      }
      
      if (!isValidUrl(url.longUrl)) {
        newErrors[index] = 
        { ...newErrors[index], 
            longUrl: 'Invalid URL format' };
        return;
      }
      
      if(url.shortCode&&!isValidShortCode(url.shortCode)) 
        {
        newErrors[index]={ 
            // destructue kiye
          ...newErrors[index], 
          shortCode: 'Shortcode can only contain letters, numbers, hyphens, and underscores (max 20 characters)' 
        };
        return;
      }
      
      if (url.shortCode&&!isShortCodeUnique(url.shortCode)){
        newErrors[index]={ ...newErrors[index]
            , shortCode:'Shortcode already exists' };


        return;
      }
      
      if (url.validity && (isNaN(url.validity) || url.validity < 1)) {
        newErrors[index] = { 
            ...newErrors[index], 
            validity: 'Validity must be a positive number' };


        return;
      }
      
      const shortCode=url.shortCode||generateShortCode();

      const validity=url.validity?parseInt(url.validity):30;

      const expires=new Date(Date.now()+validity*60000);
      
      const urlData={
        id:Date.now()+index
        ,longUrl:url.longUrl,
        shortCode,
        createdAt:new Date(),//default kiya
        expires,
        clicks: []
      };
      
      if(saveUrl(urlData)){
        newSuccess[index]=`URL shortened successfully: ${window.location.origin}/${shortCode}`;
        Log('frontend'
            , 'info',
             'component', 
             `URL shortened: ${url.longUrl} -> ${shortCode}`);


      } 
      else{
        newErrors[index]={ general: 'Failed to save URL' };

        Log('frontend', 'error', 'component', `Failed to save URL: ${url.longUrl}`);
      }
    });
    
    setErrors(newErrors);
    setSuccess(newSuccess);
    
    if (newErrors.length === 0) {
      setUrls([{ longUrl: ''
        ,validity:''
        ,shortCode: '' }]);
    }
  };

  const generateShortCode=()=>{
    return Math.random().toString(36).substring(2, 8);
  };

  return  (
    <Paper 
    elevation={3} 
    sx={{ p: 3, mb: 3 }}
    >
      <Typography 
      variant="h5" 
      gutterBottom>

        Shorten URLs
      </Typography>
      
      <form 
      onSubmit={handleSubmit}>
        {urls.map((url, index)=>(
          <Box 
          key={index} 
          sx={{mb: 2,p:2,border:'1px solid #eee',borderRadius: 1 }}
          >

            <Grid 
            container 
            spacing={2} 
            alignItems="center"
            >
              <Grid 
              item xs={12}
              >
                <TextField
                  fullWidth
                  label="Long URL"
                  value={url.longUrl}
                  onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                  error={!!errors[index]?.longUrl}
                  helperText={errors[index]?.longUrl}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validity (minutes, default: 30)"
                  type="number"
                  value={url.validity}
                  onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                  error={!!errors[index]?.validity}
                  helperText={errors[index]?.validity}
                />
              </Grid>
              
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  value={url.shortCode}
                  onChange={(e) => handleInputChange(index, 'shortCode', e.target.value)}
                  error={!!errors[index]?.shortCode}
                  helperText={errors[index]?.shortCode}
                />
              </Grid>
              
              <Grid item xs={12} sm={1}>
                {urls.length > 1 && (
                  <IconButton onClick={() => removeUrlField(index)} color="error">
                    <Remove />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            
            {success[index] && (
              <Alert severity="success" sx={{ mt: 1 }}>
                {success[index]}
              </Alert>
            )}
            
            {errors[index]?.general && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors[index].general}
              </Alert>
            )}
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {urls.length < 5 && (
            <Button
              variant="outlined"
              onClick={addUrlField}
              startIcon={<Add />}
            >
              Add Another URL
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            disabled={urls.some(url => !url.longUrl)}
          >
            Shorten URLs
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UrlShortener;