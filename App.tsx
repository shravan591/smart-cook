import React, { useState } from 'react';
import RecipeInput from './components/RecipeInput';
import RecipeDisplay from './components/RecipeDisplay';
import Filters from './components/Filters';
import { convertRecipe } from './services/geminiService';
import { AppState, DietaryFilter, RegionalStyle, Goal, Recipe } from './types';
import { Utensils, Home, User, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentRecipe: null,
    isLoading: false,
    error: null,
    preferences: {
      dietary: DietaryFilter.None,
      region: RegionalStyle.Original,
      servings: 2,
      goal: Goal.Standard
    },
    history: []
  });

  const [activeNav, setActiveNav] = useState('home');

  const handleAnalyze = async (input: string, isImage: boolean) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const recipe = await convertRecipe(input, isImage, state.preferences);
      setState(prev => ({
        ...prev,
        isLoading: false,
        currentRecipe: recipe,
        history: [recipe, ...prev.history]
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Something went wrong."
      }));
    }
  };

  const reset = () => {
    setState(prev => ({ ...prev, currentRecipe: null, error: null }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      {/* Top Bar (Mobile Style) */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">SmartCook</span>
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
             <img src="https://picsum.photos/100" alt="User" />
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-4">
        {state.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm font-medium border border-red-100 flex justify-between items-center">
             {state.error}
             <button onClick={() => setState(prev => ({...prev, error: null}))}><Utensils className="w-4 h-4" /></button>
          </div>
        )}

        {state.currentRecipe ? (
          <RecipeDisplay recipe={state.currentRecipe} onReset={reset} />
        ) : (
          <>
            <Filters 
              preferences={state.preferences} 
              setPreferences={(newPrefs) => setState(prev => ({ 
                ...prev, 
                preferences: typeof newPrefs === 'function' ? newPrefs(prev.preferences) : newPrefs 
              }))} 
            />
            <RecipeInput onAnalyze={handleAnalyze} isLoading={state.isLoading} />
            
            {/* Recent History / Community Feed Mock */}
            <div className="mt-8">
               <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Community Trends</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                      <div className="h-24 bg-slate-200 rounded-xl mb-3 overflow-hidden">
                        <img src={`https://picsum.photos/300/200?random=${i}`} className="w-full h-full object-cover" alt="Community Recipe"/>
                      </div>
                      <h4 className="font-bold text-sm mb-1 truncate">Spicy Tofu Masala</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <User className="w-3 h-3" /> ChefAI
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 max-w-2xl mx-auto">
        {[
          { id: 'home', icon: Home, label: 'Cook' },
          { id: 'shop', icon: ShoppingBag, label: 'Shop' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`flex flex-col items-center gap-1 ${activeNav === item.id ? 'text-orange-500' : 'text-slate-400'}`}
          >
            <item.icon className={`w-6 h-6 ${activeNav === item.id ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
