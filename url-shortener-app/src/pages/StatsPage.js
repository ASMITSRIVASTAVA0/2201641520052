import React from 'react';
import { 
    Container 
} from '@mui/material';


import Statistics from '../components/Statistics';

const StatsPage = () => {
  return (
    <Container 
    maxWidth="lg" 
    sx={{mt:4,mb:4}}>
                    
                <Statistics />
    </Container>
  );
};

export default StatsPage;