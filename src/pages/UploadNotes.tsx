import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowLeft, Trash2, FileText, Image as ImageIcon, CheckCircle2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useMaterials, type UploadedMaterial } from "@/context/MaterialsContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { useAI } from "@/context/AIContext";
import { analyzeMaterial } from "@/services/aiService";
import { uploadFileToSupabase, deleteFileFromSupabase, isSupabaseConfigured } from "@/services/supabaseService";
import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";

const UploadNotes = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { materials, addMaterial, removeMaterial, updateMaterialAnalysis } = useMaterials();
  const { user } = useUserAuth();
  const { isConfigured } = useAI();
  const [dragActive, setDragActive] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [materialContent, setMaterialContent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const supabaseAvailable = isSupabaseConfigured();

  // Function to analyze material in the background
  const triggerAnalysis = async (materialId: string, content: string) => {
    if (!isConfigured) {
      console.warn("⚠ AI not configured - skipping analysis. Check browser console for setup instructions.");
      updateMaterialAnalysis(materialId, {
        analysisStatus: "failed",
        analysisError: "AI provider not configured. Please set VITE_AI_PROVIDER and API key in environment.",
      });
      return;
    }

    try {
      // Update status to analyzing
      updateMaterialAnalysis(materialId, {
        analysisStatus: "analyzing",
      });

      console.log(`⏳ Starting AI analysis for material: ${materialId}`);

      // Perform analysis
      const analysis = await analyzeMaterial(content, 5);

      if (analysis.error) {
        console.error(`❌ Analysis error for ${materialId}:`, analysis.error);
        updateMaterialAnalysis(materialId, {
          analysisStatus: "failed",
          analysisError: analysis.error,
        });
      } else {
        updateMaterialAnalysis(materialId, {
          ...analysis,
          analysisStatus: "completed",
          analyzedAt: new Date(),
        });
        console.log(`✓ Analysis completed successfully for material: ${materialId}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during analysis";
      console.error(`❌ Exception during analysis for ${materialId}:`, error);
      updateMaterialAnalysis(materialId, {
        analysisStatus: "failed",
        analysisError: errorMessage,
      });
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      let content = "";
      const fileType = file.type;
      const fileName = file.name;

      if (fileType.includes("text") || fileName.endsWith(".txt")) {
        // Text files
        content = await file.text();
      } else if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
        // PDF extraction
        content = await extractPDFContent(file);
      } else if (
        fileType.includes("word") ||
        fileName.endsWith(".docx") ||
        fileName.endsWith(".doc")
      ) {
        // Word document extraction
        content = await extractWordContent(file);
      } else if (
        fileType.includes("spreadsheet") ||
        fileType.includes("sheet") ||
        fileName.endsWith(".xlsx") ||
        fileName.endsWith(".xls") ||
        fileName.endsWith(".csv")
      ) {
        // Excel/CSV extraction
        content = await extractExcelContent(file);
      } else if (fileType.includes("image")) {
        // Image OCR extraction
        content = await extractImageContent(file);
      } else {
        content = `[File: ${fileName}]\nFile size: ${(file.size / 1024 / 1024).toFixed(
          2
        )} MB\n\nUnsupported file type. Please upload PDF, Word, Excel, Image, or TXT files.`;
      }

      let firebaseUrl: string | undefined;
      let storagePath: string | undefined;

      // Upload to Supabase if configured
      if (supabaseAvailable && user?.id) {
        console.log(`☁️ Uploading ${fileName} to Supabase Storage...`);
        const uploadResult = await uploadFileToSupabase(file, user.id);
        
        if (uploadResult.success && uploadResult.url) {
          firebaseUrl = uploadResult.url;
          storagePath = uploadResult.path;
          console.log(`✓ File backed up to Supabase Storage`);
        } else {
          console.warn(`⚠ Supabase upload skipped: ${uploadResult.error}`);
        }
      }

      const newMaterial: UploadedMaterial = {
        id: Date.now().toString(),
        name: fileName,
        content: content,
        type: getParsedFileType(fileName, fileType),
        uploadedAt: new Date(),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        firebaseUrl,
        storagePath,
      };

      addMaterial(newMaterial);
      setSuccessMessage(`✓ "${fileName}" uploaded! Analyzing with AI...`);
      
      // Trigger background analysis
      triggerAnalysis(newMaterial.id, content);
      
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error processing file:", error);
      setSuccessMessage(
        "✗ Error analyzing file. Please try another file."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setIsProcessing(false);
  };

  const extractPDFContent = async (file: File): Promise<string> => {
    try {
      // Set up PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = `PDF: ${file.name}\n\n`;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || "")
          .join("");

        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      return fullText || `PDF file: ${file.name} (No extractable text found)`;
    } catch (error) {
      console.error("PDF extraction error:", error);
      return `PDF File: ${file.name}\n\nNote: PDF content extraction had issues. File size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB`;
    }
  };

  const extractWordContent = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return `Word Document: ${file.name}\n\n${result.value || "No text content found"}`;
    } catch (error) {
      console.error("Word extraction error:", error);
      return `Word File: ${file.name}\n\nNote: Could not extract content. File size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB`;
    }
  };

  const extractExcelContent = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      let fullContent = `Excel File: ${file.name}\n\n`;

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        fullContent += `--- Sheet: ${sheetName} ---\n${csvContent}\n\n`;
      });

      return fullContent.trim();
    } catch (error) {
      console.error("Excel extraction error:", error);
      return `Excel File: ${file.name}\n\nNote: Could not extract content. File size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB`;
    }
  };

  const extractImageContent = async (file: File): Promise<string> => {
    try {
      // For now, return image info with instruction to manually add text if needed
      // Full OCR would require tesseract.js with significant processing time
      return `Image File: ${file.name}\n\nFile size: ${(file.size / 1024 / 1024).toFixed(
        2
      )} MB\n\nNote: For best results with images, please manually add the text content from the image using the "Add Content Manually" option. This ensures accurate text recognition.`;
    } catch (error) {
      console.error("Image processing error:", error);
      return `Image: ${file.name}`;
    }
  };

  const getParsedFileType = (fileName: string, fileType: string): string => {
    if (fileName.endsWith(".pdf")) return "pdf";
    if (fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg"))
      return "image";
    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return "word";
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) return "excel";
    if (fileType.includes("image")) return "image";
    return "text";
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        processFile(file);
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        processFile(file);
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    
    // Delete from Supabase if it exists there
    if (material?.storagePath && supabaseAvailable) {
      console.log(`🗑️ Deleting from Supabase: ${material.storagePath}`);
      const deleteResult = await deleteFileFromSupabase(material.storagePath);
      if (deleteResult.success) {
        console.log(`✓ File deleted from Supabase Storage`);
      } else {
        console.warn(`⚠ Failed to delete from Supabase: ${deleteResult.error}`);
      }
    }
    
    removeMaterial(materialId);
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddMaterial = () => {
    if (!materialName.trim() || !materialContent.trim()) {
      alert("Please enter both name and content");
      return;
    }

    const newMaterial: UploadedMaterial = {
      id: Date.now().toString(),
      name: materialName,
      content: materialContent,
      type: "text",
      uploadedAt: new Date(),
      size: `${(materialContent.length / 1024).toFixed(2)} KB`,
    };

    addMaterial(newMaterial);
    setMaterialName("");
    setMaterialContent("");
    setShowAddForm(false);
    setSuccessMessage(`✓ "${materialName}" added! Analyzing with AI...`);
    
    // Trigger background analysis
    triggerAnalysis(newMaterial.id, materialContent);
    
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "word":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "excel":
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Upload Your Study Materials</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Upload PDFs, Word documents, Excel sheets, images, and text files. AI will extract and analyze the content automatically for use in tutoring, summaries, quizzes, and more.
          </p>
        </motion.div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-700 dark:text-green-400 flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {successMessage}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ scale: dragActive ? 1.1 : 1 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Upload className="h-8 w-8 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Drop your files here</h3>
                  <p className="text-muted-foreground mb-4">or click to select files</p>
                  <p className="text-sm text-muted-foreground">
                    Supported: PDF, Word (.doc/.docx), Excel (.xls/.xlsx/.csv), Images (JPG/PNG), TXT (Max 50MB each)
                  </p>
                </div>
                <Button onClick={handleSelectFilesClick} disabled={isProcessing} className="mt-4">
                  {isProcessing ? "Processing..." : "Select Files"}
                </Button>
              </div>
            </Card>

            {/* Add Material Manually */}
            <Card className="mt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Content Manually</h3>
                <Button
                  variant={showAddForm ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "Cancel" : "Add Content"}
                </Button>
              </div>

              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Material Name</label>
                    <Input
                      placeholder="e.g., Biology - Chapter 5, Photosynthesis Notes"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <Textarea
                      placeholder="Paste your study notes, lecture content, textbook excerpts, or any study material here..."
                      value={materialContent}
                      onChange={(e) => setMaterialContent(e.target.value)}
                      className="min-h-48"
                    />
                  </div>

                  <Button onClick={handleAddMaterial} className="w-full">
                    Add Material
                  </Button>
                </motion.div>
              )}
            </Card>

            {/* Upload Info */}
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              {[
                { icon: "📄", title: "PDF", desc: "Extracts text automatically" },
                { icon: "📝", title: "Word/Excel", desc: "DOC, DOCX, XLS, XLSX supported" },
                { icon: "🖼️", title: "Images", desc: "Add text manually from screenshots" },
                { icon: "✍️", title: "Manual Entry", desc: "Type or paste content directly" },
              ].map((item, idx) => (
                <Card key={idx} className="p-4 text-center">
                  <span className="text-3xl mb-2 block">{item.icon}</span>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Materials List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Your Materials ({materials.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {materials.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No materials yet. Upload or add some content to get started!
                  </p>
                ) : (
                  materials.map((file, idx) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-3 rounded-lg transition ${
                        file.analyzedData?.analysisStatus === "failed"
                          ? "bg-red-500/10 border border-red-500/30"
                          : file.analyzedData?.analysisStatus === "completed"
                            ? "bg-green-500/10 border border-green-500/30"
                            : "bg-muted hover:bg-muted/80 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                            
                            {/* Analysis Status */}
                            {file.analyzedData && (
                              <div className="mt-1 flex items-center gap-1">
                                {file.analyzedData.analysisStatus === "analyzing" && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                    <Loader className="h-3 w-3 animate-spin" />
                                    Analyzing...
                                  </div>
                                )}
                                {file.analyzedData.analysisStatus === "completed" && (
                                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Ready for AI features
                                  </div>
                                )}
                                {file.analyzedData.analysisStatus === "failed" && (
                                  <div className="flex flex-col gap-1 text-xs text-red-600 dark:text-red-400 w-full">
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      Analysis failed
                                    </div>
                                    {file.analyzedData.analysisError && (
                                      <p className="text-xs text-red-600 dark:text-red-400 break-words">
                                        {file.analyzedData.analysisError}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMaterial(file.id)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              {materials.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                  {(() => {
                    const completed = materials.filter(
                      (m) => m.analyzedData?.analysisStatus === "completed"
                    ).length;
                    const analyzing = materials.filter(
                      (m) => m.analyzedData?.analysisStatus === "analyzing"
                    ).length;
                    const failed = materials.filter(
                      (m) => m.analyzedData?.analysisStatus === "failed"
                    ).length;

                    return (
                      <p className="text-blue-700 dark:text-blue-400">
                        ✓ {completed} analyzed
                        {analyzing > 0 && ` • ${analyzing} analyzing`}
                        {failed > 0 && ` • ${failed} failed`}
                      </p>
                    );
                  })()}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
