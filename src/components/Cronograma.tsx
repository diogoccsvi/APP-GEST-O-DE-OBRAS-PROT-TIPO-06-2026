import React, { useState } from 'react';
import { ScheduleTask, StageId, ConstructionStage } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';

interface CronogramaProps {
  tasks: ScheduleTask[];
  stages: ConstructionStage[];
  onAddTask: (task: Omit<ScheduleTask, 'id'>) => void;
  onUpdateTask: (task: ScheduleTask) => void;
  onDeleteTask: (id: string) => void;
  userRole?: string;
}

export default function Cronograma({ tasks, stages, onAddTask, onUpdateTask, onDeleteTask, userRole }: CronogramaProps) {
  const isMaster = userRole === 'MASTER';
  // Filters
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form / Edit state
  const [isAddingProjectTask, setIsAddingProjectTask] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // New task inputs
  const [newStageId, setNewStageId] = useState<StageId>('INFRA');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<ScheduleTask['status']>('PENDING');

  // Edit task inputs (cloned for editing)
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editResponsible, setEditResponsible] = useState('');
  const [editProgress, setEditProgress] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<ScheduleTask['status']>('PENDING');

  // Collapsed sections by default based on stages
  const [collapsedStages, setCollapsedStages] = useState<{ [key: string]: boolean }>({});

  const toggleCollapsed = (stageId: string) => {
    setCollapsedStages(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStartDate || !newEndDate) {
      alert("Por favor preencha Título, Data Inicial e Final!");
      return;
    }

    onAddTask({
      stageId: newStageId,
      title: newTitle,
      description: newDescription,
      startDate: newStartDate,
      endDate: newEndDate,
      progress: Math.min(100, Math.max(0, Number(newProgress))),
      status: newStatus,
      responsible: newResponsible || "Não designado"
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewStartDate('');
    setNewEndDate('');
    setNewResponsible('');
    setNewProgress(0);
    setNewStatus('PENDING');
    setIsAddingProjectTask(false);
  };

  const startEditing = (task: ScheduleTask) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStartDate(task.startDate);
    setEditEndDate(task.endDate);
    setEditResponsible(task.responsible);
    setEditProgress(task.progress);
    setEditStatus(task.status);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const handleSaveEdit = (task: ScheduleTask) => {
    onUpdateTask({
      ...task,
      title: editTitle,
      description: editDescription,
      startDate: editStartDate,
      endDate: editEndDate,
      responsible: editResponsible,
      progress: Math.min(100, Math.max(0, Number(editProgress))),
      status: editStatus
    });
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStage = selectedStageFilter === 'ALL' || task.stageId === selectedStageFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || task.status === selectedStatusFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesStatus && matchesSearch;
  });

  const getStatusTextAndStyle = (status: ScheduleTask['status'], endDate: string) => {
    const isOverdue = new Date(endDate) < new Date() && status !== 'COMPLETED';
    
    if (isOverdue) {
      return { text: 'Atrasada', style: 'bg-red-100 text-red-800 border-red-200' };
    }
    switch (status) {
      case 'COMPLETED':
        return { text: 'Concluída', style: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'IN_PROGRESS':
        return { text: 'Em Andamento', style: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'DELAYED':
        return { text: 'Atrasada', style: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { text: 'Pendente', style: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const stageTranslations: { [key: string]: string } = {
    INFRA: 'Infraestrutura & Fundações',
    ESTRU: 'Superestrutura & Lajes',
    ALVEN: 'Alvenaria & Fechamentos',
    INSTA: 'Instalações Hidrotérmicas & Elétricas',
    ACABA: 'Revestimentos & Acabamento',
    COMUM: 'Garagens & Áreas Comuns'
  };

  return (
    <div className="space-y-6" id="cronograma-view">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800">Cronograma de Atividades</h2>
          <p className="text-xs text-slate-500">Controle de prazos, responsabilidades e andamento físico do empreendimento</p>
        </div>
        {isMaster ? (
          <button
            onClick={() => setIsAddingProjectTask(!isAddingProjectTask)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {isAddingProjectTask ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddingProjectTask ? "Cancelar Criação" : "Nova Tarefa"}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-100 border text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>🔒 Modo Leitura (Apenas RT Master altera)</span>
          </div>
        )}
      </div>

      {/* Adding Task Interactive Panel */}
      {isAddingProjectTask && (
        <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-xl border border-slate-200 shadow-md space-y-4 max-w-4xl animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold font-display text-slate-800 text-base">Adicionar Nova Tarefa de Obra</h3>
            <p className="text-xs text-slate-400">Insira as datas sugeridas e aloque o empreiteiro responsável</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Etapa Vinculada</label>
              <select
                value={newStageId}
                onChange={(e) => setNewStageId(e.target.value as StageId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              >
                {stages.map(s => (
                  <option key={s.id} value={s.id}>{stageTranslations[s.id]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nome/Título do Serviço</label>
              <input
                type="text"
                placeholder="Ex: Instalação de caixas de esgoto hidráulicas"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Descrição da Atividade</label>
            <textarea
              placeholder="Descreva minuciosamente o serviço, materiais utilizados e recomendações normativas..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Data Inicial</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Data Final (Estimada)</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Progresso Atual (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status Inicial</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ScheduleTask['status'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="PENDING">Planejado/Pendente</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluído</option>
                <option value="DELAYED">Atrasado</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Empreiteiro / Responsável Directo</label>
            <input
              type="text"
              placeholder="Ex: João EletroInstalações, Equipe Mestre"
              value={newResponsible}
              onChange={(e) => setNewResponsible(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 inline-block w-full"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddingProjectTask(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      )}

      {/* Advanced Filter Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por título, descrição ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-semibold">FILTROS:</span>
          </div>
          
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-600 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todas as Etapas</option>
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-600 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendentes</option>
            <option value="IN_PROGRESS">Em Andamento</option>
            <option value="COMPLETED">Concluídos</option>
            <option value="DELAYED">Atrasados</option>
          </select>
        </div>
      </div>

      {/* Tasks Table & Chronological list grouped by stage */}
      <div className="space-y-4">
        {stages
          .filter(stage => selectedStageFilter === 'ALL' || stage.id === selectedStageFilter)
          .map((stage) => {
            const stageTasks = filteredTasks.filter(t => t.stageId === stage.id);
            const isCollapsed = collapsedStages[stage.id] || false;

            if (stageTasks.length === 0 && selectedStageFilter === 'ALL' && searchTerm !== '') return null;

            return (
              <div key={stage.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Stage Header Band */}
                <div 
                  onClick={() => toggleCollapsed(stage.id)}
                  className="bg-slate-50 px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-slate-100/80 transition-colors border-b border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full`} style={{
                        backgroundColor: stage.color === 'emerald' ? '#10b981' :
                                        stage.color === 'blue' ? '#3b82f6' :
                                        stage.color === 'amber' ? '#f59e0b' :
                                        stage.color === 'indigo' ? '#6366f1' :
                                        stage.color === 'purple' ? '#a855f7' : '#14b8a6'
                      }}></span>
                      <h4 className="font-display font-semibold text-slate-800 text-sm">{stage.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>{stageTasks.length} {stageTasks.length === 1 ? 'Serviço' : 'Serviços'}</span>
                    <span className="hidden sm:inline">|</span>
                    <span className="hidden sm:inline">Progresso Etapa: {stage.progress}%</span>
                  </div>
                </div>

                {/* Tasks List within Stage */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {stageTasks.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        Nenhuma atividade cadastrada ou encontrada para esta etapa com os filtros aplicados.
                      </div>
                    ) : (
                      stageTasks.map((task) => {
                        const isEditing = editingTaskId === task.id;
                        const statusDetails = getStatusTextAndStyle(task.status, task.endDate);

                        return (
                          <div key={task.id} className={`p-5 transition-colors ${isEditing ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
                            {isEditing ? (
                              /* Editable View mode */
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">Título</label>
                                    <input
                                      type="text"
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm text-slate-700"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">Responsável</label>
                                    <input
                                      type="text"
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm text-slate-700"
                                      value={editResponsible}
                                      onChange={(e) => setEditResponsible(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400">Descrição</label>
                                  <textarea
                                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm text-slate-700 h-16 resize-none"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">Início</label>
                                    <input
                                      type="date"
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm font-mono text-slate-700"
                                      value={editStartDate}
                                      onChange={(e) => setEditStartDate(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">Fim</label>
                                    <input
                                      type="date"
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm font-mono text-slate-700"
                                      value={editEndDate}
                                      onChange={(e) => setEditEndDate(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">Avance (%)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm text-slate-700"
                                      value={editProgress}
                                      onChange={(e) => setEditProgress(Number(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">Status</label>
                                    <select
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-sm text-slate-700"
                                      value={editStatus}
                                      onChange={(e) => setEditStatus(e.target.value as ScheduleTask['status'])}
                                    >
                                      <option value="PENDING">Pendente</option>
                                      <option value="IN_PROGRESS">Em Andamento</option>
                                      <option value="COMPLETED">Concluído</option>
                                      <option value="DELAYED">Atrasado</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                                  <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg"
                                  >
                                    <X className="w-3.5 h-3.5" /> Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(task)}
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Salvar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Standard read-only list card style */
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5 md:flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-display font-semibold text-slate-800 text-sm md:text-base">{task.title}</h5>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusDetails.style}`}>
                                      {statusDetails.text}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{task.description}</p>
                                  
                                  <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                                    <span className="flex items-center gap-1 font-mono">
                                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                      <span>De {new Date(task.startDate).toLocaleDateString('pt-BR')} até {new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <User className="w-3.5 h-3.5 text-slate-300" />
                                      <span>Resp: <strong className="text-slate-500 font-medium">{task.responsible}</strong></span>
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0">
                                  <div className="flex flex-col items-start md:items-end space-y-1">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Avanço Físico</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-slate-800 text-sm">{task.progress}%</span>
                                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-blue-500 h-full rounded-full transition-all duration-300" 
                                          style={{ width: `${task.progress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>

                                  {isMaster && (
                                    <div className="flex gap-1 animate-fade-in">
                                      <button
                                        onClick={() => startEditing(task)}
                                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition-colors"
                                        title="Editar Atividade"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm("Deseja realmente excluir esta atividade do cronograma?")) {
                                            onDeleteTask(task.id);
                                          }
                                        }}
                                        className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                                        title="Excluir Atividade"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
