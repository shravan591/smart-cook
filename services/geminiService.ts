import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, DietaryFilter, RegionalStyle, Goal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    servings: { type: Type.INTEGER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING },
          originalName: { type: Type.STRING, description: "The name of the original ingredient if this is a substitution" },
          substitutionReason: { type: Type.STRING, description: "Why this substitution was made" },
          category: { type: Type.STRING, enum: ["produce", "dairy", "meat", "pantry", "spices", "other"] },
          approxCost: { type: Type.STRING, description: "Estimated cost in user's currency (e.g., $1.50 or ₹50)" }
        },
        required: ["name", "amount", "category"]
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING }
        },
        required: ["stepNumber", "instruction"]
      }
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.INTEGER },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fats: { type: Type.STRING },
        healthScore: { type: Type.INTEGER, description: "Score from 0 to 100 based on nutritional density" },
        insights: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Brief bullet points about the nutritional value or health benefits"
        }
      },
      required: ["calories", "protein", "carbs", "fats", "healthScore"]
    },
    estimatedCost: { type: Type.STRING, description: "Total estimated cost" },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["title", "ingredients", "instructions", "nutrition", "servings"]
};

export const convertRecipe = async (
  input: string,
  isImage: boolean,
  prefs: {
    dietary: DietaryFilter;
    region: RegionalStyle;
    servings: number;
    goal: Goal;
  }
): Promise<Recipe> => {
  
  const model = "gemini-2.5-flash"; // Good for multimodal + JSON extraction
  
  let parts: any[] = [];
  
  if (isImage) {
    // Input is base64 string
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming JPEG for simplicity, can be dynamic
        data: input
      }
    });
    parts.push({
      text: "Extract and convert this recipe based on the following instructions."
    });
  } else {
    parts.push({
      text: `Original Recipe Input: "${input}"`
    });
  }

  const prompt = `
    You are a professional chef and nutritionist AI.
    
    Task: Analyze the provided recipe input (text or image) and convert/rewrite it to strictly follow these preferences:
    - Dietary Requirement: ${prefs.dietary}
    - Regional Cuisine Style: ${prefs.region} (Adapt spices and techniques accordingly if not 'Original')
    - Target Servings: ${prefs.servings} (Scale ingredients accurately)
    - Optimization Goal: ${prefs.goal} (e.g., if Budget, swap for cheaper ingredients; if Healthy, reduce sugar/fats).
    
    If 'Regional Cuisine Style' is Indian, use local Indian alternatives (e.g., Paneer instead of Tofu/Cheese where appropriate, local vegetables).
    If 'Goal' is Budget, suggest cost-effective swaps.
    
    Provide the output in strict JSON format.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.4, // Lower temperature for more consistent formatting
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as Recipe;
  } catch (error) {
    console.error("Gemini Conversion Error:", error);
    throw new Error("Failed to convert recipe. Please try again.");
  }
};
