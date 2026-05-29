import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';

interface PropertyPhotoUploaderProps {
  currentImage: string;
  onImageChange: (url: string) => void;
}

const PROPERTY_PRESETS = [
  {
    id: 'apt-consolacao',
    name: 'Apartamento Consolação',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'loft-itaim',
    name: 'Loft Itaim Bibi',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cobertura-jardins',
    name: 'Cobertura Jardins',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'casa-pinheiros',
    name: 'Casa Alto de Pinheiros',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
];

export const PropertyPhotoUploader: React.FC<PropertyPhotoUploaderProps> = ({
  currentImage,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(PROPERTY_PRESETS[0].id);

  // Default initial image is preset 1
  React.useEffect(() => {
    if (!currentImage) {
      onImageChange(PROPERTY_PRESETS[0].url);
    }
  }, [currentImage, onImageChange]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageChange(reader.result);
          setSelectedPreset('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (presetId: string, url: string) => {
    setSelectedPreset(presetId);
    onImageChange(url);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold text-slate-700">Foto do Imóvel</div>
      
      {/* Upload Box / Preview */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group"
      >
        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt="Property" 
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity flex-col gap-1">
              <Camera className="text-white" size={24} />
              <span className="text-[10px] text-white font-medium">Alterar Foto</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
            <UploadCloud size={32} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            <div className="text-xs font-medium text-slate-600">Simule ou arraste uma foto</div>
            <div className="text-[10px] text-slate-400">JPG, PNG (máx. 5MB)</div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Preset Chooser */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Favoritos de Simulação</span>
        <div className="grid grid-cols-4 gap-1.5">
          {PROPERTY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => selectPreset(preset.id, preset.url)}
              className={`text-[9px] truncate py-1.5 px-1 rounded-md text-center border font-medium transition-all ${
                selectedPreset === preset.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {preset.name.split(' ')[1] || preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
