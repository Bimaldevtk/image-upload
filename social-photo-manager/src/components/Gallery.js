import { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/photos');
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  const incrementViews = async (id) => {
    try {
      await axios.post(`http://localhost:5000/photo/${id}/view`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  return (
    <div>
      {photos.map(photo => (
        <div key={photo.id}>
          <a href={photo.url} target="_blank" rel="noopener noreferrer" onClick={() => incrementViews(photo.id)}>
            <img src={photo.url} alt="Uploaded" style={{ width: '200px' }} />
          </a>
          <p>Views: {photo.views}</p>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
