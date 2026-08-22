import streamifier from 'streamifier';
import { cloudinary } from '../config/cloudinary.js';
import { isCloudinaryConfigured } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface UploadedAsset {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resourceType: 'image' | 'video' | 'raw';
}

export function uploadBufferToCloudinary(buffer: Buffer, folder = 'spydev'): Promise<UploadedAsset> {
  if (!isCloudinaryConfigured) {
    throw ApiError.internal(
      'Media storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server/.env.'
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        // Compression pipeline: re-encode to the best format/quality for the
        // pixel content (q_auto), and cap the stored original at a sane max
        // dimension (crop:'limit' only ever shrinks, never upscales or
        // crops content) so a visitor never downloads a multi-megabyte
        // camera-original for what renders as a few-hundred-pixel-wide card.
        quality: 'auto:good',
        fetch_format: 'auto',
        transformation: [{ width: 2560, height: 2560, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          resourceType: (result.resource_type as UploadedAsset['resourceType']) ?? 'image',
        });
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId);
}
