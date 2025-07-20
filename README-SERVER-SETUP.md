# Project Downloader - Real Server Setup

This project now supports connecting to **real files** instead of hardcoded mock data! 🎉

## Quick Setup

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Configure Your File Paths
Edit `server/index.js` and update the `FILE_PATHS` object with your actual server paths:

```javascript
const FILE_PATHS = {
  'rbs-modump-sunset': '/home/user/dumps/rbs-modump-sunset',     // Your actual path
  'rnc-modump-sunset': '/home/user/dumps/rnc-modump-sunset',     // Your actual path
  'migration-modump': '/home/user/dumps/migration-modump',       // Your actual path
  'allip-bsc': '/home/user/dumps/allip-bsc'                     // Your actual path
};
```

### 3. Start the API Server
```bash
cd server
npm start
```

The API server will run on `http://localhost:3001`

### 4. Start Your React App
In another terminal:
```bash
npm run dev
```

Your React app will run on `http://localhost:5173` and connect to the real API!

## API Endpoints

- **GET** `/api/files?category=<category>` - List files in directory
- **GET** `/api/download?file=<filepath>` - Download a file
- **DELETE** `/api/files?file=<filepath>` - Delete a file
- **GET** `/api/health` - Health check

## Features

✅ **Real File Listing** - Lists actual files from your server directories  
✅ **File Downloads** - Direct download from your server  
✅ **File Deletion** - Remove files from your server  
✅ **Automatic Fallback** - Falls back to mock data if server is unavailable  
✅ **Security** - Path validation to prevent unauthorized access  
✅ **File Type Filtering** - Only shows .zip, .tar, .gz files  

## File Structure
```
projectdownloader/
├── src/                    # React frontend
│   ├── services/
│   │   └── fileService.ts  # Updated to use real API
│   └── ...
├── server/                 # New API server
│   ├── package.json
│   └── index.js           # Express server
└── setup.sh              # Quick setup script
```

## Development vs Production

### Development (Current)
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Production
Update the `baseUrl` in `src/services/fileService.ts`:
```typescript
const API_CONFIG = {
  baseUrl: 'http://your-vps-ip:3001', // Your server IP
  // ...
};
```

## Troubleshooting

**Files not loading?**
- Check if the API server is running (`npm start` in `/server`)
- Verify your file paths in `server/index.js`
- Check browser console for errors
- Visit `http://localhost:3001/api/health` to test the API

**Downloads not working?**
- Ensure the file paths are correct
- Check file permissions on your server
- Verify the files exist in the specified directories

**Access denied errors?**
- The API includes security checks - files must be in allowed directories
- Update `FILE_PATHS` in `server/index.js` with your actual paths
