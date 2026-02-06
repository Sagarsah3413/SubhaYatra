import { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEye, FaDownload, FaImage, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import SmartImage from './SmartImage';
import imageService from '../services/imageService';

/**
 * ImageManager Component - Admin interface for managing images
 */
export default function ImageManager({ item, onImagesUpdate = null }) {
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (item) {
      loadImages();
    }
  }, [item]);

  const loadImages = async () => {
    if (!item) return;
    
    setIsLoading(true);
    try {
      const imageUrls = imageService.getAllImageUrls(item);
      setImages(imageUrls);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const uploadImages = async () => {
    if (!selectedFiles.length || !item) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const result = await imageService.uploadImage(file, item.type, item.id);
        setUploadProgress(((index + 1) / selectedFiles.length) * 100);
        return result;
      });

      await Promise.all(uploadPromises);
      
      // Reload images
      await loadImages();
      
      // Clear selected files
      setSelectedFiles([]);
      
      // Notify parent component
      if (onImagesUpdate) {
        onImagesUpdate();
      }

      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (imageUrl) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await imageService.deleteImage(imageUrl);
      await loadImages();
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }

      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.name}-image.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image.');
    }
  };

  if (!item) {
    return (
      <div className={`p-8 rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
        <div className="text-center">
          <FaImage className={`mx-auto text-4xl mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Select an item to manage its images
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Image Manager
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Managing images for: {item.name} ({item.type})
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.type === 'Place' ? 'bg-emerald-100 text-emerald-800' :
          item.type === 'Hotel' ? 'bg-blue-100 text-blue-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {images.length} images
        </div>
      </div>

      {/* Upload Section */}
      <div className={`mb-6 p-4 rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
        <div className="text-center">
          <FaUpload className={`mx-auto text-3xl mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <FaUpload />
              Select Images
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Selected: {selectedFiles.length} files
              </p>
              <button
                onClick={uploadImages}
                disabled={isLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                {isLoading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Images Grid */}
      {isLoading && images.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="text-3xl animate-spin text-gray-400" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <FaImage className={`mx-auto text-4xl mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            No images found. Upload some images to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
            >
              <div className="aspect-square">
                <SmartImage
                  item={{ ...item, images: [imageUrl] }}
                  imageIndex={0}
                  size="small"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewImage(imageUrl)}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    title="Preview"
                  >
                    <FaEye className="text-sm" />
                  </button>
                  
                  <button
                    onClick={() => downloadImage(imageUrl)}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    title="Download"
                  >
                    <FaDownload className="text-sm" />
                  </button>
                  
                  <button
                    onClick={() => deleteImage(imageUrl)}
                    className="w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600/80 transition-colors"
                    title="Delete"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Primary image indicator */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <FaTimes />
            </button>
            
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}