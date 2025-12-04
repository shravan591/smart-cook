export enum DietaryFilter {
  None = "None",
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  GlutenFree = "Gluten-Free",
  Keto = "Keto",
  LowCarb = "Low-Carb",
  HighProtein = "High-Protein",
  DiabeticFriendly = "Diabetic-Friendly"
}

export enum RegionalStyle {
  Original = "Original",
  Indian = "Indian",
  Mexican = "Mexican",
  Italian = "Italian",
  Mediterranean = "Mediterranean",
  Chinese = "Chinese"
}

export enum Goal {
  Standard = "Standard",
  Budget = "Budget-Friendly",
  Healthy = "Healthier Version",
  Indulgent = "Indulgent"
}

export interface Ingredient {
  name: string;
  amount: string;
  originalName?: string; // If substituted
  substitutionReason?: string;
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'spices' | 'other';
  approxCost?: string;
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  healthScore: number; // 0-100
  insights: string[];
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  nutrition: NutritionInfo;
  estimatedCost: string;
  tags: string[];
  imageUrl?: string; // Optional, can be generated or from upload
}

export interface AppState {
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  preferences: {
    dietary: DietaryFilter;
    region: RegionalStyle;
    servings: number;
    goal: Goal;
  };
  history: Recipe[];
}