import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper function to get Cloudinary URL
export function getCloudinaryUrl(publicId: string, options: any = {}) {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  }
  
  return cloudinary.url(publicId, defaultOptions)
}

// Helper function to upload image
export async function uploadImage(filePath: string, folder: string = 'ricardo-trotti-art') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    })
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

// Helper function to get optimized image URL
export function getOptimizedImageUrl(publicId: string, width: number, height: number) {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  })
}


