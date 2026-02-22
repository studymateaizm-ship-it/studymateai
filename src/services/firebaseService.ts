// Firebase Storage Service
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: any;
let storage: any;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  console.log("✓ Firebase Storage initialized");
} catch (error) {
  console.warn("⚠ Firebase not configured. Set environment variables for file uploads.");
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
 * Upload a file to Firebase Storage
 */
export const uploadFileToFirebase = async (
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    if (!storage) {
      return {
        success: false,
        error: "Firebase Storage not configured. Check environment variables.",
      };
    }

    // Create a unique file path
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const filename = `${timestamp}-${randomId}-${file.name}`;
    const storagePath = `materials/${userId}/${filename}`;

    console.log(`⏳ Uploading ${file.name} to Firebase Storage...`);

    // Create storage reference
    const fileRef = ref(storage, storagePath);

    // Upload file with metadata
    const metadata = {
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size.toString(),
        fileType: file.type,
      },
    };

    const snapshot = await uploadBytes(fileRef, file, metadata);

    console.log(`✓ File uploaded to: ${snapshot.ref.fullPath}`);

    // Get download URL
    const downloadUrl = await getDownloadURL(fileRef);

    console.log(`✓ Download URL generated`);

    return {
      success: true,
      url: downloadUrl,
      path: storagePath,
    };
  } catch (error) {
    console.error("Firebase upload error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload file to Firebase",
    };
  }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFileFromFirebase = async (
  storagePath: string
): Promise<UploadResult> => {
  try {
    if (!storage) {
      return {
        success: false,
        error: "Firebase Storage not configured",
      };
    }

    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);

    console.log(`✓ File deleted: ${storagePath}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Firebase delete error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete file",
    };
  }
};

/**
 * Check if Firebase is configured
 */
export const isFirebaseConfigured = (): boolean => {
  return (
    !!storage &&
    !!firebaseConfig.apiKey &&
    !!firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "your_firebase_api_key" &&
    firebaseConfig.projectId !== "your_firebase_project_id"
  );
};
