import React from 'react';

interface BrlCurrencyInputProps {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const BrlCurrencyInput: React.FC<BrlCurrencyInputProps> = ({
  id,
  value,
  onChange,
  placeholder = 'R$ 0,00',
  className = '',
  disabled = false,
}) => {
  // Converte o valor numérico em string formatada em BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const displayValue = value === 0 ? '' : formatBRL(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Extrai apenas dígitos
    const digits = raw.replace(/\D/g, '');
    const num = digits ? parseFloat(digits) / 100 : 0;
    onChange(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && value > 0 && value < 0.1) {
      // Facilita apagar tudo indo a zero direto caso reste menos de 10 centavos
      onChange(0);
    }
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};
