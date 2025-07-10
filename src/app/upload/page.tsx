'use client';

import { FormControlLabel, Radio } from '@mui/material';
import React, {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  MouseEvent,
  useRef,
  useState,
} from 'react';

import './style.css';
import VimeoUpload from './Vimeo';

const isGDrive = process.env.NEXT_PUBLIC_PUBLIC_GDRIVE;

const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [path, setPath] = useState('');
  const [shortcode, setShortcode] = useState<string>('');
  const [gdriveLink, setGdriveLink] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if(
      username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid credentials');
      setAuthLoading(false);
    }
  };

  // GDrive form submit
  const handleGDriveSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    setUploadProgress('Saving to database...');

    if(!gdriveLink || !shortcode) {
      setStatus('Google Drive link and shortcode are required.');
      setLoading(false);
      setUploadProgress('');
      return;
    }

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamableUrl: gdriveLink,
          shortcode,
          title,
          topic,
        }),
      });
      const data = await res.json();
      if(res.ok) {
        setStatus('Video info saved successfully!');
        setVideoUrl(gdriveLink);
        setGdriveLink('');
        setShortcode('');
        setTitle('');
        setTopic('');
      } else {
        setStatus(data.error ?? 'Failed to save video info.');
      }
    } catch{
      setStatus('An error occurred. Please try again.');
    }
    setLoading(false);
    setUploadProgress('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    setVideoUrl('');
    setLoading(true);
    setUploadProgress('Preparing upload...');

    if(!fileInputRef.current?.files) {
      setStatus('Please select a video file.');
      setLoading(false);
      return;
    }

    const file = fileInputRef.current.files[0];

    // Validation
    if(!file) {
      setStatus('Please select a video file.');
      setLoading(false);
      return;
    }

    if(!title) {
      setStatus('Please enter a video title.');
      setLoading(false);
      return;
    }

    if(!process.env.NEXT_PUBLIC_STREAMABLE_USERNAME ||
       !process.env.NEXT_PUBLIC_STREAMABLE_PASSWORD) {
      setStatus('Server configuration error. Please contact support.');
      setLoading(false);
      return;
    }

    // Check file size (limit to 1GB)
    const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
    if(file.size > maxSize) {
      setStatus('File size too large. Maximum size is 500MB.');
      setLoading(false);
      return;
    }

    // Check file type
    const allowedTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
    ];
    if(
      !allowedTypes.includes(file.type) &&
      !RegExp(/\.(mp4|avi|mov|wmv|flv|webm)$/i).exec(file.name)
    ) {
      setStatus(
        'Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM).'
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', process.env.NEXT_PUBLIC_STREAMABLE_USERNAME);
    formData.append('password', process.env.NEXT_PUBLIC_STREAMABLE_PASSWORD);
    formData.append('title', title);
    formData.append('topic', topic);

    try {
      setUploadProgress('Uploading ...');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if(res.ok && data.url) {
        setVideoUrl(data.url);
        setStatus('Upload successful!');
        setUploadProgress('');

        // Clear form
        setTitle('');
        setTopic('');
        if(fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatus(data.error ?? 'Upload failed.');
        setUploadProgress('');
      }
    } catch(err) {
      console.error('Upload error:', err);
      setStatus('An error occurred during upload. Please try again.');
      setUploadProgress('');
    }

    setLoading(false);
  };

  const formatFileSize = (bytes: number): string => {
    if(bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'title' | 'topic' | 'path'
  ) => {
    switch (type) {
      case 'title':
        setTitle(e.target.value);
        break;
      case 'topic':
        setTopic(e.target.value);
        break;
      case 'path':
        setPath(e.target.value);
        break;
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.[0]) {
      const file = e.target.files[0];
      console.log(file);
      setStatus(`Selected: ${file.name} (${formatFileSize(file.size)})`);
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.classList.add('input-focus');
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.target.classList.remove('input-focus');
  };

  const handleButtonHover = (
    e:
      | MouseEvent<HTMLButtonElement | HTMLAnchorElement>
      | FocusEvent<HTMLButtonElement | HTMLAnchorElement>,
    hover: boolean
  ) => {
    if(!loading) {
      if(hover) {
        (e.currentTarget as HTMLElement).classList.add('button-hover');
      } else {
        (e.currentTarget as HTMLElement).classList.remove('button-hover');
      }
    }
  };

  if(isGDrive === 'google') {

    if(!isAuthenticated) {
      return (
        <div className="upload-container">
          <h2 className="upload-title">Video Upload Login</h2>

          {authError && (
            <div className="status-message status-error">{authError}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
              Username
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="form-input"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  autoFocus
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
              Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="form-input"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`submit-button${authLoading ? ' button-disabled' : ''}`}
              onMouseOver={(e) => handleButtonHover(e, true)}
              onMouseOut={(e) => handleButtonHover(e, false)}
              onFocus={(e) => handleButtonHover(e, true)}
              onBlur={(e) => handleButtonHover(e, false)}
            >
              {authLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      );
    }



    return (
      <div className="upload-container">
        <h2 className="upload-title">Add Google Drive Video</h2>
        <form onSubmit={handleGDriveSubmit}>
          <div className="form-group">
            <label className="form-label">
              Google Drive Link{' '}
              <input
                type="url"
                value={gdriveLink}
                onChange={e => setGdriveLink(e.target.value)}
                placeholder="Paste Google Drive share link"
                className="form-input"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Shortcode{' '}
              <input
                type="text"
                value={shortcode}
                onChange={e => setShortcode(e.target.value)}
                placeholder="Enter unique shortcode"
                className="form-input"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Video Title{' '}
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Video Topic{' '}
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter video topic/category"
                className="form-input"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`submit-button${loading ? ' button-disabled' : ''}`}
          >
            {loading ? 'Saving...' : 'Save Video Info'}
          </button>
        </form>
        {uploadProgress && <div className="upload-progress">{uploadProgress}</div>}
        {status && (
          <div className={`status-message${videoUrl ? ' status-success' : ' status-error'}`}>{status}</div>
        )}
        {videoUrl && (
          <div className="video-result">
            <div className="video-result-title">Your video info is saved!</div>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="video-link"
            >
              View on Google Drive →
            </a>
            <div className="video-url">{videoUrl}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Video to Streamable</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Video Title{' '}
            <input
              type="text"
              value={title}
              onChange={(e) => handleInputChange(e, 'title')}
              placeholder="Enter video title"
              className="form-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Video Topic{' '}
            <input
              type="text"
              value={topic}
              onChange={(e) => handleInputChange(e, 'topic')}
              placeholder="Enter video topic/category"
              className="form-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">
            Input Video File Path to Upload on Vimeo {' '}
            <input
              type="text"
              value={path}
              onChange={(e) => handleInputChange(e, 'path')}
              placeholder="Enter complete Video File Path"
              className="form-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Choose Video File to Upload on Streamable{' '}
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="form-file-input"
              required
            />
          </label>
          <div className="file-info">
            Maximum file size: 500MB. Supported formats: MP4, AVI, MOV, WMV,
            FLV, WebM
          </div>
        </div>
        <FormControlLabel value="streamable" control={<Radio />} label="Streamable" />
        <FormControlLabel value="vimeo" control={<Radio />} label="Vimeo" />

        <VimeoUpload/>



        <button
          type="submit"
          disabled={loading}
          className={`submit-button${loading ? ' button-disabled' : ''}`}
          onMouseOver={(e) => handleButtonHover(e, true)}
          onMouseOut={(e) => handleButtonHover(e, false)}
          onFocus={(e) => handleButtonHover(e, true)}
          onBlur={(e) => handleButtonHover(e, false)}>
          {loading ? 'Processing...' : 'Upload Video'}
        </button>
      </form>

      {uploadProgress && (
        <div className="upload-progress">{uploadProgress}</div>
      )}

      {status && (
        <div
          className={`status-message${
            videoUrl ? ' status-success' : ' status-error'
          }`}>
          {status}
        </div>
      )}

      {videoUrl && (
        <div className="video-result">
          <div className="video-result-title">Your video is ready!</div>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="video-link"
            onMouseOver={(e) => handleButtonHover(e, true)}
            onMouseOut={(e) => handleButtonHover(e, false)}
            onFocus={(e) => handleButtonHover(e, true)}
            onBlur={(e) => handleButtonHover(e, false)}>
            View on Streamable →
          </a>
          <div className="video-url">{videoUrl}</div>
        </div>
      )}

      <div className="note">
        <strong>Note:</strong> The upload process may take a few minutes depending on your file size
        and internet connection.
      </div>
    </div>
  );
};

export default UploadPage;