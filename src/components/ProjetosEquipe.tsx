import React, { useState } from 'react';
import { ProjectDetails, TeamMember } from '../types';
import { 
  Building2, 
  MapPin, 
  User, 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  DollarSign, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  Trash2, 
  Award,
  Maximize2
} from 'lucide-react';

interface ProjetosEquipeProps {
  projects: ProjectDetails[];
  activeProject: ProjectDetails;
  onSelectProject: (projId: string) => void;
  onAddProject: (newProj: ProjectDetails) => void;
  onDeleteProject?: (projId: string) => void;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  userRole?: string;
}

export default function ProjetosEquipe({
  projects,
  activeProject,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  teamMembers,
  setTeamMembers,
  userRole
}: ProjetosEquipeProps) {
  const isMaster = userRole === 'MASTER';
  
  // Creation States
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);

  // New Project Form
  const [newProjForm, setNewProjForm] = useState({
    name: '',
    address: '',
    totalArea: 1000,
    apartmentsCount: 8,
    garagesCount: 10,
    commonAreasDescription: '',
    plannedBudget: 1500000,
    spentBudget: 0,
    startDate: '',
    expectedEndDate: '',
    coordinator: '',
    crea: '',
    accessPassword: ''
  });

  // New Team Member Form
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    role: 'Engenheiro de Campo',
    email: '',
    phone: '',
    projectId: activeProject.id || 'proj-1'
  });

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjForm.name || !newProjForm.address || !newProjForm.startDate || !newProjForm.expectedEndDate) {
      alert("Por favor, preencha o nome do empreendimento, o endereço e as datas estimadas.");
      return;
    }

    const uniqueId = `proj-${Date.now()}`;
    const projectToSubmit: ProjectDetails = {
      id: uniqueId,
      name: newProjForm.name,
      address: newProjForm.address,
      totalArea: Number(newProjForm.totalArea),
      apartmentsCount: Number(newProjForm.apartmentsCount),
      garagesCount: Number(newProjForm.garagesCount),
      commonAreasDescription: newProjForm.commonAreasDescription || "Sem descrição",
      plannedBudget: Number(newProjForm.plannedBudget),
      spentBudget: Number(newProjForm.spentBudget),
      startDate: newProjForm.startDate,
      expectedEndDate: newProjForm.expectedEndDate,
      coordinator: newProjForm.coordinator || "Eng. Indefinido",
      crea: newProjForm.crea || "CREA não cadastrado",
      accessPassword: newProjForm.accessPassword.trim() || undefined
    };

    onAddProject(projectToSubmit);
    setIsAddingProject(false);
    
    // Auto-allocate the coordinator to the team list as well
    if (newProjForm.coordinator) {
      const coordMember: TeamMember = {
        id: `team-coord-${Date.now()}`,
        projectId: uniqueId,
        name: newProjForm.coordinator,
        role: "Responsável Técnico (Coodenador)",
        email: "",
        phone: ""
      };
      setTeamMembers(prev => [...prev, coordMember]);
    }

    // Reset Form
    setNewProjForm({
      name: '',
      address: '',
      totalArea: 1000,
      apartmentsCount: 8,
      garagesCount: 10,
      commonAreasDescription: '',
      plannedBudget: 1500000,
      spentBudget: 0,
      startDate: '',
      expectedEndDate: '',
      coordinator: '',
      crea: '',
      accessPassword: ''
    });
  };

  const handleCreateTeamMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamForm.name || !newTeamForm.role) {
      alert("Por favor, informe ao menos o Nome e a Função na obra.");
      return;
    }

    const createdTeam: TeamMember = {
      id: `team-${Date.now()}`,
      projectId: activeProject.id || 'proj-1',
      name: newTeamForm.name,
      role: newTeamForm.role,
      email: newTeamForm.email,
      phone: newTeamForm.phone
    };

    setTeamMembers(prev => [...prev, createdTeam]);
    setIsAddingTeamMember(false);
    setNewTeamForm({
      name: '',
      role: 'Engenheiro de Campo',
      email: '',
      phone: '',
      projectId: activeProject.id || 'proj-1'
    });
  };

  const handleRemoveTeamMember = (id: string) => {
    if (confirm("Remover profissional da designação técnica deste empreendimento?")) {
      setTeamMembers(prev => prev.filter(t => t.id !== id));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Team allocated to current selected active project
  const activeTeam = teamMembers.filter(t => t.projectId === activeProject.id);

  return (
    <div className="space-y-6 animate-fade-in" id="projects-team-module">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm" id="projects-header">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight">Obras & Alocação de Equipes</h2>
          <p className="text-xs text-slate-500">Módulo de portfólio de empreendimentos, designação de responsabilidades corporativas e fiscais</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddingProject(current => !current)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>
        </div>
      </div>

      {/* Row/Grid: Left Side active projects selector & registration, Right Side Designated Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active projects list and details selector (Left side, spanning 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Create Project Form Drawer */}
          {isAddingProject && (
            <form onSubmit={handleCreateProjectSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-md space-y-4 animate-fade-in mb-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm font-display">Cadastrar Empreendimento Imobiliário</h3>
                <p className="text-xs text-slate-400">Entre com as dimensões, orçamento planejado e equipe técnica para controle fiscal</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Nome do Empreendimento *</label>
                  <input 
                    type="text" 
                    required
                    value={newProjForm.name}
                    onChange={e => setNewProjForm({ ...newProjForm, name: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                    placeholder="Ex: Residencial Belle Vista"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Endereço Completo da Obra *</label>
                  <input 
                    type="text" 
                    required
                    value={newProjForm.address}
                    onChange={e => setNewProjForm({ ...newProjForm, address: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                    placeholder="Av. Getúlio Vargas, 120 - Porto Alegre/RS"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Engenheiro / Arquiteto Responsável *</label>
                  <input 
                    type="text" 
                    required
                    value={newProjForm.coordinator}
                    onChange={e => setNewProjForm({ ...newProjForm, coordinator: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                    placeholder="Ex: Eng. Pedro Mendonça"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Registro Técnico (CREA ou CAU)</label>
                  <input 
                    type="text" 
                    value={newProjForm.crea}
                    onChange={e => setNewProjForm({ ...newProjForm, crea: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                    placeholder="Ex: CREA 123456-RS"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Área Global de Construção (m²)</label>
                  <input 
                    type="number" 
                    value={newProjForm.totalArea}
                    onChange={e => setNewProjForm({ ...newProjForm, totalArea: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Orçamento Geral Previsto (R$)</label>
                  <input 
                    type="number" 
                    value={newProjForm.plannedBudget}
                    onChange={e => setNewProjForm({ ...newProjForm, plannedBudget: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Senha de Acesso da Obra</label>
                  <input 
                    type="text" 
                    value={newProjForm.accessPassword}
                    onChange={e => setNewProjForm({ ...newProjForm, accessPassword: e.target.value })}
                    placeholder="Ex: horizonte123"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Apartamentos/Unidades</label>
                  <input 
                    type="number" 
                    value={newProjForm.apartmentsCount}
                    onChange={e => setNewProjForm({ ...newProjForm, apartmentsCount: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Vagas de Garagem</label>
                  <input 
                    type="number" 
                    value={newProjForm.garagesCount}
                    onChange={e => setNewProjForm({ ...newProjForm, garagesCount: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Início Previsto *</label>
                  <input 
                    type="date" 
                    required
                    value={newProjForm.startDate}
                    onChange={e => setNewProjForm({ ...newProjForm, startDate: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Previsão Entrega *</label>
                  <input 
                    type="date" 
                    required
                    value={newProjForm.expectedEndDate}
                    onChange={e => setNewProjForm({ ...newProjForm, expectedEndDate: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Áreas Comuns / Lazer / Especificidade</label>
                  <input 
                    type="text" 
                    value={newProjForm.commonAreasDescription}
                    onChange={e => setNewProjForm({ ...newProjForm, commonAreasDescription: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                    placeholder="Ex: Piscina, Salão de festas decorado, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingProject(false)}
                  className="px-3 py-1.5 bg-slate-105 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Adicionar Obra
                </button>
              </div>
            </form>
          )}

          {/* Active Work Selection Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Selecione o Empreendimento Ativo</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {projects.map(p => {
                const isSelected = p.id === activeProject.id || (!activeProject.id && p.id === 'proj-1');
                return (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProject(p.id || 'proj-1')}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all relative group ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/45 ring-1 ring-blue-500/50 shadow-2xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wide font-black">Ativa</span>
                        )}
                        {onDeleteProject && projects.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(p.id || '');
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Excluir obra"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs mt-1.5 line-clamp-1 pr-6">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {p.address.split('-')[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large Portfolio Detail Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] font-bold text-slate-900 pointer-events-none" style={{ fontSize: '7rem' }}>
              {activeProject.totalArea}
            </div>
            
            <div className="border-b border-slate-105 pb-3">
              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                Resumo do Empreendimento Selecionado
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display mt-1.5 leading-snug">{activeProject.name}</h3>
              <p className="text-slate-500 text-xs flex items-center gap-1 mt-1 leading-relaxed font-normal">
                <MapPin className="text-slate-400 w-3.5 h-3.5" />
                <span>{activeProject.address}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-105">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Área de Obra</span>
                <span className="text-sm font-bold text-slate-850 font-mono mt-0.5 block">{activeProject.totalArea} m²</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Unidades/Aptos</span>
                <span className="text-sm font-bold text-slate-850 font-mono mt-0.5 block">{activeProject.apartmentsCount || 'Comercial'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Vagas de Garagem</span>
                <span className="text-sm font-bold text-slate-850 font-mono mt-0.5 block">{activeProject.garagesCount || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Investimento Plan.</span>
                <span className="text-sm font-bold text-slate-850 font-mono mt-0.5 block">{formatCurrency(activeProject.plannedBudget)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-650" />
                  <span>Coodenação / Responsabilidade Técnica</span>
                </div>
                <p className="text-slate-800 font-medium pl-5.5">{activeProject.coordinator || 'Eng. Ricardo Silva'}</p>
                <p className="text-slate-400 font-mono text-[10px] pl-5.5">{activeProject.crea || 'CREA 123456-D'}</p>
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Áreas Comuns & Detalhamento</span>
                </div>
                <p className="text-slate-500 leading-relaxed font-normal text-[11px] pl-5.5">{activeProject.commonAreasDescription}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Work Team Alocation Panel (Right side, spanning 5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 lg:col-start-8 xl:col-start-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-850 text-sm font-display uppercase tracking-wider">Profissionais Designados</h3>
                <p className="text-[10px] text-slate-400">Equipe técnica e supervisão direta desta obra</p>
              </div>
              {isMaster && (
                <button
                  onClick={() => setIsAddingTeamMember(current => !current)}
                  className="p-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Alocar Membro</span>
                </button>
              )}
            </div>

            {/* Designate member form inside details */}
            {isAddingTeamMember && (
              <form onSubmit={handleCreateTeamMemberSubmit} className="p-3.5 rounded-lg border border-slate-200 bg-slate-55/40 space-y-3 animate-fade-in">
                <h4 className="font-bold text-xs text-slate-700">Adicionar Integrante à Equipa Técnica</h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Nome Completo *</label>
                    <input 
                      type="text" 
                      required
                      value={newTeamForm.name}
                      onChange={e => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-md p-2 outline-hidden focus:border-blue-500"
                      placeholder="Ex: Eng. Gabriel Souza"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Função / Função na Obra *</label>
                    <select
                      value={newTeamForm.role}
                      onChange={e => setNewTeamForm({ ...newTeamForm, role: e.target.value })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-md p-2 outline-hidden focus:border-blue-500"
                    >
                      <option value="Responsável Técnico (Coodenador)">Coordenador de Canteiro / RT</option>
                      <option value="Engenheiro de Campo">Engenheiro de Campo / Residente</option>
                      <option value="Mestre de Obras Geral">Mestre de Obras Geral</option>
                      <option value="Técnico de Segurança do Trabalho">Técnico de Segurança (SST)</option>
                      <option value="Fiscal de Obra / Inspetor">Fiscal / Inspetor de Pintura</option>
                      <option value="Estagiário de Engenharia">Estagiário de Engenharia</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">E-mail Comercial</label>
                      <input 
                        type="email" 
                        value={newTeamForm.email}
                        onChange={e => setNewTeamForm({ ...newTeamForm, email: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-2 outline-hidden focus:border-blue-500"
                        placeholder="gabriel@edificapro.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Telefone Contato</label>
                      <input 
                        type="text" 
                        value={newTeamForm.phone}
                        onChange={e => setNewTeamForm({ ...newTeamForm, phone: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-2 outline-hidden focus:border-blue-500"
                        placeholder="(51) 98888-7777"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingTeamMember(false)}
                    className="px-2.5 py-1.5 bg-slate-105 text-[11px] font-semibold rounded-md text-slate-650 cursor-pointer"
                  >
                    Recusar
                  </button>
                  <button 
                    type="submit"
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-[11px] font-semibold rounded-md text-white cursor-pointer"
                  >
                    Confirmar Alocação
                  </button>
                </div>
              </form>
            )}

            {activeTeam.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center bg-slate-50 rounded-lg">Você ainda não designou profissionais específicos para esta equipe de obra.</p>
            ) : (
              <div className="divide-y divide-slate-105">
                {activeTeam.map(t => (
                  <div key={t.id} className="py-3 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 bg-slate-100 rounded-full text-slate-600">
                          <User className="w-3.5 h-3.5" />
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs leading-none">{t.name}</h4>
                      </div>
                      <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 rounded px-1.5 py-0.2 select-none">
                        {t.role}
                      </span>
                      <div className="flex flex-col gap-0.5 text-[10px] text-slate-500 pl-1 font-sans">
                        {t.email && (
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-405" /> {t.email}</span>
                        )}
                        {t.phone && (
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-405" /> {t.phone}</span>
                        )}
                      </div>
                    </div>

                    {isMaster && (
                      <button
                        onClick={() => handleRemoveTeamMember(t.id)}
                        className="p-1 hover:text-red-650 hover:bg-red-50 text-slate-400 rounded-md cursor-pointer transition-colors"
                        title="De-alocar membro de trabalho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
