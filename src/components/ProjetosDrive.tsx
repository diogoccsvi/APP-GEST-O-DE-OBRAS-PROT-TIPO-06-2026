import React, { useState, useEffect } from 'react';
import { ProjectDetails } from '../types';
import { 
  Folder, 
  FileText, 
  FileImage, 
  Plus, 
  Search, 
  Upload, 
  Link, 
  Unlink, 
  LogOut, 
  Settings, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Clock,
  HardDrive,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProjetosDriveProps {
  activeProject: ProjectDetails;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  size?: string;
  webViewLink?: string;
}

interface LinkedDocument {
  projectId: string;
  driveFileId: string;
  name: string;
  mimeType: string;
  category: 'ARQ' | 'EST' | 'ELE' | 'HID' | 'OUT';
  linkedAt: string;
}

export default function ProjetosDrive({ activeProject }: ProjetosDriveProps) {
  // Authentication local states
  const [clientId, setClientId] = useState<string>(() => {
    return localStorage.getItem('gestao_obras_drive_client_id') || '';
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('gestao_obras_drive_access_token') || null;
  });
  const [manualToken, setManualToken] = useState<string>('');
  
  // UI views
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  // Linked docs
  const [linkedDocs, setLinkedDocs] = useState<LinkedDocument[]>(() => {
    const cached = localStorage.getItem('gestao_obras_drive_linked_docs');
    return cached ? JSON.parse(cached) : [];
  });
  
  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileCategory, setFileCategory] = useState<'ARQ' | 'EST' | 'ELE' | 'HID' | 'OUT'>('ARQ');
  const [isDragOver, setIsDragOver] = useState(false);

  // Parse token from redirection hash
  useEffect(() => {
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get('access_token');
      if (token) {
        setAccessToken(token);
        localStorage.setItem('gestao_obras_drive_access_token', token);
        // Clean hash from URL bar
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setErrorStatus(null);
      }
    }
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('gestao_obras_drive_linked_docs', JSON.stringify(linkedDocs));
  }, [linkedDocs]);

  // Save Configs
  const handleSaveConfigs = () => {
    localStorage.setItem('gestao_obras_drive_client_id', clientId);
    alert('Configurações armazenadas localmente com sucesso!');
    setShowSettings(false);
  };

  // Logout Google Drive
  const handleDisconnect = () => {
    if (window.confirm('Desconectar sua conta do Google Drive?')) {
      setAccessToken(null);
      localStorage.removeItem('gestao_obras_drive_access_token');
      setDriveFiles([]);
      setErrorStatus(null);
    }
  };

  // Fetch Files from Google Drive
  const fetchDriveFiles = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setErrorStatus(null);
    try {
      // Query parameters for architectural plans or general construction files
      // We seek PDFs, images, and folders
      const q = searchQuery 
        ? `name contains '${searchQuery}' and trashed = false` 
        : "mimeType = 'application/pdf' or mimeType image/jpeg/png' or mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' and trashed = false";
      
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,createdTime,size,webViewLink)&pageSize=30&q=${encodeURIComponent(q)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. O token de login expirou ou é inválido.');
        }
        throw new Error('Houve um problema ao buscar arquivos do Google Drive.');
      }
      
      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Erro de comunicação com as APIs do Google.');
      if (err.message.includes('401') || err.message.includes('Não autorizado')) {
        setAccessToken(null);
        localStorage.removeItem('gestao_obras_drive_access_token');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Drive Search on token or search query
  useEffect(() => {
    if (accessToken) {
      fetchDriveFiles();
    }
  }, [accessToken]);

  // Execute manual OAuth login redirect
  const handleGoogleLogin = () => {
    if (!clientId) {
      alert('Por favor, informe seu Google Client ID nas configurações primeiro!');
      setShowSettings(true);
      return;
    }

    const redirectUri = window.location.origin;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent('https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly')}`;
    
    // Redirect direct in our context matching Workspace skill
    window.location.href = url;
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    setAccessToken(manualToken.trim());
    localStorage.setItem('gestao_obras_drive_access_token', manualToken.trim());
    setManualToken('');
    setErrorStatus(null);
  };

  // Link file to current project
  const handleLinkFile = (file: DriveFile) => {
    const isAlreadyLinked = linkedDocs.some(d => d.driveFileId === file.id && d.projectId === activeProject.id);
    if (isAlreadyLinked) {
      alert('Este arquivo já está vinculado a esta obra!');
      return;
    }

    const newLink: LinkedDocument = {
      projectId: activeProject.id || 'proj-1',
      driveFileId: file.id,
      name: file.name,
      mimeType: file.mimeType,
      category: fileCategory,
      linkedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setLinkedDocs(prev => [newLink, ...prev]);
  };

  // Unlink file from project
  const handleUnlinkFile = (driveFileId: string) => {
    if (window.confirm('Deseja desvincular este desenho técnico desta obra? O arquivo ainda permanecerá intacto no Google Drive.')) {
      setLinkedDocs(prev => prev.filter(d => !(d.driveFileId === driveFileId && d.projectId === activeProject.id)));
    }
  };

  // File drag & drop handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // Upload selected file to Google Drive REST API
  const handleUploadToDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    // Ask user confirmation before upload to avoid silent transactions
    const isConfirmed = window.confirm(`Deseja realizar o envio do arquivo "${uploadFile.name}" para o seu Google Drive?`);
    if (!isConfirmed) return;

    setUploading(true);
    setUploadProgress(10);
    setErrorStatus(null);
    try {
      const metadata = {
        name: `${activeProject.name}_${fileCategory}__${uploadFile.name}`,
        mimeType: uploadFile.type
      };

      setUploadProgress(30);

      // We do a simple metadata + media multipart related request to Google Drive
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', uploadFile);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: form
      });

      setUploadProgress(80);

      if (!response.ok) {
        throw new Error('Ocorreu um erro ao enviar o arquivo para o Google Drive REST API.');
      }

      const uploadedFileMeta = await response.json();
      setUploadProgress(100);
      
      // Auto-link after successful upload
      const autoLink: LinkedDocument = {
        projectId: activeProject.id || 'proj-1',
        driveFileId: uploadedFileMeta.id,
        name: metadata.name,
        mimeType: uploadFile.type || 'application/octet-stream',
        category: fileCategory,
        linkedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setLinkedDocs(prev => [autoLink, ...prev]);
      setUploadFile(null);
      alert('Arquivo carregado com sucesso no Google Drive e associado à Obra Ativa!');
      fetchDriveFiles();
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Erro ao realizar upload.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper icons match
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-50" />;
    }
    if (mimeType.includes('image')) {
      return <FileImage className="w-5 h-5 text-blue-500 fill-blue-50" />;
    }
    return <FileText className="w-5 h-5 text-slate-500 fill-slate-50 border-0" />;
  };

  // Filter linked documents to current active project
  const projectLinkedDocs = linkedDocs.filter(d => d.projectId === activeProject.id);

  // Category label matches
  const categoryLabels = {
    ARQ: 'Arquitetônico (Planta)',
    EST: 'Estrutural (Ferragem)',
    ELE: 'Elétrica & Infra',
    HID: 'Hidrossanitária',
    OUT: 'Outros Manuais'
  };

  return (
    <div className="space-y-6 animate-fade-in" id="google-drive-projects">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold tracking-wider font-mono">GOOGLE DRIVE INTEGRADO</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight mt-1">Projetos de Engenharia & Plantas</h2>
          <p className="text-xs text-slate-500">Acesse, vincule e gerencie desenhos técnicos e especificações em tempo real direto da nuvem</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 text-xs border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Settings className="w-4 h-4" />
            <span>Configurar Google API</span>
          </button>
          
          {accessToken && (
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Desconectar Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* Settings Modal card drawer */}
      {showSettings && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-md p-5 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="space-y-3.5">
            <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Configurações do Cliente Google Cloud Portal</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O aplicativo usa o fluxo de Login do Google com autenticação segura. 
              Crie credenciais do tipo <strong>ID de cliente OAuth (Web Application)</strong> no <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Console do Google Cloud</a> e configure as origens de redirecionamento autorizadas para usar este serviço.
            </p>
            <div className="text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1 text-slate-600">
              <p>📍 <strong>Origem Autorizada:</strong> <code className="bg-white p-0.5 px-1 border rounded">{window.location.origin}</code></p>
              <p>📍 <strong>Redirecionamento Autorizado (Callback):</strong> <code className="bg-white p-0.5 px-1 border rounded">{window.location.origin}</code></p>
            </div>
            
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500">Google Client ID (Identificação do App do Projeto)</label>
              <input
                type="text"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                placeholder="Ex: 123456789-abc.apps.googleusercontent.com"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={handleSaveConfigs}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Salvar Credenciais
            </button>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider font-mono">Acesso Direto Dev via Token de Autenticação</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Deseja testar de imediato sem configurar o Google Cloud? Cole um token de acesso temporário gerado no <strong>Google OAuth Playground</strong> com escopos do Drive.
              </p>
              <form onSubmit={handleManualTokenSubmit} className="space-y-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={e => setManualToken(e.target.value)}
                  placeholder="Cole aqui o Bearer Access Token (ya29...)"
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Usar Token de Acesso Manual
                </button>
              </form>
            </div>
            <p className="text-[10px] text-slate-400 italic">Nota: Tokens manuais expiram dentro de 60 minutos de acordo com os padrões corporativos do Google.</p>
          </div>
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Files actually linked to physical current construction project */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-700 font-mono font-bold px-1.5 py-0.5 rounded uppercase block w-fit">OBRA ATIVA</span>
                <h3 className="font-bold text-slate-800 text-sm font-display tracking-tight mt-1">{activeProject.name}</h3>
                <p className="text-[10px] text-slate-400">Projetos Técnicos vinculados a esta obra</p>
              </div>
            </div>

            {projectLinkedDocs.length === 0 ? (
              <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4 space-y-2 text-slate-400">
                <Info className="w-6 h-6 mx-auto text-slate-300" />
                <p className="text-xs">Não há nenhuma planta ou projeto vinculado a este canteiro ainda.</p>
                <p className="text-[10px] text-slate-400 leading-normal">Use o painel lateral do Google Drive para vincular Desenhos Técnicos ou fazer Upload!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {projectLinkedDocs.map(doc => (
                  <div key={doc.driveFileId} className="p-3 rounded-lg border border-slate-250 bg-white shadow-3xs flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 bg-slate-100 rounded-full text-slate-600">
                          {getFileIcon(doc.mimeType)}
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs leading-tight line-clamp-2">{doc.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 items-center mt-1">
                        <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono font-black uppercase">
                          {doc.category} - {categoryLabels[doc.category]}
                        </span>
                        <span className="text-[9px] text-slate-450 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {doc.linkedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => window.open(`https://drive.google.com/open?id=${doc.driveFileId}`, '_blank')}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md cursor-pointer transition-colors"
                        title="Visualizar no Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUnlinkFile(doc.driveFileId)}
                        className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-650 rounded-md cursor-pointer transition-colors"
                        title="Desvincular planta"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload file directly to Drive and auto-link section */}
          {accessToken && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Upload de Planta & Projeto Técnico</h3>
                <p className="text-[10px] text-slate-400 font-medium">Carregue desenhos PDFs ou imagens CAD diretamente no Drive</p>
              </div>

              <form onSubmit={handleUploadToDrive} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Categoria Técnica da Planta</label>
                  <select
                    value={fileCategory}
                    onChange={e => setFileCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 outline-hidden focus:border-blue-500"
                  >
                    <option value="ARQ">Arquitetônico (Planta Baixa/Alturas)</option>
                    <option value="EST">Estrutural (Fundação, Laje e Vigas)</option>
                    <option value="ELE">Elétrico (Eletrodutos, Quadros)</option>
                    <option value="HID">Hidrossanitário (Redes de Água e Esgoto)</option>
                    <option value="OUT">Manuais Técnicos & Licenciamentos</option>
                  </select>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50/10' 
                      : 'border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    id="drive-project-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf, image/*, .xlsx, .xls"
                  />
                  <label htmlFor="drive-project-upload" className="cursor-pointer block space-y-1.5">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-650">Arraste ou clique para selecionar arquivo</p>
                    <p className="text-[10px] text-slate-400">PDF, JPG, PNG de até 15MB</p>
                  </label>
                </div>

                {uploadFile && (
                  <div className="p-3 bg-blue-50/20 border border-blue-100 rounded-lg flex justify-between items-center">
                    <div className="truncate max-w-[200px]">
                      <p className="font-bold text-xs text-slate-800 truncate">{uploadFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadFile(null)}
                      className="text-[10px] text-red-500 hover:underline font-bold"
                    >
                      Remover
                    </button>
                  </div>
                )}

                {uploading && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Carregando arquivo...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-450 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Enviar para o Google Drive</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right column: Google Drive Folder and File Explorer (spanning 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 min-h-[500px] flex flex-col">
            
            {/* Search and reload header bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0 border-b border-slate-100 pb-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar arquivos no Drive..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchDriveFiles()}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={fetchDriveFiles}
                  disabled={!accessToken || isLoading}
                  className="p-2 border border-slate-200 hover:border-slate-300 rounded-lg bg-white text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold disabled:opacity-50"
                  title="Atualizar lista de arquivos"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
                  <span>Atualizar</span>
                </button>

                {!accessToken && (
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-6.16-4.53z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Conectar Google Account</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error notifications */}
            {errorStatus && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-lg flex items-start gap-2 animate-fade-in shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Houve uma falha de conexão ou permissão:</p>
                  <p className="font-mono mt-0.5 text-[11px] leading-tight text-red-600">{errorStatus}</p>
                  <p className="mt-1">Tente reconectar usando seu Client ID ou forneça um novo Token de Acesso temporário.</p>
                </div>
              </div>
            )}

            {/* Main content viewport */}
            <div className="flex-1 overflow-y-auto min-h-0 pt-3">
              {!accessToken ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <HardDrive className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 text-sm font-display">Conexão com Google Drive Não Estabelecida</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Conecte-se para autenticar seu acesso de Engenheiro e recuperar com segurança as plantas e projetos armazenados no seu Google Drive.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full pt-2">
                    <button
                      onClick={handleGoogleLogin}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Entrar com a Conta do Google</span>
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="py-2 border border-slate-200 hover:bg-slate-50 text-slate-705 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Preencher Token de Acesso Manualmente
                    </button>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-xs font-medium">Buscando desenhos técnicos na nuvem do Google Drive...</p>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-2 max-w-sm mx-auto">
                  <Folder className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-800">Nenhum desenho técnico ou PDF encontrado</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Não encontramos arquivos relevantes (PDFs, imagens CAD ou Tabelas Excel) no seu Drive ou a busca não retornou dados. Use o botão <strong>Upload</strong> para enviar sua primeira planta!
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                    <span>Nome do Arquivo / Formato</span>
                    <span>Ações de Canteiro</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {driveFiles.map(file => {
                      const isLinkedToActive = linkedDocs.some(d => d.driveFileId === file.id && d.projectId === activeProject.id);
                      return (
                        <div key={file.id} className="py-2.5 flex justify-between items-center gap-4 hover:bg-slate-50/40 rounded transition-colors px-1">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <span className="shrink-0 mt-0.5">{getFileIcon(file.mimeType)}</span>
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-bold text-slate-800 text-xs truncate" title={file.name}>
                                {file.name}
                              </p>
                              <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                                <span>Criado: {file.createdTime ? new Date(file.createdTime).toLocaleDateString('pt-BR') : 'N/D'}</span>
                                {file.size && <span>• {(Number(file.size)/1024/1024).toFixed(2)} MB</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {file.webViewLink && (
                              <button
                                onClick={() => window.open(file.webViewLink, '_blank')}
                                className="p-1 px-2 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>Abrir</span>
                                <ExternalLink className="w-3 from-slate-400" />
                              </button>
                            )}

                            {isLinkedToActive ? (
                              <button
                                onClick={() => handleUnlinkFile(file.id)}
                                className="p-1 px-2 bg-red-50 hover:bg-red-100 text-red-650 rounded text-[10px] font-bold flex items-center gap-0.5 border border-red-150 cursor-pointer"
                              >
                                <Unlink className="w-3" />
                                <span>Desvincular</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-0.5">
                                <select
                                  onChange={e => {
                                    setFileCategory(e.target.value as any);
                                    handleLinkFile(file);
                                  }}
                                  defaultValue=""
                                  className="text-[10px] bg-slate-50 border border-slate-200 rounded p-1 outline-hidden focus:border-blue-500 cursor-pointer text-slate-650 font-semibold"
                                >
                                  <option value="" disabled>Vincular como...</option>
                                  <option value="ARQ">Planta Arquitetônica</option>
                                  <option value="EST">Planta Estrutural</option>
                                  <option value="ELE">Planta Elétrica</option>
                                  <option value="HID">Planta Hidrossanitária</option>
                                  <option value="OUT">Outro Manual</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom informational foot banner */}
            <div className="bg-blue-50/20 border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start mt-4 shrink-0 text-slate-550 leading-relaxed text-[11px]">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Por que integrar com o Google Drive?</span> Os engenheiros podem sincronizar os arquivos atualizados de CAD e croquis sem carregar duplicatas pesadas na plataforma local, mantendo a responsabilidade técnica e total conformidade com a central do empreendimento.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
