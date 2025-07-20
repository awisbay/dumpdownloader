import React from 'react';
import { X, AlertTriangle, Download, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  action: 'download' | 'delete';
  showDeleteOption?: boolean;
  onDeleteAfterDownload?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  action,
  showDeleteOption = false,
  onDeleteAfterDownload
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md transform transition-all duration-200 scale-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">
              {action === 'download' ? 'Download File' : 'Delete File'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            {action === 'download' 
              ? 'Are you sure you want to download this file?' 
              : 'Are you sure you want to delete this file? This action cannot be undone.'
            }
          </p>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <p className="text-blue-400 font-medium text-sm truncate">{fileName}</p>
          </div>
        </div>

        {action === 'download' && showDeleteOption && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-300 text-sm mb-3">
              Do you want to delete this file after downloading?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Only
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  if (onDeleteAfterDownload) {
                    setTimeout(onDeleteAfterDownload, 1000);
                  }
                  onClose();
                }}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Download & Delete
              </button>
            </div>
          </div>
        )}

        {action === 'delete' && (
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        )}

        {action === 'download' && !showDeleteOption && (
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};