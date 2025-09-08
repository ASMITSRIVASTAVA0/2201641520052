import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
  Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, OpenInNew } from '@mui/icons-material';
import { getStoredUrls } from '../utils/storage';
import { Log } from '../utils/logger';

const Statistics=()=>{
  const [urls,setUrls]=useState([]);

  const [openRows,setOpenRows]=useState({});

  useEffect(()=>{
    const storedUrls = getStoredUrls();
    setUrls(storedUrls);
    Log('frontend', 'info', 'component', `Loaded ${storedUrls.length} URLs for statistics`);
  }, []);

  const toggleRow = (id) => {
    setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
  };


  const handleRedirect = (shortCode) => {
    window.open(`${window.location.origin}/${shortCode}`, '_blank');
  };



  const isExpired=(expiryDate)=>{
    return new Date()>new Date(expiryDate);
  };




  const getLocationString = (click) => {
    return click.location ? `${click.location.city}, ${click.location.country}` : 'Unknown';
  };

  if(urls.length === 0) 
{
    return 
    (
      <Paper 
      elevation={3} 
      sx={{ p: 3 }}
      >
        <Typography 
        variant="h5" 
        gutterBottom
        >
          URL Statistics
        </Typography>
        <Typography 
        variant="body1" 
        color="text.secondary"
        >
          No URLs have been shortened yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
     elevation={3}
      sx={{ p: 3 }}>
      <Typography 

      variant="h5" 
      gutterBottom>
        URL Statistics
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <React.Fragment key={url.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(url.id)}
                    >
                      {openRows[url.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">
                        {window.location.origin}/{url.shortCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {url.longUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(url.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={new Date(url.expires).toLocaleString()}
                      color={isExpired(url.expires) ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>


                  <TableCell>
                    {url.clicks ? url.clicks.length : 0}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleRedirect(url.shortCode)}
                    >
                      <OpenInNew />
                    </IconButton>
                  </TableCell>
                </TableRow>


                <TableRow>
                  <TableCell 
                  style={{paddingBottom:0,paddingTop: 0 }} 
                  colSpan={7}>
                    <Collapse 
                    in={openRows[url.id]} 
                    timeout="auto" 
                    unmountOnExit>
                      <Box 
                      sx={{ margin: 1 }}>
                        <Typography 
                        variant="h6" 
                        gutterBottom 
                        component="div">
                          Click Details
                        </Typography>
                        {url.clicks && url.clicks.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clicks.map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {new Date(click.timestamp).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    {click.source}
                                    </TableCell>
                                  <TableCell>
                                    {getLocationString(click)}
                                    </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography 
                          variant="body2" 
                          color="text.secondary">
                            No clicks recorded yet.
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>


              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Statistics;