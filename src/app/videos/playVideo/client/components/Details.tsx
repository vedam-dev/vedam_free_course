'use client';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';


const Details = ({ title }: { title: string }) => {
  const [watched, setWatched] = React.useState(false);
  return (
    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
      <Typography>
        {title}
      </Typography>
      <Button
        variant="contained"
        onClick={() => { setWatched(true); }}>
        {watched ? 'Watched' : 'Mark as Watched'}
      </Button>
    </Box>
  );
};

export default Details;