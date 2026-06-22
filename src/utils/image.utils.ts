export const IMAGE_CONFIG = {
  maxSizeMB: 5,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'] as const,
  defaultWidth: 400,
  defaultHeight: 400,
  defaultQuality: 80,
  defaultFormat: 'webp' as 'jpeg' | 'png' | 'webp'
};

export type AllowedMimeType = typeof IMAGE_CONFIG.allowedMimes[number];

export const isAllowedMimeType = (mimetype: string): mimetype is AllowedMimeType => {
  return IMAGE_CONFIG.allowedMimes.includes(mimetype as AllowedMimeType);
};

export interface ImageValidationResult {
  valid: boolean;
  error?: {
    status: number;
    message: string;
  };
}

export const validateImage = (file: Express.Multer.File): ImageValidationResult => {
  if (!file) {
    return {
      valid: false,
      error: {
        status: 400,
        message: 'No se ha proporcionado ninguna imagen'
      }
    };
  }

  if (!isAllowedMimeType(file.mimetype)) {
    return {
      valid: false,
      error: {
        status: 415,
        message: `Formato de imagen no permitido. Solo se aceptan: ${IMAGE_CONFIG.allowedMimes.map(m => m.replace('image/', '').toUpperCase()).join(', ')}`
      }
    };
  }

  if (file.size > IMAGE_CONFIG.maxSizeBytes) {
    return {
      valid: false,
      error: {
        status: 413,
        message: `La imagen no puede exceder los ${IMAGE_CONFIG.maxSizeMB}MB (tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
      }
    };
  }

  return { valid: true };
};

export const validateImageOrThrow = (file: Express.Multer.File): void => {
  const result = validateImage(file);
  
  if (!result.valid && result.error) {
    const error: any = new Error(result.error.message);
    error.status = result.error.status;
    throw error;
  }
};

export const getImageExtension = (mimetype: string): string => {
  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };
  
  return extensionMap[mimetype] || 'webp';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};