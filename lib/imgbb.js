import axios from "axios";

export const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Returns an error message, or null when the file is acceptable.
export function validateImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) return "Choose a JPG, PNG, WebP or GIF image.";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 5 MB or smaller.";
  return null;
}

export async function uploadToImgbb(file) {
  if (!IMGBB_KEY) throw new Error("Image upload is not configured. Paste an image URL instead.");
  const form = new FormData();
  form.append("image", file);
  try {
    const { data } = await axios.post("https://api.imgbb.com/1/upload", form, { params: { key: IMGBB_KEY } });
    return data.data.url;
  } catch {
    throw new Error("Image upload failed. Try again or paste an image URL.");
  }
}
