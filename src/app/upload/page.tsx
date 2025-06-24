'use client';

import React, {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  MouseEvent,
  useRef,
  useState,
} from 'react';
import './style.css';

const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

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

    if(!username || !password) {
      setStatus('Please enter your Streamable credentials.');
      setLoading(false);
    }

    // Check file size (limit to 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
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
    formData.append('username', username || 'hrishabh.bharati@vedam.org');
    formData.append('password', password || 'abcd@123');

    try {
      setUploadProgress('Uploading to Streamable...');

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
        setUsername('');
        setPassword('');
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
    type: 'username' | 'password'
  ) => {
    if(type === 'username') {
      setUsername(e.target.value || 'hrishabh.bharati@vedam.org');
    } else {
      setPassword(e.target.value || 'abcd@123');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.[0]) {
      const file = e.target.files[0];
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

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Video to Streamable</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Streamable Username{' '}
            <input
              type="text"
              value={username}
              onChange={(e) => handleInputChange(e, 'username')}
              placeholder="Enter your Streamable username"
              className="form-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Streamable Password{' '}
            <input
              type="password"
              value={password}
              onChange={(e) => handleInputChange(e, 'password')}
              placeholder="Enter your Streamable password"
              className="form-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Video File{' '}
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="form-file-input"
            />
          </label>
          <div className="file-info">
            Maximum file size: 500MB. Supported formats: MP4, AVI, MOV, WMV,
            FLV, WebM
          </div>
        </div>

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
        <strong>Note:</strong> You need a Streamable account to upload videos.
        The upload process may take a few minutes depending on your file size
        and internet connection.
      </div>
    </div>
  );
};

export default UploadPage;
