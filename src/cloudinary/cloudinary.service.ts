import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  private readonly folder: string;

  constructor(private configService: ConfigService) {
    this.folder = this.configService.get<string>('cloudinary.folder') || 'pulgashop/publicaciones';
  }

  /**
   * Sube una imagen a Cloudinary desde un buffer
   */
  async uploadImage(
    file: Express.Multer.File,
    customFolder?: string,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadFolder = customFolder || this.folder;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: uploadFolder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new BadRequestException(`Error al subir imagen: ${error.message}`));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Sube múltiples imágenes a Cloudinary
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    customFolder?: string,
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, customFolder));
    return Promise.all(uploadPromises);
  }

  /**
   * Elimina una imagen de Cloudinary por su public_id
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new BadRequestException(`Error al eliminar imagen: ${error.message}`);
    }
  }

  /**
   * Elimina múltiples imágenes de Cloudinary
   */
  async deleteMultipleImages(publicIds: string[]): Promise<{ deleted: string[]; errors: string[] }> {
    const results = await Promise.allSettled(
      publicIds.map((publicId) => this.deleteImage(publicId)),
    );

    const deleted: string[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        deleted.push(publicIds[index]);
      } else {
        errors.push(publicIds[index]);
      }
    });

    return { deleted, errors };
  }

  /**
   * Obtiene información de una imagen por su public_id
   */
  async getImageInfo(publicId: string) {
    try {
      return await cloudinary.api.resource(publicId);
    } catch (error) {
      throw new BadRequestException(`Error al obtener información de imagen: ${error.message}`);
    }
  }

  /**
   * Genera una URL optimizada con transformaciones
   */
  getOptimizedUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width: options?.width, height: options?.height, crop: options?.crop || 'fill' },
        { quality: options?.quality || 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });
  }

  /**
   * Genera múltiples versiones de una imagen (thumbnails)
   */
  getThumbnailUrls(publicId: string): {
    small: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      small: this.getOptimizedUrl(publicId, { width: 150, height: 150 }),
      medium: this.getOptimizedUrl(publicId, { width: 400, height: 400 }),
      large: this.getOptimizedUrl(publicId, { width: 800, height: 800 }),
      original: cloudinary.url(publicId),
    };
  }
}
