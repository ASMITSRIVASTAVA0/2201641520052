import React from 'react';

import {Container} from '@mui/material';

import UrlShortener from '../components/UrlShortener';

const ShortenerPage = () => {
  return (
    <Container 

    maxWidth="lg" 
    sx={{mt:4,mb:4}}>
            
            <UrlShortener />


    </Container>
  );
};

export default ShortenerPage;