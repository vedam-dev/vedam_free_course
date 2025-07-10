'use client';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';


const VimeoUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');





  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setStatus('');
      setVideoUrl('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    setVideoUrl('');
    if(!selectedFile) {
      setStatus('Please select a video file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('/api/upload/vimeo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if(progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      setUploading(false);
      if(response.data.url) {
        setStatus('Upload successful!');
        setVideoUrl(response.data.url);
      } else {
        setStatus('Upload failed. Please try again.');
      }
    } catch(error: unknown) {
      console.log(error);
      setUploading(false);
      setStatus('Upload failed. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        background: '#fafafa',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Upload Video to Vimeo
      </Typography>
      <Button
        variant="contained"
        component="label"
        color="primary"
        disabled={uploading}
      >
        {selectedFile ? selectedFile.name : 'Choose Video File'}
        <input
          type="file"
          accept="video/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Button>
      {uploading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" align="center">
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={uploading || !selectedFile}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {status && (
        <Typography
          variant="body2"
          color={status.includes('success') ? 'green' : 'error'}
        >
          {status}
        </Typography>
      )}
      {videoUrl && (
        <Box>
          <Typography variant="body2" color="primary">
            Video uploaded!{' '}
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              View Video
            </a>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VimeoUpload;
