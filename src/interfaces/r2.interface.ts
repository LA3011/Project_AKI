export interface ImageInfo {
    key: string;
    size: number;
    lastModified: Date;
}

export interface ImageInfoWithUrl extends ImageInfo {
    url?: string;
    exists?: boolean;
}

export interface SignedUrlResult {
    key: string;
    url: string;
}

export interface ListImagesResult {
    images: ImageInfo[];
    continuationToken: string | null;
    total: number;
}

export interface ListImagesWithUrlsResult {
    images: ImageInfoWithUrl[];
    continuationToken: string | null;
    total: number;
}