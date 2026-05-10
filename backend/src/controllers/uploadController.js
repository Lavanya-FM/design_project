// const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_BASE_DIR = path.join(__dirname, '../../uploads');

// Ensure target directories exist
const ensureDirectories = () => {
    ['designs', 'fabrics', 'profiles'].forEach(folder => {
        const dir = path.join(UPLOADS_BASE_DIR, folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

ensureDirectories();

const optimizeAndSaveImage = async (buffer, folder) => {
    // Validate folder
    const validFolders = ['designs', 'fabrics', 'profiles'];
    const targetFolder = validFolders.includes(folder) ? folder : 'designs';

    const id = uuidv4();
    const filename = `${id}.webp`;
    const thumbFilename = `${id}_thumb.webp`;
    
    const filepath = path.join(UPLOADS_BASE_DIR, targetFolder, filename);
    const thumbPath = path.join(UPLOADS_BASE_DIR, targetFolder, thumbFilename);

    // MOCK SAVE for Demo (Avoid sharp dependency)
    fs.writeFileSync(filepath, buffer);
    fs.writeFileSync(thumbPath, buffer);

    return {
        url: `/uploads/${targetFolder}/${filename}`,
        thumbnail: `/uploads/${targetFolder}/${thumbFilename}`
    };
};

exports.uploadSingle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const folder = req.body.folder || 'designs';
        const result = await optimizeAndSaveImage(req.file.buffer, folder);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: 'Failed to process image' });
    }
};

exports.uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No image files provided' });
        }

        const folder = req.body.folder || 'designs';
        
        const urls = await Promise.all(
            req.files.map(file => optimizeAndSaveImage(file.buffer, folder))
        );

        res.json({ success: true, urls });
    } catch (err) {
        console.error("Multiple upload error:", err);
        res.status(500).json({ error: 'Failed to process images' });
    }
};
