import React from 'react';
import { Download, Trash2, Calendar, HardDrive } from 'lucide-react';
import { FileItem } from '../types/file';

interface FileTableProps {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  loading?: boolean;
}

export const FileTable: React.FC<FileTableProps> = ({
  files,
  onDownload,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Loading files...</span>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
        <div className="text-center text-gray-400">
          <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No files found in the current directory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800/50">
              <th className="text-left py-4 px-6 font-semibold text-gray-200">File Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200">Size</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200">Date Created</th>
              <th className="text-center py-4 px-6 font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr 
                key={`${file.name}-${index}`}
                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mr-3">
                      <HardDrive className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-200 font-medium truncate">{file.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-300">{file.size}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    {file.dateCreated}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onDownload(file)}
                      className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => onDelete(file)}
                      className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};