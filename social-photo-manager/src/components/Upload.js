import { useState } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const url = response.data.url;
      setFileURL(url);
      setMessage('Upload successful! Click the button to copy the link.');
      setFile(null);
    } catch (error) {
      setMessage('Error uploading file.');
      console.error('Error uploading file:', error);
    }

    setUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {fileURL && (
        <CopyToClipboard text={fileURL} onCopy={() => setMessage('Link copied to clipboard!')}>
          <button>Copy Link</button>
        </CopyToClipboard>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;
