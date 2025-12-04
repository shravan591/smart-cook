import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types';
import { 
  Clock, Users, Flame, DollarSign, CheckCircle2, Circle, 
  ShoppingCart, Heart, Share2, ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RecipeDisplayProps {
  recipe: Recipe;
  onReset: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onReset }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const toggleIngredient = (name: string) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(name)) newSet.delete(name);
    else newSet.add(name);
    setCheckedIngredients(newSet);
  };

  // Nutrition Chart Data
  const nutData = [
    { name: 'Protein', value: parseInt(recipe.nutrition.protein) || 0, color: '#3b82f6' },
    { name: 'Carbs', value: parseInt(recipe.nutrition.carbs) || 0, color: '#f59e0b' },
    { name: 'Fats', value: parseInt(recipe.nutrition.fats) || 0, color: '#ef4444' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white rounded-b-3xl shadow-lg overflow-hidden relative">
        <div className="h-48 bg-slate-200 relative">
          <img 
            src={recipe.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(recipe.title)}/800/400`} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{recipe.title}</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={onReset}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-md text-slate-700 hover:bg-white"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-slate-100">
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto text-orange-500 mb-1" />
            <p className="text-xs text-slate-500 font-medium">Prep</p>
            <p className="text-sm font-bold text-slate-800">{recipe.prepTime}</p>
          </div>
          <div className="text-center border-l border-slate-100">
            <Users className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <p className="text-xs text-slate-500 font-medium">Serves</p>
            <p className="text-sm font-bold text-slate-800">{recipe.servings}</p>
          </div>
          <div className="text-center border-l border-slate-100">
            <Flame className="w-5 h-5 mx-auto text-red-500 mb-1" />
            <p className="text-xs text-slate-500 font-medium">Cal</p>
            <p className="text-sm font-bold text-slate-800">{recipe.nutrition.calories}</p>
          </div>
          <div className="text-center border-l border-slate-100">
            <DollarSign className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-xs text-slate-500 font-medium">Cost</p>
            <p className="text-sm font-bold text-slate-800">{recipe.estimatedCost}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-4 gap-2 sticky top-0 bg-[#f8fafc] z-10 overflow-x-auto">
        {(['ingredients', 'instructions', 'nutrition'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'ingredients' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-start gap-3">
              <ShoppingCart className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                 <h3 className="text-sm font-bold text-yellow-800">Shopping List Ready</h3>
                 <p className="text-xs text-yellow-700 mt-1">
                   Export these items to BigBasket or Blinkit for instant delivery.
                 </p>
              </div>
              <button 
                onClick={() => alert("Simulating export to grocery app...")}
                className="ml-auto bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-yellow-600"
              >
                Order
              </button>
            </div>
            <ul className="divide-y divide-slate-100">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleIngredient(ing.name)}>
                  <div className={`mt-0.5 ${checkedIngredients.has(ing.name) ? 'text-green-500' : 'text-slate-300'}`}>
                    {checkedIngredients.has(ing.name) ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className={`font-medium ${checkedIngredients.has(ing.name) ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {ing.name}
                      </span>
                      <span className="text-slate-500 text-sm">{ing.amount}</span>
                    </div>
                    {ing.originalName && (
                      <p className="text-xs text-orange-500 mt-0.5">
                        Substituted for: {ing.originalName} ({ing.substitutionReason})
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="space-y-4">
            {recipe.instructions.map((step) => (
              <div key={step.stepNumber} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.stepNumber}
                  </span>
                  <p className="text-slate-700 leading-relaxed mt-1">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Macro Distribution</h3>
                <div className="h-48 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {nutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {nutData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-sm text-slate-600 font-medium">{d.name}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-slate-800">Health Score: <span className="text-green-600">{recipe.nutrition.healthScore}/100</span></h3>
                </div>
                <ul className="space-y-2">
                  {recipe.nutrition.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-green-500 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        <button 
          onClick={() => alert('Saved to Cookbook!')}
          className="bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-full shadow-xl transition-all"
        >
          <Heart className="w-6 h-6" />
        </button>
        <button 
          onClick={() => alert('Shared to Community Feed!')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-full shadow-xl font-bold flex items-center gap-2 transition-all"
        >
          <Share2 className="w-5 h-5" />
          Share Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeDisplay;
