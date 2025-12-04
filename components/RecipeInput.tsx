import React, { useState, useRef } from 'react';
import { Camera, Upload, Type, X, ChefHat, Loader2 } from 'lucide-react';

interface RecipeInputProps {
  onAnalyze: (input: string, isImage: boolean) => void;
  isLoading: boolean;
}

const RecipeInput: React.FC<RecipeInputProps> = ({ onAnalyze, isLoading }) => {
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setInputType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (inputType === 'text' && textInput.trim()) {
      onAnalyze(textInput, false);
    } else if (inputType === 'image' && imagePreview) {
      // Extract base64 raw data
      const base64Data = imagePreview.split(',')[1];
      onAnalyze(base64Data, true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
          <ChefHat className="w-12 h-12 mx-auto mb-2 opacity-90" />
          <h1 className="text-2xl font-bold">What are we cooking?</h1>
          <p className="text-orange-100 text-sm">Paste a recipe or snap a photo of a menu/cookbook</p>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setInputType('text'); setImagePreview(null); }}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${
                inputType === 'text' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Type className="w-4 h-4 mr-2" />
              Text / URL
            </button>
            <button
              onClick={() => { setInputType('image'); }}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${
                inputType === 'image' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Camera className="w-4 h-4 mr-2" />
              Photo / Scan
            </button>
          </div>

          {/* Input Area */}
          <div className="min-h-[200px] flex flex-col justify-center">
            {inputType === 'text' ? (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste recipe instructions, ingredients, or just type 'Chicken Curry'..."
                className="w-full h-48 p-4 rounded-xl border-2 border-slate-100 focus:border-orange-400 focus:ring-0 resize-none bg-slate-50 text-slate-700 placeholder-slate-400 transition-colors"
              />
            ) : (
              <div className="w-full h-48 relative">
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-orange-400 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-500" />
                    </div>
                    <p className="text-slate-500 font-medium">Click to upload photo</p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG</p>
                  </div>
                ) : (
                  <div className="w-full h-full relative rounded-xl overflow-hidden group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || (inputType === 'text' && !textInput) || (inputType === 'image' && !imagePreview)}
            className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Recipe...
              </>
            ) : (
              <>
                Convert Recipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeInput;
