import React, { useState, useRef } from 'react';
import { PhotoReport, StageId, ConstructionStage } from '../types';
import { 
  Camera, 
  Plus, 
  X, 
  MapPin, 
  User, 
  Calendar, 
  Trash2, 
  UploadCloud, 
  FileImage,
  ImageIcon,
  Maximize2
} from 'lucide-react';

interface RelatorioFotograficoProps {
  stages: ConstructionStage[];
  photos: PhotoReport[];
  onAddPhoto: (photo: Omit<PhotoReport, 'id' | 'timestamp'>) => void;
  onDeletePhoto: (id: string) => void;
  userRole?: string;
}

export default function RelatorioFotografico({ stages, photos, onAddPhoto, onDeletePhoto, userRole }: RelatorioFotograficoProps) {
  const isWritable = userRole === 'MASTER';
  // Filter variables
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  
  // Adding state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStageId, setNewStageId] = useState<StageId>('ALVEN');
  const [newLocationTag, setNewLocationTag] = useState('');
  const [newUploadedBy, setNewUploadedBy] = useState('Eng. Pedro S. Mendonça');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modal visual preview
  const [zoomedPhoto, setZoomedPhoto] = useState<PhotoReport | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stageTranslations: { [key: string]: string } = {
    INFRA: 'Infraestrutura & Fundações',
    ESTRU: 'Superestrutura & Lajes',
    ALVEN: 'Alvenaria & Fechamentos',
    INSTA: 'Instalações Hidrotérmicas & Elétricas',
    ACABA: 'Revestimentos & Acabamentos',
    COMUM: 'Garagens & Áreas Comuns'
  };

  // Convert uploaded image to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A foto selecionada ultrapassa o limite de 2MB. Por favor escolha uma foto mais otimizada!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePhotoReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newLocationTag.trim()) {
      alert("Por favor preencha todos os campos do diário de fotos!");
      return;
    }

    if (!previewImage) {
      alert("Por favor faça o envio da foto ou selecione uma imagem técnica para o relatório!");
      return;
    }

    onAddPhoto({
      stageId: newStageId,
      title: newTitle,
      description: newDescription,
      imageUrl: previewImage,
      uploadedBy: newUploadedBy || 'Fiscal Técnico',
      locationTag: newLocationTag
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewLocationTag('');
    setPreviewImage(null);
    setIsAddingPhoto(false);
  };

  // Pre-configured typical simulated textures to click if user wants quick test images
  const sampleTextures = [
    { name: "Sapata / Fundação", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
    { name: "Paredes de Tijolos", url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80" },
    { name: "Tubulações de Cobre", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" },
    { name: "Massa Corrida / Gesso", url: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80" }
  ];

  const filteredPhotos = selectedStageFilter === 'ALL'
    ? photos
    : photos.filter(p => p.stageId === selectedStageFilter);

  return (
    <div className="space-y-6" id="photos-panel">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800">Diário Visual de Obras (Acompanhamento)</h2>
          <p className="text-xs text-slate-500">Relatórios fotográficos de qualidade, acompanhamento das unidades residenciais e áreas comuns em tempo real</p>
        </div>
        {isWritable ? (
          <button
            onClick={() => setIsAddingPhoto(!isAddingPhoto)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {isAddingPhoto ? <X className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            <span>{isAddingPhoto ? "Fechar Diário" : "Incluir Foto Técnica"}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-100 border text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>🔒 Modo Leitura (Apenas RT Master altera)</span>
          </div>
        )}
      </div>

      {/* Creation form */}
      {isAddingPhoto && (
        <form onSubmit={handleCreatePhotoReport} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-5 max-w-4xl mx-auto animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold font-display text-slate-800 text-base">Registrar Nova Evidência Fotográfica</h3>
            <p className="text-xs text-slate-400">Insira a imagem com a data e indicação de pavimentos ou dependências específicas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left side: Upload card and selection */}
            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-500 uppercase block">Anexar Captura ou Foto Local</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 flex flex-col items-center justify-center min-h-[220px]"
              >
                {previewImage ? (
                  <div className="relative w-full max-h-[200px] overflow-hidden rounded-lg">
                    <img 
                      src={previewImage} 
                      alt="Preview Anexo" 
                      className="object-cover w-full h-[180px] rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(null);
                      }}
                      className="absolute top-2 right-2 bg-slate-900/85 hover:bg-slate-900 text-white p-1 rounded-full text-xs shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full inline-block">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Selecione uma imagem da obra</p>
                    <p className="text-xs text-slate-400">Limite de tamanho recomendado: 2MB (JPG, PNG)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>

              {/* Or quick select demo images to make it super easy */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Ou selecione uma foto técnica simulada de teste:</span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleTextures.map((tex, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPreviewImage(tex.url)}
                      className="text-left text-[11px] p-2 border border-slate-100 hover:border-blue-200 bg-slate-50 rounded-lg hover:bg-blue-50/30 flex items-center gap-1.5 transition-colors font-medium text-slate-600"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{tex.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Metadata inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Título do Relato</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Concretagem das Vigas Baldrame Lado Sul"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Etapa do Projeto</label>
                  <select
                    value={newStageId}
                    onChange={(e) => setNewStageId(e.target.value as StageId)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 w-full"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Unidade / Local (Tag)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Apto 204, Garagem Térreo, Fachada Leste"
                    value={newLocationTag}
                    onChange={(e) => setNewLocationTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nome do Fiscal Autor</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Eng. Pedro S. Mendonça"
                  value={newUploadedBy}
                  onChange={(e) => setNewUploadedBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Notas Técnicas / Diário</label>
                <textarea
                  required
                  placeholder="Descreva as especificações do que foi fotografado, anomalias e orientações de montagem..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingPhoto(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Anexar da Foto
            </button>
          </div>
        </form>
      )}

      {/* Categories Horizontal Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setSelectedStageFilter('ALL')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            selectedStageFilter === 'ALL'
              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Ver Todas as Fotos
        </button>
        {stages.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedStageFilter(s.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              selectedStageFilter === s.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-10'
            }`}
          >
            {s.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Grid of gallery */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          Nenhum relatório fotográfico associado a esta etapa no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="photo-gallery-grid">
          {filteredPhotos.map((photo) => {
            return (
              <div 
                key={photo.id} 
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md hover:border-slate-350 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Photo container */}
                <div className="relative overflow-hidden bg-slate-900 group-hover:opacity-95 aspect-video shrink-0">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                    referrerPolicy="no-referrer"
                  />
                  {/* Local Tag */}
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{photo.locationTag}</span>
                  </span>

                  <button 
                    onClick={() => setZoomedPhoto(photo)}
                    className="absolute top-3 right-3 bg-slate-900/70 opacity-0 group-hover:opacity-100 hover:bg-slate-900 text-white p-2 rounded-full transition-all duration-200"
                    title="Visualizar Ampliado"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info and content */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-mono uppercase">
                        {photo.stageId === 'INFRA' ? 'Fundações' : 
                        photo.stageId === 'ESTRU' ? 'Superestrutura' : 
                        photo.stageId === 'ALVEN' ? 'Alvenaria' : 
                        photo.stageId === 'INSTA' ? 'Instalações' : 
                        photo.stageId === 'ACABA' ? 'Acabamento' : 'Áreas Comuns'}
                      </span>
                      <span>{photo.timestamp}</span>
                    </div>

                    <h4 className="font-display font-semibold text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors">{photo.title}</h4>
                    <p className="text-slate-550 text-xs text-slate-600 leading-relaxed font-sans">{photo.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                      <span>{photo.uploadedBy}</span>
                    </span>
                    {isWritable && (
                      <button
                        onClick={() => {
                          if (confirm("Quer realmente apagar esta imagem do diário técnico?")) {
                            onDeletePhoto(photo.id);
                          }
                        }}
                        className="p-1 hover:bg-red-50 rounded text-slate-300 hover:text-red-650 transition-colors cursor-pointer"
                        title="Apagar Evidência"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal image viewer zoom */}
      {zoomedPhoto && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full">
            
            {/* Modal photo */}
            <div className="relative aspect-video max-h-[500px] w-full bg-slate-950">
              <img 
                src={zoomedPhoto.imageUrl} 
                alt={zoomedPhoto.title} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setZoomedPhoto(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-950 text-white p-2.5 rounded-full shadow transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal descriptions */}
            <div className="p-6 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider font-mono">
                    PROJETO HORIZONTE • {zoomedPhoto.stageId}
                  </span>
                  <h3 className="font-display font-semibold text-slate-900 text-lg sm:text-xl">{zoomedPhoto.title}</h3>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <span>Enviado por: {zoomedPhoto.uploadedBy} em {zoomedPhoto.timestamp}</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed italic pr-2">{zoomedPhoto.description}</p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Marcador de Infra:</span>
                <span className="bg-slate-100 text-slate-700 py-1 px-2.5 rounded-full font-semibold flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {zoomedPhoto.locationTag}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
