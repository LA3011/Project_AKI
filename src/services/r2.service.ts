import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '../config/r2.config.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import type { ImageInfo, ImageInfoWithUrl, ListImagesResult, ListImagesWithUrlsResult } from '../interfaces/r2.interface.js';

export class R2Service {

    // Sube una imagen a R2 con optimización (automática)
    static async uploadImage(
        fileBuffer: Buffer,
        originalName: string,
        folder: string = 'profiles',
        options?: {
            width?: number;
            height?: number;
            quality?: number;
            format?: 'jpeg' | 'png' | 'webp';
        }
    ): Promise<{ key: string }> {
        try {
            // Optimizar la imagen
            const optimizedBuffer = await this.optimizeImage(fileBuffer, options);

            // Generar nombre único
            const extension = options?.format || 'webp';
            const fileName = `${uuidv4()}.${extension}`;
            const key = `${folder}/${fileName}`;

            // 3. Subir (R2)
            await r2Client.send(
                new PutObjectCommand({
                    Bucket: R2_BUCKET,
                    Key: key,
                    Body: optimizedBuffer,
                    ContentType: `image/${extension}`,
                    CacheControl: 'public, max-age=31536000', // Cache por 1 año
                })
            );

            // Generar URL pública
            const url = R2_PUBLIC_URL
                ? `${R2_PUBLIC_URL}/${key}`
                : `${process.env.R2_ENDPOINT}/${R2_BUCKET}/${key}`;

            return { key };

        } catch (error) {
            console.error('[R2Service] Error subiendo imagen:', error);
            throw new Error('Fallo al "subir" la Imagen a R2');
        }
    }

    // Generar URL firmada para una imagen
    static async getSignedUrl(
        key: string,
        expiresInSeconds: number = 3600
    ): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: R2_BUCKET,
                Key: key,
            });

            const signedUrl = await getSignedUrl(r2Client, command, {
                expiresIn: expiresInSeconds,
            });

            return signedUrl;
        } catch (error) {
            console.error('[R2Service] Error generando URL firmada:', error);
            throw new Error('Fallo al generar URL firmada');
        }
    }

    // Generar URLs firmadas para múltiples imágenes (Batch)
    static async getSignedUrls(
        keys: string[],
        expiresInSeconds: number = 3600
    ): Promise<{ key: string; url: string }[]> {
        try {
            const results = await Promise.all(
                keys.map(async (key) => {
                    try {
                        const url = await this.getSignedUrl(key, expiresInSeconds);
                        return { key, url };
                    } catch (error) {
                        console.error(`[R2Service] Error generando URL para ${key}:`, error);
                        return { key, url: '' };
                    }
                })
            );
            return results;
        } catch (error) {
            console.error('[R2Service] Error generando URLs firmadas:', error);
            throw new Error('Fallo al generar URLs firmadas');
        }
    }

    // Elimina una imagen de R2
    static async deleteImage(key: string): Promise<void> {
        try {
            await r2Client.send(
                new DeleteObjectCommand({
                    Bucket: R2_BUCKET,
                    Key: key,
                })
            );
        } catch (error) {
            console.error('[R2Service] Error deleting image:', error);
            throw new Error('Fallo al "eliminar" la Imagen a R2');
        }
    }

    // Optimiza la imagen (redimensiona, comprime, convierte formato)
    private static async optimizeImage(
        buffer: Buffer,
        options?: {
            width?: number;
            height?: number;
            quality?: number;
            format?: 'jpeg' | 'png' | 'webp';
        }
    ): Promise<Buffer> {
        const width = options?.width || 500; // Tamaño por defecto para perfiles
        const height = options?.height || 500;
        const quality = options?.quality || 80;
        const format = options?.format || 'webp';

        let sharpInstance = sharp(buffer);

        // Redimensionar manteniendo aspecto y recortando al centro
        sharpInstance = sharpInstance.resize(width, height, {
            fit: 'cover',
            position: 'center',
        });

        // Convertir y comprimir
        switch (format) {
            case 'jpeg':
                sharpInstance = sharpInstance.jpeg({ quality });
                break;
            case 'png':
                sharpInstance = sharpInstance.png({ quality });
                break;
            case 'webp':
            default:
                sharpInstance = sharpInstance.webp({ quality });
                break;
        }

        return await sharpInstance.toBuffer();
    }

    // Convierte un stream a buffer (para procesar archivos grandes)
    static async streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

    // Verifica si una imagen existe en R2
    static async imageExists(key: string): Promise<boolean> {
        try {
            if (!key || key.trim() === '') {
                return false;
            }

            const command = new HeadObjectCommand({
                Bucket: R2_BUCKET,
                Key: key,
            });
            await r2Client.send(command);
            return true;

        } catch (error: any) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                return false;
            }
            console.error('[R2Service] Error verificando existencia:', key, error);
            return false;
        }
    }

    // Lista imágenes en una carpeta específica
    static async listImagesByFolder(
        folder: string = '',
        options?: {
            maxKeys?: number;
            continuationToken?: string;
        }
    ): Promise<{
        images: ImageInfo[];
        continuationToken: string | null;
        total: number;
    }> {
        try {
            const prefix = folder ? `${folder}/` : '';

            const command = new ListObjectsV2Command({
                Bucket: R2_BUCKET,
                Prefix: prefix,
                MaxKeys: options?.maxKeys || 100,
                ContinuationToken: options?.continuationToken,
            });

            const response = await r2Client.send(command);

            const images: ImageInfo[] = (response.Contents || [])
                .filter(obj => obj.Key && !obj.Key.endsWith('/'))
                .map(obj => ({
                    key: obj.Key!,
                    size: obj.Size || 0,
                    lastModified: obj.LastModified || new Date(),
                }));

            return {
                images,
                continuationToken: response.NextContinuationToken || null,
                total: images.length,
            };

        } catch (error) {
            console.error('[R2Service] Error listando imágenes:', error);
            throw new Error('Fallo al listar las imágenes');
        }
    }

    // Lista imágenes con URLs firmadas (opcional)
    static async listImagesWithSignedUrls(
        folder: string = '',
        options?: {
            maxKeys?: number;
            continuationToken?: string;
            includeUrls?: boolean;
        }
    ): Promise<{
        images: any[];
        continuationToken: string | null;
        total: number;
    }> {
        // ✅ Construir opciones de forma segura
        const listOptions: { maxKeys?: number; continuationToken?: string } = {};

        if (options?.maxKeys !== undefined && options.maxKeys > 0) {
            listOptions.maxKeys = options.maxKeys;
        }

        // ✅ Solo pasar continuationToken si existe
        if (options?.continuationToken !== undefined && options.continuationToken.trim() !== '') {
            listOptions.continuationToken = options.continuationToken;
        }

        const result = await this.listImagesByFolder(folder, listOptions);

        // Si no se requieren URLs firmadas
        if (!options?.includeUrls) {
            return {
                images: result.images,
                continuationToken: result.continuationToken,
                total: result.total,
            };
        }

        // Si no hay imágenes
        if (result.images.length === 0) {
            return {
                images: [],
                continuationToken: result.continuationToken,
                total: 0,
            };
        }

        // Obtener URLs firmadas
        const keys = result.images.map(img => img.key);
        const urls = await this.getSignedUrls(keys, 3600);

        // Crear mapa de URLs
        const urlMap = new Map<string, string>();
        urls.forEach(item => {
            if (item.url) {
                urlMap.set(item.key, item.url);
            }
        });

        // Construir imágenes con URLs
        const imagesWithUrls = result.images.map((img) => {
            const url = urlMap.get(img.key);
            const image: any = {
                key: img.key,
                size: img.size,
                lastModified: img.lastModified,
            };

            if (url) {
                image.url = url;
                image.exists = true;
            }

            return image;
        });

        return {
            images: imagesWithUrls,
            continuationToken: result.continuationToken,
            total: result.total,
        };
    }
}