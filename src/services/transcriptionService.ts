// Transcription Service using AssemblyAI
// Free tier: 600 minutes/month

export interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  status?: string;
  error?: string;
}

const ASSEMBLYAI_API_KEY = import.meta.env.VITE_ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_API_URL = "https://api.assemblyai.com/v2";

// Transcribe YouTube video by URL
export const transcribeYouTubeVideo = async (
  youtubeUrl: string
): Promise<TranscriptionResponse> => {
  if (!ASSEMBLYAI_API_KEY) {
    return {
      success: false,
      error:
        "AssemblyAI API key not configured. Set VITE_ASSEMBLYAI_API_KEY in .env.local",
    };
  }

  try {
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      return {
        success: false,
        error: "Invalid YouTube URL. Please use a valid YouTube link.",
      };
    }

    console.log(`⏳ Starting YouTube transcription for video: ${videoId}`);

    // Submit transcription request with audio_url for YouTube
    const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const submitResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: audioUrl,
      }),
    });

    if (!submitResponse.ok) {
      throw new Error(`Failed to submit transcription: ${submitResponse.status}`);
    }

    const transcript = await submitResponse.json();
    const transcriptId = transcript.id;

    console.log(`📝 Transcription submitted with ID: ${transcriptId}`);

    // Poll for completion
    return await pollTranscriptionStatus(transcriptId);
  } catch (error) {
    console.error("YouTube transcription error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to transcribe YouTube video",
    };
  }
};

// Transcribe uploaded video file
export const transcribeVideoFile = async (
  file: File
): Promise<TranscriptionResponse> => {
  if (!ASSEMBLYAI_API_KEY) {
    return {
      success: false,
      error:
        "AssemblyAI API key not configured. Set VITE_ASSEMBLYAI_API_KEY in .env.local",
    };
  }

  try {
    console.log(`⏳ Uploading video file: ${file.name}`);

    // Step 1: Upload file to AssemblyAI
    const uploadResponse = await fetch(`${ASSEMBLYAI_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`File upload failed: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    const uploadUrl = uploadData.upload_url;

    console.log(`✓ File uploaded. Starting transcription...`);

    // Step 2: Submit transcription request
    const submitResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
      }),
    });

    if (!submitResponse.ok) {
      throw new Error(`Transcription request failed: ${submitResponse.status}`);
    }

    const transcript = await submitResponse.json();
    const transcriptId = transcript.id;

    console.log(`📝 Transcription submitted with ID: ${transcriptId}`);

    // Step 3: Poll for completion
    return await pollTranscriptionStatus(transcriptId);
  } catch (error) {
    console.error("Video transcription error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to transcribe video",
    };
  }
};

// Poll transcription status until complete
const pollTranscriptionStatus = async (
  transcriptId: string,
  maxWaitTime: number = 600000 // 10 minutes max
): Promise<TranscriptionResponse> => {
  const startTime = Date.now();
  const pollInterval = 3000; // Poll every 3 seconds

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch(
        `${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`,
        {
          headers: {
            Authorization: ASSEMBLYAI_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "completed") {
        console.log(`✓ Transcription completed successfully`);
        return {
          success: true,
          transcription: data.text,
          status: "completed",
        };
      } else if (data.status === "error") {
        console.error(`Transcription error: ${data.error}`);
        return {
          success: false,
          error: data.error || "Transcription failed",
          status: "error",
        };
      } else {
        console.log(`⏳ Transcription status: ${data.status}`);
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error("Poll error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Polling failed",
      };
    }
  }

  return {
    success: false,
    error: "Transcription timed out. Please try again.",
  };
};

// Extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};
