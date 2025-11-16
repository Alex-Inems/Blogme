'use client';

/**
 * Upload an image to Cloudinary
 * @param file - The image file to upload
 * @param folder - The folder path in Cloudinary (e.g., 'images', 'profileImages')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise resolving to the uploaded image URL
 */
export const uploadImage = async (
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const progress = Math.round((e.loaded / e.total) * 100);
                onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.secure_url) {
                        resolve(response.secure_url);
                    } else {
                        reject(new Error('Upload succeeded but no URL returned'));
                    }
                } catch (parseError) {
                    reject(new Error('Failed to parse upload response'));
                }
            } else {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(errorResponse.error?.message || `Upload failed with status ${xhr.status}`));
                } catch {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('Upload aborted'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
    });
};

/**
 * Upload a video to Cloudinary
 * @param file - The video file to upload
 * @param folder - The folder path in Cloudinary (e.g., 'videos')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise resolving to the uploaded video URL
 */
export const uploadVideo = async (
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
        throw new Error('File must be a video');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    formData.append('folder', folder);
    formData.append('resource_type', 'video');

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const progress = Math.round((e.loaded / e.total) * 100);
                onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.secure_url) {
                        resolve(response.secure_url);
                    } else {
                        reject(new Error('Upload succeeded but no URL returned'));
                    }
                } catch (parseError) {
                    reject(new Error('Failed to parse upload response'));
                }
            } else {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(errorResponse.error?.message || `Upload failed with status ${xhr.status}`));
                } catch {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('Upload aborted'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(formData);
    });
};

