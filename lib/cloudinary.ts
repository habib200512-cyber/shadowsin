import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadMedia(
  file: string,
  folder = "shadowsin",
  resourceType: "image" | "video" | "raw" = "image"
) {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: resourceType,
    ...(resourceType === "image" && {
      transformation: [{ quality: "auto", fetch_format: "auto" }, { width: 1200, crop: "limit" }],
    }),
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    duration: result.duration,
    type: resourceType === "raw" ? "audio" : resourceType,
  };
}
