import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const FileUpload = ({ 
  onFileSelect, 
  accept = {}, 
  maxSize = 10485760, // 10MB
  maxFiles = 1,
  label = 'Fichier',
  helperText = 'Glissez-déposez ou cliquez pour sélectionner',
  error,
  disabled = false 
}) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  });

  const removeFile = (index) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFileSelect(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900">
            {isDragActive ? 'Déposez les fichiers ici...' : helperText}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {maxFiles > 1 ? `Jusqu'à ${maxFiles} fichiers` : 'Un seul fichier'} • Max {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500"
                disabled={disabled}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;