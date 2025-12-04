import React from 'react';
import { DietaryFilter, RegionalStyle, Goal } from '../types';
import { X, Globe, Leaf, Scale } from 'lucide-react';

interface FiltersProps {
  preferences: {
    dietary: DietaryFilter;
    region: RegionalStyle;
    servings: number;
    goal: Goal;
  };
  setPreferences: React.Dispatch<React.SetStateAction<{
    dietary: DietaryFilter;
    region: RegionalStyle;
    servings: number;
    goal: Goal;
  }>>;
}

const Filters: React.FC<FiltersProps> = ({ preferences, setPreferences }) => {
  const update = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-orange-500" />
        Customize Conversion
      </h3>
      
      <div className="space-y-6">
        {/* Diet */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Dietary Preference</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(DietaryFilter).map(diet => (
              <button
                key={diet}
                onClick={() => update('dietary', diet)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  preferences.dietary === diet 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Regional Twist</label>
           <select 
             value={preferences.region}
             onChange={(e) => update('region', e.target.value)}
             className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-300"
           >
             {Object.values(RegionalStyle).map(r => (
               <option key={r} value={r}>{r} Style</option>
             ))}
           </select>
        </div>

        {/* Servings & Goal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Servings</label>
            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
              <button 
                onClick={() => update('servings', Math.max(1, preferences.servings - 1))}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-slate-800">{preferences.servings}</span>
               <button 
                onClick={() => update('servings', preferences.servings + 1)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Goal</label>
             <select 
             value={preferences.goal}
             onChange={(e) => update('goal', e.target.value)}
             className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-300"
           >
             {Object.values(Goal).map(g => (
               <option key={g} value={g}>{g}</option>
             ))}
           </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
