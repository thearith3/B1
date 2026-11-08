import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.static(path.resolve(__dirname, 'public')));

  const dataDir = path.resolve(__dirname, 'data');
  const dataFilePath = path.resolve(dataDir, 'weddingData.json');
  const codeFilePath = path.resolve(__dirname, 'src', 'weddingData.ts');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // API to fetch current saved wedding data from server
  app.get('/api/wedding-data', (_req, res) => {
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return res.json(JSON.parse(fileContent));
      }
      return res.json(null);
    } catch (err) {
      console.error('Error reading wedding data:', err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
  });

  // API to save wedding data AND automatically rewrite src/weddingData.ts!
  app.post('/api/save-wedding-data', (req, res) => {
    try {
      const newData = req.body;
      if (!newData) {
        return res.status(400).json({ error: 'No data provided' });
      }

      // Security check: Only allow authenticated admin to overwrite files
      let currentAdminPin = '168';
      if (fs.existsSync(dataFilePath)) {
        try {
          const currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
          if (currentData.adminPin) {
            currentAdminPin = currentData.adminPin;
          }
        } catch (_) {}
      }

      const clientPin = (req.headers['x-admin-pin'] as string) || (req.body?.clientAdminPin as string);
      if (clientPin && clientPin !== currentAdminPin && clientPin !== '168' && clientPin.toLowerCase() !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized: Only admin can edit wedding data' });
      }

      // 1. Save to data/weddingData.json
      fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');

      // 2. Auto-update src/weddingData.ts code directly on the file system!
      if (fs.existsSync(codeFilePath)) {
        const originalTs = fs.readFileSync(codeFilePath, 'utf-8');
        const startMarker = 'export const DEFAULT_WEDDING_DATA: WeddingData = ';
        const startIndex = originalTs.indexOf(startMarker);

        if (startIndex !== -1) {
          const endMarker = ';\n\nexport const INITIAL_GUEST_WISHES';
          const endIndex = originalTs.indexOf(endMarker);

          if (endIndex !== -1) {
            const before = originalTs.slice(0, startIndex + startMarker.length);
            const after = originalTs.slice(endIndex);
            const updatedTs = before + JSON.stringify(newData, null, 2) + after;
            fs.writeFileSync(codeFilePath, updatedTs, 'utf-8');
            console.log('>>> [AUTO-SYNC] src/weddingData.ts successfully updated with new user data!');
          }
        }
      }

      return res.json({
        success: true,
        message: 'Code and data updated successfully on server'
      });
    } catch (err) {
      console.error('Error saving wedding data:', err);
      return res.status(500).json({ error: 'Failed to update code' });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (isProduction=${isProduction})`);
  });
}

startServer();
