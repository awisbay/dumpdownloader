// Production configuration for file service
// Copy this to replace the API_CONFIG in src/services/fileService.ts

const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'http://your-vps-ip-or-domain.com'  // Replace with your actual domain/IP
    : 'http://localhost:3001',
  endpoints: {
    files: '/api/files',
    download: '/api/download',
    delete: '/api/files',
    health: '/api/health'
  }
};

// Alternative: Always use relative URLs in production
// const API_CONFIG = {
//   baseUrl: '',  // Use relative URLs - nginx will proxy
//   endpoints: {
//     files: '/api/files',
//     download: '/api/download',
//     delete: '/api/files',
//     health: '/api/health'
//   }
// };
