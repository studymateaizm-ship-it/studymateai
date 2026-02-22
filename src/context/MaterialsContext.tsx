import { createContext, useContext, useState, ReactNode } from "react";

export interface AnalyzedData {
  summary?: string;
  keyPoints?: string[];
  keywords?: string[];
  generatedQuestions?: Question[];
  analysisStatus: "pending" | "analyzing" | "completed" | "failed";
  analysisError?: string;
  analyzedAt?: Date;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UploadedMaterial {
  id: string;
  name: string;
  content: string;
  type: "pdf" | "image" | "text";
  uploadedAt: Date;
  size: string;
  analyzedData?: AnalyzedData;
  firebaseUrl?: string; // Download URL from Firebase
  storagePath?: string; // Path in Firebase Storage
}

interface MaterialsContextType {
  materials: UploadedMaterial[];
  addMaterial: (material: UploadedMaterial) => void;
  removeMaterial: (id: string) => void;
  getMaterialContent: () => string;
  updateMaterialAnalysis: (id: string, analyzedData: AnalyzedData) => void;
  getMaterialById: (id: string) => UploadedMaterial | undefined;
}

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const MaterialsProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<UploadedMaterial[]>([
    {
      id: "1",
      name: "Biology - Photosynthesis",
      content: `# Photosynthesis

Photosynthesis is the process by which plants convert light energy into chemical energy.

## The Process
1. Light Reactions: Occur in the thylakoid membrane
   - Photosystem II captures light energy
   - Water molecules are split (photolysis)
   - Electrons are energized and travel through the electron transport chain
   - Energy is used to produce ATP and NADPH

2. Calvin Cycle (Dark Reactions): Occur in the stroma
   - Carbon fixation: CO2 combines with RuBP (5-carbon sugar)
   - Reduction: Uses ATP and NADPH to form G3P
   - Regeneration: RuBP is regenerated

## Equation
6CO2 + 6H2O + light energy → C6H12O6 + 6O2

## Importance
- Provides oxygen for all aerobic organisms
- Produces glucose as primary food source
- Forms the base of most food chains
- Removes CO2 from atmosphere

## Light Wavelengths
- Blue light (400-450nm): Absorbed by chlorophyll a and carotenoids
- Red light (640-680nm): Absorbed effectively by chlorophyll a
- Green light (500-600nm): Passes through, appears green to us`,
      type: "text",
      uploadedAt: new Date(Date.now() - 86400000),
      size: "2.5 MB",
      analyzedData: {
        analysisStatus: "pending",
      },
    },
  ]);

  const addMaterial = (material: UploadedMaterial) => {
    // Initialize analyzedData with pending status
    const newMaterial = {
      ...material,
      analyzedData: {
        analysisStatus: "pending" as const,
      },
    };
    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const getMaterialContent = () => {
    return materials.map((m) => `[${m.name}]\n${m.content}`).join("\n\n---\n\n");
  };

  const updateMaterialAnalysis = (id: string, analyzedData: AnalyzedData) => {
    setMaterials(
      materials.map((m) =>
        m.id === id ? { ...m, analyzedData } : m
      )
    );
  };

  const getMaterialById = (id: string) => {
    return materials.find((m) => m.id === id);
  };

  return (
    <MaterialsContext.Provider
      value={{
        materials,
        addMaterial,
        removeMaterial,
        getMaterialContent,
        updateMaterialAnalysis,
        getMaterialById,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
};

export const useMaterials = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error("useMaterials must be used within MaterialsProvider");
  }
  return context;
};
