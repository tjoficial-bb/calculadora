import React, { useState } from 'react';
import { MapPin, Search, Compass, AlertCircle } from 'lucide-react';

interface MapMockupProps {
  address: string;
  onAddressChange: (addr: string) => void;
  city: string;
  onCityChange: (city: string) => void;
}

const BR_CITIES = [
  { name: 'São Paulo', state: 'SP', coords: '23.5505° S, 46.6333° W' },
  { name: 'Rio de Janeiro', state: 'RJ', coords: '22.9068° S, 43.1729° W' },
  { name: 'Belo Horizonte', state: 'MG', coords: '19.9173° S, 43.9345° W' },
  { name: 'Curitiba', state: 'PR', coords: '25.4290° S, 49.2671° W' },
];

export const MapMockup: React.FC<MapMockupProps> = ({
  address,
  onAddressChange,
  city,
  onCityChange,
}) => {
  const [pinPos, setPinPos] = useState({ x: 120, y: 80 });
  const [showSearchAlert, setShowSearchAlert] = useState(false);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPinPos({ x, y });
  };

  const selectCity = (cityName: string) => {
    onCityChange(cityName);
    const relatedCity = BR_CITIES.find(c => c.name === cityName);
    if (relatedCity) {
      onAddressChange(`Rua Central, ${cityName} - ${relatedCity.state}, Brasil`);
      // Randomize pin location corresponding to city swap
      setPinPos({
        x: 80 + Math.random() * 120,
        y: 50 + Math.random() * 80,
      });
    }
  };

  const triggerSearchSimulated = () => {
    setShowSearchAlert(true);
    setTimeout(() => setShowSearchAlert(false), 2500);
  };

  return (
    <div className="flex flex-col gap-2.5 text-left">
      {/* City Switcher */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cidade do Leilão</span>
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
          {BR_CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => selectCity(c.name)}
              className={`text-[10px] whitespace-nowrap px-2 pb-1.5 pt-1 rounded border font-semibold transition-all cursor-pointer ${
                city === c.name
                  ? 'bg-gold-light border-gold/30 text-gold-dark'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.name} ({c.state})
            </button>
          ))}
        </div>
      </div>

      {/* Address Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 flex justify-between">
          <span>Endereço do Imóvel <span className="text-rose-500">*</span></span>
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Digite o endereço completo do leilão..."
            className="w-full h-[38px] text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 pr-10 focus:outline-none focus:border-gold focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={triggerSearchSimulated}
            className="absolute right-1 w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-550 transition-all border border-slate-200 cursor-pointer"
          >
            <Search size={14} className="text-slate-500" />
          </button>
        </div>
        {showSearchAlert && (
          <span className="text-[9px] text-gold flex items-center gap-1 mt-0.5 animate-pulse">
            <AlertCircle size={10} /> Buscando e centralizando imóvel selecionado no mapa...
          </span>
        )}
      </div>

      {/* Stylized Vector SVG Map Simulation */}
      <div className="relative">
        <div className="text-[9px] text-slate-400 flex items-center justify-between mb-1">
          <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
            <Compass size={11} className="animate-spin-slow text-slate-300" />
            Clique no mapa para ajustar a latitude/longitude
          </span>
          <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1 rounded">
            X:{pinPos.x.toFixed(0)}, Y:{pinPos.y.toFixed(0)}
          </span>
        </div>
        
        <div 
          onClick={handleMapClick}
          className="relative h-44 w-full bg-slate-50 border border-slate-100 rounded-xl overflow-hidden cursor-crosshair group/map shadow-inner"
        >
          {/* SVG Map Grid Background mimicking streets and zones */}
          <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#street-grid)" />
            
            {/* Styled district zones */}
            <path d="M 0,20 Q 80,45 150,15 T 320,50 L 320,120 L 0,120 Z" fill="#f0fdf4" opacity="0.8" /> {/* Park Zone */}
            <path d="M 120,140 Q 180,60 250,150 T 400,100" fill="none" stroke="#bae6fd" strokeWidth="14" strokeLinecap="round" /> {/* River */}
            <path d="M 120,140 Q 180,60 250,150 T 400,100" fill="none" stroke="#e0f2fe" strokeWidth="8" strokeLinecap="round" /> {/* Inner River Water */}
            
            {/* Primary Street highways */}
            <line x1="0" y1="40" x2="350" y2="160" stroke="#fed7aa" strokeWidth="4" />
            <line x1="80" y1="0" x2="80" y2="200" stroke="#fed7aa" strokeWidth="4" />
            <line x1="240" y1="0" x2="240" y2="200" stroke="#e2e8f0" strokeWidth="3" />
            <line x1="0" y1="110" x2="350" y2="110" stroke="#cbd5e1" strokeWidth="2.5" />
            
            {/* Secondary Street blocks */}
            <line x1="40" y1="0" x2="40" y2="200" stroke="#f1f5f9" strokeWidth="1.5" />
            <line x1="120" y1="0" x2="120" y2="200" stroke="#f1f5f9" strokeWidth="1.5" />
            <line x1="160" y1="0" x2="160" y2="200" stroke="#f1f5f9" strokeWidth="1.5" />
            <line x1="200" y1="0" x2="200" y2="200" stroke="#f1f5f9" strokeWidth="1.5" />
            <line x1="280" y1="0" x2="280" y2="200" stroke="#f1f5f9" strokeWidth="1.5" />
            
            {/* Diagonal avenues */}
            <line x1="0" y1="180" x2="350" y2="20" stroke="#cbd5e1" strokeWidth="2" />
            
            {/* Place Names & Landmarks */}
            <text x="35" y="30" fill="#94a3b8" fontSize="8" fontWeight="bold">REPUBLICA</text>
            <text x="140" y="55" fill="#166534" fontSize="8" fontWeight="bold">PARQUE ACLIMAÇÃO</text>
            <text x="250" y="80" fill="#0284c7" fontSize="8" fontWeight="bold">IPIRANGA</text>
            <text x="50" y="145" fill="#94a3b8" fontSize="8" fontWeight="bold">CONSOLAÇÃO</text>
          </svg>

          {/* Interactive Ping/Sonar Ring on hover */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300"
            style={{ left: pinPos.x, top: pinPos.y }}
          >
            <div className="absolute w-8 h-8 rounded-full bg-gold/15 animate-ping" />
            <div className="absolute w-12 h-12 rounded-full border border-gold/10 scale-95 animate-pulse" />
            <MapPin className="text-gold drop-shadow-md z-10 animate-bounce" fill="#fdfaf2" size={24} />
          </div>

          {/* Google / GIS map interface visual overlay */}
          <div className="absolute bottom-1 right-2 bg-white/80 backdrop-blur-xs px-1 py-0.5 rounded text-[8px] text-slate-500 font-mono pointer-events-none border border-slate-100">
            © {city} Vector GIS Core
          </div>
          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded text-[8px] text-white pointer-events-none flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Leilão Centralizado: {city}
          </div>
        </div>
      </div>
    </div>
  );
};
