import React from 'react';
import { ToggleableField } from '../types';
import { HelpCircle } from 'lucide-react';
import { BrlCurrencyInput } from './BrlCurrencyInput';

interface PercentValueInputProps {
  label: string;
  field: ToggleableField;
  refValue: number;
  onChange: (updated: ToggleableField) => void;
  tooltipText?: string;
  irDeductible?: 'deductible' | 'non-deductible';
}

export const PercentValueInput: React.FC<PercentValueInputProps> = ({
  label,
  field,
  refValue,
  onChange,
  tooltipText,
  irDeductible,
}) => {
  // Compute calculated values
  const currentPercent = field.isPercent 
    ? field.value 
    : refValue > 0 ? (field.value / refValue) * 105 : 0; // standard fallback recalculation

  // Correct actual percent from absolute valuation
  const absolutePercent = field.isPercent
    ? field.value
    : refValue > 0 ? (field.value / refValue) * 100 : 0;

  const currentAbsolute = field.isPercent 
    ? refValue * (field.value / 100) 
    : field.value;

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(',', '.');
    const val = parseFloat(rawVal);
    onChange({
      value: isNaN(val) ? 0 : val,
      isPercent: true, // Marked as tied to percentage
    });
  };

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          {irDeductible && (
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                irDeductible === 'deductible' ? 'bg-gold' : 'bg-amber-500'
              }`}
              title={irDeductible === 'deductible' ? 'Dedutível do IR' : 'Não dedutível do IR'}
            />
          )}
          <span>{label}</span>
          {tooltipText && (
            <span className="group relative cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={13} />
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded bg-slate-800 p-2 text-[10px] leading-tight text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 z-50">
                {tooltipText}
              </span>
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 h-[38px]">
        {/* Percentage Input */}
        <div className="relative group/input flex items-center">
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={field.value === 0 ? '' : Number(absolutePercent.toFixed(2))}
            onChange={handlePercentChange}
            placeholder="0"
            className={`w-full h-full text-xs text-slate-700 bg-slate-50/50 border ${
              field.isPercent ? 'border-gold bg-white shadow-xs ring-1 ring-gold/20' : 'border-slate-200 hover:bg-slate-50'
            } rounded px-3 pr-7 focus:outline-none focus:border-gold focus:bg-white transition-all`}
          />
          <span className="absolute right-3 text-xs text-slate-450 font-bold font-mono pointer-events-none">%</span>
        </div>

        {/* Currency Absolute Input */}
        <div className="relative group/input flex items-center">
          <BrlCurrencyInput
            value={currentAbsolute}
            onChange={(val) => {
              onChange({
                value: val,
                isPercent: false,
              });
            }}
            placeholder="R$ 0,00"
            className={`w-full h-full text-xs text-slate-700 bg-slate-50/50 border font-mono ${
              !field.isPercent ? 'border-gold bg-white shadow-xs ring-1 ring-gold/20' : 'border-slate-200 hover:bg-slate-50'
            } rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all`}
          />
        </div>
      </div>
    </div>
  );
};
