import { FileItem } from '../types/file';

// API Configuration - automatically detects environment
const API_CONFIG = {
  baseUrl: import.meta.env.PROD 
    ? '' // Use relative URLs in production (nginx will proxy)
    : 'http://localhost:3001', // Local development
  endpoints: {
    files: '/api/files',
    download: '/api/download',
    delete: '/api/files',
    health: '/api/health'
  }
};

export class FileService {
  static async getFiles(category: string = 'rbs-modump-sunset'): Promise<FileItem[]> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.files}?category=${category}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching files:', error);
      // Fallback to mock data if API is not available
      console.warn('Falling back to mock data');
      return this.getMockFiles();
    }
  }

  static async downloadFile(file: FileItem): Promise<void> {
    try {
      const downloadUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.download}?file=${encodeURIComponent(file.path)}`;
      
      // Open download in new window/tab
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloading file: ${file.name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  static async deleteFile(file: FileItem): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.delete}?file=${encodeURIComponent(file.path)}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`Deleted file: ${file.name}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  static async refreshFiles(category: string = 'rbs-modump-sunset'): Promise<FileItem[]> {
    // Force a fresh fetch from the server
    return this.getFiles(category);
  }

  // Fallback mock data for when API is not available
  private static getMockFiles(): FileItem[] {
    return [
      {
        name: 'DUMP_RBS_SUNSET_20250718_080935.zip',
        size: '5.86 MB',
        dateCreated: '2025-07-18 14:12:22',
        path: '/dumps/rbs/DUMP_RBS_SUNSET_20250718_080935.zip'
      },
      {
        name: 'DUMP_RBS_SUNSET_20250716_083002.zip',
        size: '55.54 MB',
        dateCreated: '2025-07-16 14:51:23',
        path: '/dumps/rbs/DUMP_RBS_SUNSET_20250716_083002.zip'
      },
      {
        name: 'DUMP_RBS_SUNSET_20250718_063001.zip',
        size: '79.67 MB',
        dateCreated: '2025-07-18 12:46:55',
        path: '/dumps/rbs/DUMP_RBS_SUNSET_20250718_063001.zip'
      }
    ];
  }

  // Check if API server is available
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}