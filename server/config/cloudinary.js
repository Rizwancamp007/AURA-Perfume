import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aura_perfumes',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'glb', 'gltf'],
    resource_type: 'auto', // Detects images, video, raw files
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
export default cloudinary;
