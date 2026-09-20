const multer = require('multer');

const ALLOWED_MIME_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/heic': '.heic',
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per image
        files: 10,
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES[file.mimetype]) {
            return cb(new Error(`Unsupported image type: ${file.mimetype}`));
        }
        cb(null, true);
    },
});

module.exports = { upload, ALLOWED_MIME_TYPES };
