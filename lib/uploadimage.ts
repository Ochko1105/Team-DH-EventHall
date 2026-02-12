import cloudinary from "./config/cloudinary";

export async function uploadImageToCloudinary(base64: string) {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: "event_halls",
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
}
