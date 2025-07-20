import React, { useState, useEffect } from 'react';
import { RefreshCw, Server } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { FileTable } from './components/FileTable';
import { ConfirmationModal } from './components/ConfirmationModal';
import { FileService } from './services/fileService';
import { FileItem } from './types/file';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('rbs-modump-sunset');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    file: FileItem | null;
    action: 'download' | 'delete';
  }>({
    isOpen: false,
    file: null,
    action: 'download'
  });

  const loadFiles = async () => {
    setLoading(true);
    try {
      const fileList = await FileService.getFiles(selectedCategory);
      setFiles(fileList);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fileList = await FileService.refreshFiles(selectedCategory);
      setFiles(fileList);
    } catch (error) {
      console.error('Failed to refresh files:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownload = (file: FileItem) => {
    setModalState({
      isOpen: true,
      file,
      action: 'download'
    });
  };

  const handleDelete = (file: FileItem) => {
    setModalState({
      isOpen: true,
      file,
      action: 'delete'
    });
  };

  const confirmDownload = async () => {
    if (modalState.file) {
      await FileService.downloadFile(modalState.file);
    }
  };

  const confirmDelete = async () => {
    if (modalState.file) {
      await FileService.deleteFile(modalState.file);
      // Remove the file from the local state
      setFiles(prev => prev.filter(f => f.name !== modalState.file!.name));
    }
  };

  const handleDeleteAfterDownload = async () => {
    if (modalState.file) {
      await FileService.deleteFile(modalState.file);
      setFiles(prev => prev.filter(f => f.name !== modalState.file!.name));
    }
  };

  useEffect(() => {
    loadFiles();
  }, [selectedCategory]);

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      'rbs-modump-sunset': 'RBS Modump Sunset',
      'rnc-modump-sunset': 'RNC Modump Sunset',
      'migration-modump': 'Migration Modump',
      'allip-bsc': 'Allip BSC'
    };
    return titles[category] || 'File Manager';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
      <div className="flex">
        <Sidebar 
          selectedItem={selectedCategory} 
          onItemSelect={setSelectedCategory} 
        />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center mb-2">
                    <Server className="h-8 w-8 mr-3 text-blue-500" />
                    {getCategoryTitle(selectedCategory)}
                  </h1>
                  <p className="text-gray-400">
                    Manage and download files from your VPS server
                  </p>
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Folder
                </button>
              </div>
            </div>

            <FileTable
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, file: null, action: 'download' })}
        onConfirm={modalState.action === 'download' ? confirmDownload : confirmDelete}
        fileName={modalState.file?.name || ''}
        action={modalState.action}
        showDeleteOption={modalState.action === 'download'}
        onDeleteAfterDownload={handleDeleteAfterDownload}
      />
    </div>
  );
}

export default App;