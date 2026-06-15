import React, { useState } from 'react';
import { ProjectDetails, ConstructionStage, ScheduleTask, Expense, PhotoReport, TeamMember, RealEstateTax } from '../types';
import { 
  Building2, 
  MapPin, 
  Printer, 
  ExternalLink, 
  Image as ImageIcon, 
  Map as MapIcon, 
  Save, 
  User, 
  Calendar, 
  DollarSign, 
  FileText,
  Building,
  Award,
  Link,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CapaObraProps {
  project: ProjectDetails;
  onUpdateProject: (updated: ProjectDetails) => void;
  stages: ConstructionStage[];
  tasks: ScheduleTask[];
  expenses: Expense[];
  photos: PhotoReport[];
  teamMembers: TeamMember[];
  taxes: RealEstateTax[];
  userRole?: string;
}

export default function CapaObra({
  project,
  onUpdateProject,
  stages,
  tasks,
  expenses,
  photos,
  teamMembers,
  taxes,
  userRole
}: CapaObraProps) {
  const isMaster = userRole === 'MASTER';
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Preset cover photos for various types of constructions
  const PRESET_COVERS = [
    {
      name: 'Residencial Moderno (Fase Inicial)',
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Edifício Residencial Alto Padrão',
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Condomínio Horizontal',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Torre Comercial Corporativa',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    }
  ];

  // If project has no cover, use first preset as default
  const activeCoverUrl = (project as any).coverUrl || PRESET_COVERS[0].url;

  const handleSelectPreset = (url: string) => {
    onUpdateProject({
      ...project,
      coverUrl: url
    } as any);
  };

  const handleCustomPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoUrlInput.trim()) {
      onUpdateProject({
        ...project,
        coverUrl: photoUrlInput.trim()
      } as any);
      setPhotoUrlInput('');
      setIsEditingPhoto(false);
    }
  };

  // Google Maps external link helper
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.address)}`;
  
  // Google Maps free iframe embed helper (clean and functional, auto-loaded on physical address)
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(project.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const [printMode, setPrintMode] = useState<'complete' | 'summary' | 'photos'>('complete');

  // Printing Action
  const handlePrintDossier = () => {
    window.print();
  };

  const triggerPrint = (mode: 'complete' | 'summary' | 'photos') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Calculations for Report Summary Page
  const paidExpenses = expenses.filter(e => e.status === 'PAID');
  const totalPaid = paidExpenses.reduce((sum, e) => sum + e.value, 0);
  const totalPending = expenses.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.value, 0);
  const totalProgress = stages.reduce((acc, stage) => acc + (stage.progress * (stage.weight / 100)), 0);

  return (
    <div className="space-y-6 animate-fade-in" id="project-cover-module">
      {/* Header Controls Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4" id="cover-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight font-sans">Capa & Relatórios Executivos</h2>
            <p className="text-xs text-slate-500">Selecione uma opção de relatório abaixo para formatar e gerar o arquivo PDF correspondente da obra</p>
          </div>
          <div>
            <button
              onClick={() => triggerPrint(printMode)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95"
              title="Gerar PDF do relatório ativo"
            >
              <Printer className="w-4 h-4" />
              <span>Gerar Relatório Selecionado (PDF)</span>
            </button>
          </div>
        </div>

        {/* Option Selection Grid for PDF Custom Generation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Option A: Dossiê Completo */}
          <button
            type="button"
            onClick={() => triggerPrint('complete')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border text-center transition-all cursor-pointer group ${
              printMode === 'complete'
                ? 'border-slate-400 bg-slate-50 ring-1 ring-slate-400/30'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <Printer className="w-5 h-5 text-slate-500 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Dossiê Completo (PDF)</span>
            <span className="text-[10px] text-slate-400 mt-1 leading-tight">Emitir relatório completo (4 páginas integradas)</span>
          </button>

          {/* Option B: Relatório Resumido Executivo */}
          <button
            type="button"
            onClick={() => triggerPrint('summary')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border text-center transition-all cursor-pointer group ${
              printMode === 'summary'
                ? 'border-slate-400 bg-slate-50 ring-1 ring-slate-400/30'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <FileText className="w-5 h-5 text-slate-500 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-800 font-sans">Relatório Resumido (PDF)</span>
            <span className="text-[10px] text-slate-400 mt-1 leading-tight">Cronograma, custos, medições, fornecedores e equipe</span>
          </button>

          {/* Option C: Relatório com Fotos e Datas */}
          <button
            type="button"
            onClick={() => triggerPrint('photos')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border text-center transition-all cursor-pointer group ${
              printMode === 'photos'
                ? 'border-slate-400 bg-slate-50 ring-1 ring-slate-400/30'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-5 h-5 text-slate-500 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-800 font-sans">Fotos & Datas (PDF)</span>
            <span className="text-[10px] text-slate-400 mt-1 leading-tight font-sans">Relatório fotográfico consolidado com histórico</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Visual Cover and Photo settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Cover Page Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Visual Header / Cover Image */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-100 group">
              <img 
                src={activeCoverUrl} 
                alt="Foto da Obra" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent flex flex-col justify-end p-6">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-sm w-fit mb-2">
                  Dossiê Oficial da Obra
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight font-display drop-shadow-sm">
                  {project.name}
                </h1>
                <p className="text-slate-300 text-xs md:text-sm font-light mt-1.5 flex items-center gap-1.5 drop-shadow-xs">
                  <MapPin className="text-slate-400 w-4 h-4 shrink-0" />
                  <span>{project.address}</span>
                </p>
              </div>
            </div>

            {/* Bottom details card info */}
            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-y-3 justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Responsável Técnico</span>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none">{project.coordinator || 'Eng. Ricardo Silva'}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{project.crea || 'CREA SC-12345'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Progresso Físico Geral</span>
                  <div>
                    <span className="text-lg font-black text-blue-700 font-mono">{totalProgress.toFixed(1)}%</span>
                  </div>
                  <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${totalProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Sub attributes bento grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Área Construída</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block font-mono">{project.totalArea} m²</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Unidades</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block font-mono">{project.apartmentsCount || '0'} Unid.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Início do Serviço</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block font-mono">{project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'Indefinido'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Previsão Fim</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block font-mono">{project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString('pt-BR') : 'Indefinido'}</span>
                </div>
              </div>

              {/* Common Areas Summary */}
              <div className="p-4 bg-blue-50/20 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-blue-800 text-xs uppercase tracking-wider mb-1 font-mono">
                  <Building className="w-4 h-4" />
                  <span>Áreas Comuns & Equipamentos</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{project.commonAreasDescription || 'Sem áreas comuns declaradas.'}</p>
              </div>
            </div>
          </div>

          {/* Change Cover Image Tools Panel */}
          {isMaster && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-sm font-display">Personalizar Imagem da Capa</h3>
              </div>

                {/* Presets Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Selecione uma imagem predefinida:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {PRESET_COVERS.map((cov, idx) => {
                      const isCurrent = activeCoverUrl === cov.url;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectPreset(cov.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                            isCurrent ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <img src={cov.url} alt={cov.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-1 text-center">
                            <span className="text-[8px] font-medium text-white line-clamp-1 block leading-tight">{cov.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Field Toggle */}
                <div className="pt-2">
                  {!isEditingPhoto ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhoto(true)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-605 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inserir link de foto personalizada...</span>
                    </button>
                  ) : (
                    <form onSubmit={handleCustomPhotoSubmit} className="space-y-2 animate-fade-in">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Link URL da Imagem Personalizada:</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          required
                          value={photoUrlInput}
                          onChange={e => setPhotoUrlInput(e.target.value)}
                          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-slate-500"
                          placeholder="Cole o endereço HTTPS de qualquer foto da obra..."
                        />
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Salvar</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsEditingPhoto(false);
                            setPhotoUrlInput('');
                          }} 
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

        {/* RIGHT COLUMN: Google Maps Integration and printable checklist */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Integrated Location Maps Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-sm font-display">Localização Georreferenciada</h3>
              </div>
              <a 
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 rounded p-1 px-2 border border-blue-100 transition-colors"
                id="maps-direct-link"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Mapa integrado à localização exata declarada. Clique no botão acima para ver direções detalhadas ou traçar rotas de suprimentos no Google Maps original.
            </p>

            {/* Maps Iframe Frame */}
            <div className="w-full h-64 border border-slate-200 rounded-lg overflow-hidden relative shadow-inner bg-slate-100">
              <iframe
                title="Google Maps Obra Embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer"
                src={googleMapsEmbedUrl}
              ></iframe>
            </div>

            {/* Quick action card listing address */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Endereço Informado</span>
              <p className="text-xs font-semibold text-slate-700 mt-1">{project.address}</p>
            </div>
          </div>

          {/* PDF Assembly Overview Information Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-sm font-display">Estrutura do Dossiê para Impressão</h3>
            </div>
            
            <p className="text-xs text-slate-400">
              Ao clicar em <strong>Gerar Relatório Completo</strong>, o sistema compila os dados ativos em uma folha técnica de prestação de contas, otimizada para salvar em PDF:
            </p>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Capa Executiva</strong> completa com foto e endereço</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Acompanhamento de Cronograma</strong> com status de todas as tarefas residenciais</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Auditoria Financeira</strong> (Orçamentos, Despesas Pagas e Lançamentos Pendentes)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Relatório Fotográfico Consolidado</strong> com descrições do canteiro</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span><strong>Equipe Técnica & Prestadores</strong> ativos designados por responsabilidade</span>
              </li>
            </ul>

            <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg text-[11px] text-slate-500">
              💡 <strong>Dica de exportação:</strong> Se a visualização de cores de fundo sumir na tela de impressão do seu navegador, marque a caixa <strong>“Gráficos de plano de fundo”</strong> (Background Graphics) nas opções de impressão.
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* EXCLUSIVE PRINTING CONTAINER (HIDDEN ON SCREEN, REVEALED IN PRINT) */}
      {/* ========================================================= */}
      <div className="hidden print:block fixed inset-0 bg-white z-50 overflow-y-auto text-slate-900 p-8 font-sans" id="print-dossier-layout">
        
        {printMode === 'complete' && (
          <>
            {/* PRINT PAGE 1: COVER */}
            <div className="min-h-screen flex flex-col justify-between py-12 border-b-2 border-slate-300 page-break-after-always">
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b-4 border-blue-600 pb-4">
                  <div>
                    <span className="text-xs font-black tracking-widest text-blue-600 uppercase">EDIFICAPRO MESTREOBRAS</span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-1">DOSSIÊ CONSOLIDADO DE ENGENHARIA</h1>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-500">Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                    <p className="text-xs font-mono text-slate-500">Localização Local: Porto Alegre/RS</p>
                  </div>
                </div>

                <div className="my-10 space-y-6">
                  <h2 className="text-4xl font-extrabold text-slate-900 font-display leading-tight">{project.name}</h2>
                  <p className="text-sm text-slate-600 font-medium flex items-center gap-1">
                    📍 Endereço Real: {project.address}
                  </p>
                </div>

                {/* Print Image */}
                <div className="w-full h-80 rounded-xl overflow-hidden shadow-xs border border-slate-300 bg-slate-100 relative">
                  <img src={activeCoverUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Obra Cover" />
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Dados Técnicos do Empreendimento</h3>
                    <div className="divide-y divide-slate-200 text-xs text-slate-800">
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Área de Loteamento:</span>
                        <span className="font-bold">{project.totalArea} m²</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Unidades Habitacionais:</span>
                        <span className="font-bold">{project.apartmentsCount || 'Comercial'}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Vagas de Estacionamento:</span>
                        <span className="font-bold">{project.garagesCount || 'N/A'}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Equipamento Comum:</span>
                        <span className="font-bold text-slate-600 truncate max-w-xs block text-right">{project.commonAreasDescription}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Supervisão Técnica & Responsabilidade</h3>
                      <div className="mt-3">
                        <p className="text-sm font-bold text-slate-900">{project.coordinator || 'Eng. Ricardo Silva'}</p>
                        <p className="text-xs text-slate-500 font-mono">REGISTRO: {project.crea || 'CREA 123456-D'}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                      Assinatura do Responsável por emissão técnica:<br /><br />
                      <div className="border-b border-dark/30 w-full pt-4"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-10 text-[10px] text-slate-400">
                Dossiê emitido às {new Date().toLocaleTimeString('pt-BR')} pelo portal de gerenciamento EdificaPro. Página 1 de 4
              </div>
            </div>

            {/* PRINT PAGE 2: METRICS & TIMELINE */}
            <div className="min-h-screen flex flex-col justify-between py-12 border-b-2 border-slate-300 page-break-after-always">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                  <h3 className="text-lg font-bold text-slate-800">1. Acompanhamento de Cronograma & Estágios Físicos</h3>
                  <span className="text-xs text-slate-500">{project.name}</span>
                </div>

                {/* Stages Grid List */}
                <div className="space-y-3">
                  {stages.map((stg) => (
                    <div key={stg.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span>{stg.name} (Peso {stg.weight}%)</span>
                        <span className="font-mono">{stg.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1 bg-slate-150">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${stg.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                        <span>Início: {new Date(stg.startDate).toLocaleDateString('pt-BR')}</span>
                        <span>Prazo Término: {new Date(stg.endDate).toLocaleDateString('pt-BR')}</span>
                        <span>Custo Realizado: {formatCurrency(stg.spentCost)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Task List */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Status de Atividades do Canteiro</h4>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold block-table-tr text-slate-700">
                        <th className="p-2">Tarefa/Atividade</th>
                        <th className="p-2">Estágio</th>
                        <th className="p-2">Início / Entrega</th>
                        <th className="p-2 font-mono">Progresso</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tasks.map(tsk => (
                        <tr key={tsk.id}>
                          <td className="p-2 font-bold">{tsk.title}</td>
                          <td className="p-2 text-slate-500">{tsk.stageId}</td>
                          <td className="p-2">{new Date(tsk.startDate).toLocaleDateString('pt-BR')} - {new Date(tsk.endDate).toLocaleDateString('pt-BR')}</td>
                          <td className="p-2 font-mono">{tsk.progress}%</td>
                          <td className="p-2">
                            <span className="font-bold text-[10px]">
                              {tsk.status === 'COMPLETED' ? 'Concluída' : tsk.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center pt-8 text-[10px] text-slate-400">
                Dossiê emitido de Porto Alegre/RS. Página 2 de 4
              </div>
            </div>

            {/* PRINT PAGE 3: FINANCIAL HEALTH */}
            <div className="min-h-screen flex flex-col justify-between py-12 border-b-2 border-slate-300 page-break-after-always">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                  <h3 className="text-lg font-bold text-slate-800">2. Auditoria Orçamentária & Lançamentos Financeiros</h3>
                  <span className="text-xs text-slate-500">{project.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block">Investimento Planejado Global:</span>
                    <span className="text-base font-bold font-mono text-slate-900 block mt-1">{formatCurrency(project.plannedBudget)}</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block">Total de Recursos Pagos:</span>
                    <span className="text-base font-bold font-mono text-emerald-700 block mt-1">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block">Saldo em Lançamento Retido/Pendente:</span>
                    <span className="text-base font-bold font-mono text-amber-600 block mt-1">{formatCurrency(totalPending)}</span>
                  </div>
                </div>

                {/* Expenses lists */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Dossiê Detalhado de Pagamento</h4>
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold block-table-tr text-slate-700">
                        <th className="p-2">Item Financeiro / Serviço</th>
                        <th className="p-2">Categoria</th>
                        <th className="p-2 font-right text-right">Valor Líquido</th>
                        <th className="p-2">Emissão data</th>
                        <th className="p-2">Beneficiário/Credor</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.map(exp => (
                        <tr key={exp.id}>
                          <td className="p-2 font-bold">{exp.title}</td>
                          <td className="p-2 text-slate-500">{exp.category}</td>
                          <td className="p-2 text-right font-mono font-semibold">{formatCurrency(exp.value)}</td>
                          <td className="p-2">{new Date(exp.date).toLocaleDateString('pt-BR')}</td>
                          <td className="p-2 text-slate-600 truncate max-w-xs">{exp.provider}</td>
                          <td className="p-2 font-bold">{exp.status === 'PAID' ? 'PAGO' : 'PENDENTE'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center pt-8 text-[10px] text-slate-400 font-mono">
                Dossiê emitido de Porto Alegre/RS. Página 3 de 4
              </div>
            </div>

            {/* PRINT PAGE 4: PHOTO LOG & FIELD TEAM */}
            <div className="min-h-screen flex flex-col justify-between py-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                  <h3 className="text-lg font-bold text-slate-800">3. Relatório Fotográfico Consolidado & Alocações Activas</h3>
                  <span className="text-xs text-slate-500">{project.name}</span>
                </div>

                {/* Photo reports grid print layout */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Vistoria Fotográfica da Obra</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {photos.length === 0 ? (
                      <p className="text-slate-400 text-xs col-span-2 text-center py-6 bg-slate-50 rounded">Não há fotos cadastradas no Relatório Fotográfico.</p>
                    ) : (
                      photos.map(p => (
                        <div key={p.id} className="p-2 border border-slate-200 rounded-lg flex flex-col justify-between bg-white space-y-2">
                          <div className="w-full h-32 overflow-hidden rounded bg-slate-100">
                            <img src={p.imageUrl} referrerPolicy="no-referrer" alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[10px] space-y-1">
                            <h5 className="font-bold text-slate-800 line-clamp-1">{p.title}</h5>
                            <p className="text-slate-550 leading-tight line-clamp-2">{p.description}</p>
                            <div className="flex justify-between text-[8px] text-slate-450 font-semibold pt-1 border-t border-slate-100">
                              <span>📍 {p.locationTag}</span>
                              <span>🕒 {p.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Allocated team and suppliers print listing */}
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Profissionais Ativos na Obra</h4>
                    <div className="border border-slate-200 rounded-lg divide-y divide-slate-105 text-[10px]">
                      {teamMembers.filter(t => t.projectId === project.id).map(t => (
                        <div key={t.id} className="p-2 flex justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{t.name}</p>
                            <p className="text-slate-500 font-normal">{t.role}</p>
                          </div>
                          <div className="text-right font-mono text-slate-500">
                            <p>{t.phone || 'Sem fone'}</p>
                          </div>
                        </div>
                      ))}
                      {teamMembers.filter(t => t.projectId === project.id).length === 0 && (
                        <p className="p-3 text-slate-405 text-center">Nenhum profissional cadastrado.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Principais Impostos & Alíquotas Vigentes</h4>
                    <div className="border border-slate-200 rounded-lg divide-y divide-slate-105 text-[10px]">
                      {taxes.map(tax => (
                        <div key={tax.id} className="p-2 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{tax.name}</p>
                            <p className="text-slate-500 font-normal truncate max-w-xs">{tax.basis}</p>
                          </div>
                          <span className="font-black text-indigo-700 font-mono text-[11px] shrink-0">{tax.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8 text-[10px] text-slate-400">
                Fim do Dossiê Consolidado Oficial EdificaPro. Página 4 de 4
              </div>
            </div>
          </>
        )}

        {printMode === 'summary' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-300 pb-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                <img src={activeCoverUrl} alt="Logo Capa da Obra" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Relatório Resumido Executivo</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-950 font-sans">{project.name}</h1>
                <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                  📍 {project.address} &bull; Emissão: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono">
                EdificaPro &bull; MestreObras
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-sans block">Progresso Realizado</span>
                <span className="text-base font-black font-mono text-slate-800 mt-0.5 block">{totalProgress.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-sans block">Orçamento Planejado</span>
                <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{formatCurrency(project.plannedBudget)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-sans block">Total Pago (Valores)</span>
                <span className="text-sm font-bold font-mono text-emerald-800 mt-0.5 block">{formatCurrency(totalPaid)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-sans block">Total Pendente</span>
                <span className="text-sm font-bold font-mono text-amber-700 mt-0.5 block">{formatCurrency(totalPending)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">1. Progresso dos Estágios</h3>
                  <div className="space-y-1.5">
                    {stages.map((stg) => (
                      <div key={stg.id} className="text-[10px] flex justify-between items-center bg-slate-50/50 p-1 rounded px-2 border border-slate-100">
                        <span className="font-semibold text-slate-700">{stg.name}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-slate-500 h-full rounded-full" style={{ width: `${stg.progress}%` }} />
                          </div>
                          <span className="font-bold text-slate-850 font-mono">{stg.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">2. Equipe Técnica e Coordenação</h3>
                  <div className="text-[10px] border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                    <div className="p-1.5 flex justify-between font-bold bg-slate-50">
                      <span>Coordenador Geral (CREA)</span>
                      <span className="text-slate-500 font-mono">{project.coordinator || 'Não alocado'} ({project.crea || 'S-C'})</span>
                    </div>
                    {teamMembers.filter(t => t.projectId === project.id).map(t => (
                      <div key={t.id} className="p-1.5 flex justify-between">
                        <span>{t.name} ({t.role})</span>
                        <span className="text-slate-500 font-mono">{t.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">3. Lançamentos e Fornecedores Principais</h3>
                  <div className="text-[10px] border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                    {expenses.slice(0, 5).map(exp => (
                      <div key={exp.id} className="p-1.5 flex justify-between items-center bg-white">
                        <div className="truncate max-w-[140px]">
                          <span className="font-bold block text-slate-800 leading-tight">{exp.title}</span>
                          <span className="text-slate-400 text-[8px] block">{exp.provider} &bull; {exp.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-slate-900 block">{formatCurrency(exp.value)}</span>
                          <span className="text-[8px] font-bold text-slate-400">{exp.status === 'PAID' ? 'PAGO' : 'PENDENTE'}</span>
                        </div>
                      </div>
                    ))}
                    {expenses.length === 0 && (
                      <p className="p-3 text-slate-400 text-center">Nenhum lançamento de custo registrado.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">4. Medições e Vistorias</h3>
                  <p className="text-[10px] text-slate-600 leading-normal">
                    Foram registradas medições oficiais de acompanhamento físico para as etapas de infraestrutura e execução civil. O índice geral de conformidade atingiu 100% de aceitação para o avanço das despesas em regime fiscal.
                  </p>
                  <div className="p-2 bg-slate-50 rounded border border-slate-150 inline-block text-[10px] font-bold text-slate-700">
                     Dossiê Resumido emitido nos termos da supervisão de {project.coordinator || 'Diretor de Obras'}.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-24 text-center text-[10px] text-slate-400 border-t border-slate-100">
              Emitido sob chancela técnica EdificaPro. Porto Alegre/RS. Canteiro Ativo do Empreendimento.
            </div>
          </div>
        )}

        {printMode === 'photos' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-300 pb-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100 opacity-90">
                <img src={activeCoverUrl} alt="Logo Obra" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Relatório Fotográfico & Cronologia</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-950 font-sans">{project.name}</h1>
                <p className="text-xs text-slate-550 font-mono mt-0.5">
                  📍 Endereço Georeferenciado: {project.address} &bull; Emissão: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono">
                Diário Técnico e Vistorias
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 leading-relaxed mb-4">
              Abaixo seguem os registros fotográficos oficiais indexados por data com suas respectivas conferências de canteiro, atestando o progresso físico atual da obra avaliada em <strong>{totalProgress.toFixed(1)}% de conclusão geral</strong>.
            </div>

            <div className="space-y-6 block">
              {photos.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-12 bg-slate-50 border border-dashed rounded">Nenhum registro fotográfico arquivado para esta obra.</p>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {photos.map(p => (
                    <div key={p.id} className="p-3 border border-slate-300 rounded-xl flex flex-col justify-between bg-white space-y-3">
                      <div className="w-full h-48 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/50">
                        <img src={p.imageUrl} referrerPolicy="no-referrer" alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-slate-800 text-xs font-sans">{p.title}</h4>
                          <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                            {p.locationTag}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[10px] leading-relaxed font-normal">{p.description}</p>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold pt-1.5 border-t border-slate-150 font-mono">
                          <span>📅 Cronologia: {p.timestamp}</span>
                          <span className="text-slate-400">ID-{p.id.slice(0, 5)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-24 text-center">
              <div className="inline-block border-t border-slate-300 w-64 text-xs font-bold text-slate-700 pt-1 font-sans">
                {project.coordinator || 'Responsável Técnico / Engenheiro'}
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">CREA: {project.crea || 'Ativo'}</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
