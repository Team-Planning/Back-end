import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Sube una sola imagen
   * POST /api/upload/image
   */
  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    // Validar tipo de archivo
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo no debe superar los 5MB');
    }

    const result = await this.cloudinaryService.uploadImage(file);

    return {
      mensaje: 'Imagen subida exitosamente',
      imagen: result,
    };
  }

  /**
   * Sube múltiples imágenes (máximo 10)
   * POST /api/upload/images
   */
  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se han proporcionado archivos');
    }

    // Validar cada archivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException(`El archivo ${file.originalname} debe ser una imagen`);
      }
      if (file.size > maxSize) {
        throw new BadRequestException(`El archivo ${file.originalname} no debe superar los 5MB`);
      }
    }

    const results = await this.cloudinaryService.uploadMultipleImages(files);

    return {
      mensaje: `${results.length} imágenes subidas exitosamente`,
      imagenes: results,
    };
  }

  /**
   * Elimina una imagen por su publicId
   * DELETE /api/upload/:publicId
   */
  @Delete(':publicId(*)')
  @HttpCode(HttpStatus.OK)
  async deleteImage(@Param('publicId') publicId: string) {
    // Decodificar el publicId (viene con / codificadas)
    const decodedPublicId = decodeURIComponent(publicId);

    const success = await this.cloudinaryService.deleteImage(decodedPublicId);

    if (!success) {
      throw new BadRequestException('No se pudo eliminar la imagen');
    }

    return {
      mensaje: 'Imagen eliminada exitosamente',
      publicId: decodedPublicId,
    };
  }
}
