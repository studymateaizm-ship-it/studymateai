// Supabase Storage Service
import { createClient } from "@supabase/supabase-js";

// Supabase config from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✓ Supabase Storage initialized");
  }
} catch (error) {
  console.warn("⚠ Supabase not configured. File uploads won't be persisted.");
}

export interface UploadProgress {
  uploaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFileToSupabase = async (
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured. Check environment variables.",
      };
    }

    // Create a unique file path
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const filename = `${timestamp}-${randomId}-${file.name}`;
    const storagePath = `materials/${userId}/${filename}`;
    const bucketName = "study-materials";

    console.log(`⏳ Uploading ${file.name} to Supabase Storage...`);

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    console.log(`✓ File uploaded to: ${data.path}`);

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    console.log(`✓ Public URL generated`);

    return {
      success: true,
      url: publicUrl,
      path: storagePath,
    };
  } catch (error) {
    console.error("Supabase upload error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload file to Supabase",
    };
  }
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFileFromSupabase = async (
  storagePath: string
): Promise<UploadResult> => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured",
      };
    }

    const bucketName = "study-materials";

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([storagePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return {
        success: false,
        error: `Delete failed: ${error.message}`,
      };
    }

    console.log(`✓ File deleted: ${storagePath}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Supabase delete error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete file",
    };
  }
};

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabase &&
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== "your_supabase_url" &&
    supabaseAnonKey !== "your_supabase_anon_key"
  );
};
