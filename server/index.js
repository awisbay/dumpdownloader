import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure your VPS file paths here
const FILE_PATHS = {
  'rbs-modump-sunset': '/home/ftpwisbay/log/rbsdump',
  'rnc-modump-sunset': '/home/ftpwisbay/log/ModumpRNC',
  'migration-modump': '/home/ftpwisbay/log/migration',
  'allip-bsc': '/home/ftpwisbay/log/bscallip',
  'lte-to-utran': '/home/ftpwisbay/log/L2U'
};

// Helper function to get file stats
async function getFileInfo(filePath, fileName) {
  try {
    const stats = await fs.stat(filePath);
    return {
      name: fileName,
      size: formatFileSize(stats.size),
      dateCreated: stats.birthtime.toISOString().replace('T', ' ').substring(0, 19),
      path: filePath
    };
  } catch (error) {
    console.error(`Error getting file info for ${fileName}:`, error);
    return null;
  }
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// GET /api/files - List files in a directory
app.get('/api/files', async (req, res) => {
  try {
    const { category = 'rbs-modump-sunset' } = req.query;
    const directoryPath = FILE_PATHS[category];
    
    if (!directoryPath) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Check if directory exists
    try {
      await fs.access(directoryPath);
    } catch (error) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    // Read directory contents
    const files = await fs.readdir(directoryPath);
    
    // Filter for specific file types if needed (e.g., .zip files)
    const filteredFiles = files.filter(file => 
      file.toLowerCase().endsWith('.zip') || 
      file.toLowerCase().endsWith('.tar') ||
      file.toLowerCase().endsWith('.gz')
    );

    // Get file information for each file
    const fileInfoPromises = filteredFiles.map(async (fileName) => {
      const filePath = path.join(directoryPath, fileName);
      return await getFileInfo(filePath, fileName);
    });

    const filesWithInfo = await Promise.all(fileInfoPromises);
    const validFiles = filesWithInfo.filter(file => file !== null);

    // Sort by date (newest first)
    validFiles.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

    res.json(validFiles);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/download - Download a file
app.get('/api/download', async (req, res) => {
  try {
    const { file: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Security check: ensure the file path is within allowed directories
    const isValidPath = Object.values(FILE_PATHS).some(allowedPath => 
      filePath.startsWith(allowedPath)
    );

    if (!isValidPath) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file name from path
    const fileName = path.basename(filePath);
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = await fs.readFile(filePath);
    res.send(fileStream);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/files - Delete a file
app.delete('/api/files', async (req, res) => {
  try {
    const { file: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Security check: ensure the file path is within allowed directories
    const isValidPath = Object.values(FILE_PATHS).some(allowedPath => 
      filePath.startsWith(allowedPath)
    );

    if (!isValidPath) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    await fs.unlink(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`File server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  /api/files?category=<category>  - List files`);
  console.log(`  GET  /api/download?file=<filepath>   - Download file`);
  console.log(`  DELETE /api/files?file=<filepath>    - Delete file`);
  console.log(`  GET  /api/health                     - Health check`);
});
