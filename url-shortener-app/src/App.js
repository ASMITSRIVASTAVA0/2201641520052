import React from 'react';
import {
  BrowserRouter as Router
  ,Routes,
  Route} from 'react-router-dom';

import {
  ThemeProvider
  ,createTheme } 
from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';

import Navigation from './components/Navigation';

import ShortenerPage from './pages/ShortenerPage';

import StatsPage from './pages/StatsPage';

import Redirect from './components/Redirect';

import {Log} from './utils/logger';

const theme = createTheme({
  palette: {
    mode:'light',
    primary: {main: '#fc2470ff',},
    secondary: {main: '#fd2e76ff',},},
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>

          {/* pehla route */}
          <Route 
          path="/" 
          element={<ShortenerPage/>}
          />

        {/* dursa route */}
          <Route 
          path="/stats" 
          element={<StatsPage/>}
          />


{/* teesra route */}

          <Route 
          path="/:shortCode" 
          element={<Redirect/>}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;