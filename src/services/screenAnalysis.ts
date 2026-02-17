// Screen Analysis & Highlighting Utilities

export interface HighlightRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  confidence: number;
}

/**
 * Analyzes screen content to identify text regions
 * This is a simplified version - in production, you'd use OCR or vision API
 */
export const analyzeScreenContent = async (
  imageData: string
): Promise<HighlightRegion[]> => {
  // In a real implementation, you would:
  // 1. Send image to Google Vision API or OCR service
  // 2. Get bounding boxes for detected text/objects
  // 3. Return regions to highlight
  
  // For now, return empty (client can add manual highlighting)
  return [];
};

/**
 * Highlights specific regions on a canvas
 */
export const drawHighlights = (
  canvas: HTMLCanvasElement,
  highlights: HighlightRegion[],
  imageData: HTMLImageElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Draw original image
  ctx.drawImage(imageData, 0, 0);

  // Draw highlights
  highlights.forEach((region) => {
    // Highlight box
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.lineWidth = 3;
    ctx.strokeRect(region.x, region.y, region.width, region.height);

    // Label
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(region.x, region.y - 25, region.width, 25);
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(`${Math.round(region.confidence * 100)}%`, region.x + 5, region.y - 8);
  });
};

/**
 * Extracts text from highlighted regions
 */
export const extractHighlightedText = (
  highlights: HighlightRegion[]
): string => {
  return highlights.map((h) => h.text).join(" ");
};

/**
 * Generates highlight boxes based on AI analysis
 * Maps answer positions to screen coordinates
 */
export const generateHighlightBoxes = (
  answer: string,
  screenWidth: number,
  screenHeight: number
): HighlightRegion[] => {
  // This would typically integrate with vision API results
  // For now, return empty array
  return [];
};

/**
 * Colors for different highlight types
 */
export const HIGHLIGHT_COLORS = {
  answer: "#22c55e",    // Green
  question: "#3b82f6",  // Blue
  important: "#f59e0b", // Amber
  definition: "#8b5cf6", // Purple
};

/**
 * Converts screen coordinates to canvas coordinates
 */
export const normalizeCoordinates = (
  x: number,
  y: number,
  screenWidth: number,
  screenHeight: number,
  canvasWidth: number,
  canvasHeight: number
): [number, number] => {
  const scaleX = canvasWidth / screenWidth;
  const scaleY = canvasHeight / screenHeight;
  return [x * scaleX, y * scaleY];
};
