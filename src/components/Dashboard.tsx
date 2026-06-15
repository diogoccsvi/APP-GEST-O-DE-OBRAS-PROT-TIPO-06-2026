import React from 'react';
import { ProjectDetails, ConstructionStage, ScheduleTask, Expense } from '../types';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Maximize2, 
  Home, 
  Car, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  project: ProjectDetails;
  projects?: ProjectDetails[];
  onSelectProject?: (projId: string) => void;
  stages: ConstructionStage[];
  tasks: ScheduleTask[];
  expenses: Expense[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ project, projects, onSelectProject, stages, tasks, expenses, onNavigate }: DashboardProps) {
  // Calculate weighted physical progress
  const totalPhysicalProgress = stages.reduce((acc, stage) => {
    return acc + (stage.progress * (stage.weight / 100));
  }, 0);

  // Financial calculations
  const totalPlanned = stages.reduce((acc, stage) => acc + stage.plannedCost, 0);
  const totalSpent = expenses.reduce((acc, exp) => exp.status === 'PAID' ? acc + exp.value : acc, 0);
  const estimatedRemaining = expenses.reduce((acc, exp) => exp.status === 'PENDING' ? acc + exp.value : acc, 0);
  const financialCommitment = totalSpent + estimatedRemaining;

  // Budget status
  const budgetUsagePercent = totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0;
  const isOverBudget = totalSpent > totalPlanned;

  // Tasks counts
  const totalTasksCount = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const delayedTasks = tasks.filter(t => t.status === 'DELAYED' || (t.status === 'IN_PROGRESS' && new Date(t.endDate) < new Date())).length;

  // Format currencies helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Chart data: Stage Planned vs Spent
  const stageFinancialsData = stages.map(stage => {
    // calculate actual spent for this stage id
    const spentOnStage = expenses
      .filter(e => e.stageId === stage.id && e.status === 'PAID')
      .reduce((curr, e) => curr + e.value, 0);

    return {
      name: stage.id === 'INFRA' ? 'Fundações' : 
            stage.id === 'ESTRU' ? 'Estrutura' : 
            stage.id === 'ALVEN' ? 'Alvenaria' : 
            stage.id === 'INSTA' ? 'Instalações' : 
            stage.id === 'ACABA' ? 'Acabamento' : 'Áreas Comuns',
      Orçado: stage.plannedCost,
      Gasto: spentOnStage
    };
  });

  // Chart data: Expenses by Category
  const expensesByCategory = expenses
    .filter(e => e.status === 'PAID')
    .reduce((acc: { [key: string]: number }, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.value;
      return acc;
    }, {});

  const categoryTranslations: { [key: string]: string } = {
    MATERIAL: 'Materiais',
    LABOR: 'Mão de Obra',
    EQUIPMENT: 'Equipamentos',
    ADMIN: 'Administrativo',
    OTHER: 'Outros'
  };

  const categoryColors: { [key: string]: string } = {
    MATERIAL: '#3b82f6', // Blue
    LABOR: '#10b981', // Emerald
    EQUIPMENT: '#f59e0b', // Amber
    ADMIN: '#8b5cf6', // Purple
    OTHER: '#64748b' // Slate
  };

  const categoryData = Object.keys(expensesByCategory).map(key => ({
    name: categoryTranslations[key] || key,
    value: expensesByCategory[key],
    color: categoryColors[key] || '#cbd5e1'
  }));

  // Date diff for expected days left
  const getDaysRemaining = () => {
    const today = new Date();
    const end = new Date(project.expectedEndDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6" id="dashboard-root">
      {/* Overview Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="project-overview-panel">
        <div className="absolute top-0 right-0 p-8 opacity-5 font-bold text-slate-900 pointer-events-none" style={{ fontSize: '12rem' }}>
          {project.totalArea}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {projects && onSelectProject && projects.length > 0 && (
              <div className="flex items-center gap-2 mb-3 bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-2.5 w-fit">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Alternar Obra:</span>
                <select
                  value={project.id}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="text-xs font-semibold text-blue-700 bg-transparent border-0 ring-0 focus:ring-0 outline-none cursor-pointer hover:text-blue-800 transition-colors"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm tracking-wide uppercase">
              <Building2 className="w-4 h-4" />
              <span>Empreendimento até 1500m²</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-slate-800 mt-1">{project.name}</h1>
            <p className="text-slate-500 flex items-center gap-1.5 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span>{project.address}</span>
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-3 gap-6 text-center w-full md:w-auto">
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> ÁREA
              </div>
              <p className="text-slate-800 font-bold text-sm tracking-tight">{project.totalArea} m²</p>
            </div>
            <div className="border-x border-slate-200 px-4">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                <Home className="w-3.5 h-3.5 text-slate-400" /> APTOS
              </div>
              <p className="text-slate-800 font-bold text-sm tracking-tight">{project.apartmentsCount} Unids</p>
            </div>
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                <Car className="w-3.5 h-3.5 text-slate-400" /> VAGAS
              </div>
              <p className="text-slate-800 font-bold text-sm tracking-tight">{project.garagesCount} Vagas</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-700">Coordenação / Resp. Técnico:</span>{' '}
            <span className="text-slate-900 font-medium">
              {project.coordinator || 'Eng. Ricardo Silva'}
            </span>{' '}
            <span className="text-slate-400">
              ({project.crea || 'Registrado CREA SC-12345'})
            </span>
          </div>
          <div className="md:text-right">
            <span className="font-semibold text-slate-700">Enquadramento Tributário Recomendado:</span>{' '}
            <span className="text-blue-700 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              Regime Especial RET (Alíquota Unificada de 4,00%)
            </span>
          </div>
        </div>
        <p className="mt-2 text-slate-600 text-xs">
          <strong>Condições & Áreas Comuns:</strong> {project.commonAreasDescription}
        </p>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* Physical Progress KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium tracking-wider uppercase">Progresso Físico</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-slate-800">{totalPhysicalProgress.toFixed(1)}%</span>
              <span className="text-emerald-600 font-semibold text-xs flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> Ponderado
              </span>
            </div>
            <div className="w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: `${totalPhysicalProgress}%` }}></div>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl animate-pulse">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Cost KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium tracking-wider uppercase">Despesa Paga (Fluxo)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display text-slate-800">{formatCurrency(totalSpent)}</span>
            </div>
            <span className="text-slate-500 text-xs flex mt-1">
              Orçado: {formatCurrency(totalPlanned)}
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Budget Status KPI */}
        <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-200 ${isOverBudget ? 'border-red-100 lg:border-l-4 lg:border-l-red-500' : 'hover:border-slate-200'}`}>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium tracking-wider uppercase">Uso do Orçamento</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-2xl font-bold font-display ${isOverBudget ? 'text-red-600' : 'text-slate-800'}`}>
                {budgetUsagePercent.toFixed(1)}%
              </span>
              {isOverBudget ? (
                <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> Estourado
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" /> Saudável
                </span>
              )}
            </div>
            <span className="text-slate-500 text-xs">
              Disponível: {formatCurrency(Math.max(0, totalPlanned - totalSpent))}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${isOverBudget ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            <Hourglass className="w-6 h-6" />
          </div>
        </div>

        {/* Time Remaining KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-purple-200 transition-colors duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium tracking-wider uppercase">Dias Restantes (Aprox)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display text-slate-800">{daysRemaining}</span>
              <span className="text-slate-500 text-xs">dias</span>
            </div>
            <span className="text-slate-500 text-xs flex mt-1">
              Final previsto: {new Date(project.expectedEndDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts and Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart: Budget Orçado vs Realizado */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-base">Análise Financeira por Etapa (Orçado x Pago)</h3>
              <p className="text-xs text-slate-500">Valores unitários em moeda local (R$)</p>
            </div>
            <button 
              onClick={() => onNavigate('costs')}
              className="text-xs font-semibold text-blue-650 hover:bg-blue-50 border border-blue-200/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Ver custos
            </button>
          </div>
          <div className="h-64 sm:h-80" id="budget-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageFinancialsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(value) => `R$ ${value >= 1000 ? `${value / 1000}k` : value}`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Orçado" fill="#95a5b5" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Gasto" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-display font-semibold text-slate-800 text-base mb-1">Distribuição de Despesas</h3>
          <p className="text-xs text-slate-500 mb-4 font-normal">Divisão baseada em categorias de insumos pagos</p>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Pago Total</span>
              <p className="text-base font-bold text-slate-900 font-display mt-0.5">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 overflow-y-auto max-h-36 pr-1">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-slate-800 font-semibold">{formatCurrency(item.value)}</span>
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({((item.value / (totalSpent || 1)) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Task Alerts & Active stages progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stages Real Progress Check */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-base">Avanço Físico das Etapas</h3>
              <p className="text-xs text-slate-500">Progresso calculado vs peso ponderado no empreendimento</p>
            </div>
            <button 
              onClick={() => onNavigate('measurements')}
              className="text-xs font-semibold text-blue-650 hover:bg-blue-50 border border-blue-200/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Medir etapas
            </button>
          </div>
          <div className="space-y-4">
            {stages.map((stage) => {
              const spentStageVal = expenses
                .filter(e => e.stageId === stage.id && e.status === 'PAID')
                .reduce((val, e) => val + e.value, 0);
              
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{
                        backgroundColor: stage.color === 'emerald' ? '#10b981' :
                                        stage.color === 'blue' ? '#3b82f6' :
                                        stage.color === 'amber' ? '#f59e0b' :
                                        stage.color === 'indigo' ? '#6366f1' :
                                        stage.color === 'purple' ? '#a855f7' : '#14b8a6'
                      }}></span>
                      <span className="font-semibold text-slate-800">{stage.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1 py-0.2 rounded font-mono font-bold">Peso: {stage.weight}%</span>
                    </span>
                    <span className="font-mono text-slate-850 font-bold">{stage.progress}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-550" 
                      style={{ 
                        width: `${stage.progress}%`,
                        backgroundColor: stage.color === 'emerald' ? '#10b981' :
                                        stage.color === 'blue' ? '#3b82f6' :
                                        stage.color === 'amber' ? '#f59e0b' :
                                        stage.color === 'indigo' ? '#6366f1' :
                                        stage.color === 'purple' ? '#a855f7' : '#14b8a6'
                      }}
                    ></div>
                  </div>
                  {/* Budget usage inline */}
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Gasto: {formatCurrency(spentStageVal)}</span>
                    <span>Orçamento: {formatCurrency(stage.plannedCost)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task alerts and active work */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-base">Atividades Ativas & Alertas</h3>
              <p className="text-xs text-slate-500">Cronograma de tarefas em andamento ou atrasadas</p>
            </div>
            <button 
              onClick={() => onNavigate('schedule')}
              className="text-xs font-semibold text-blue-650 hover:bg-blue-50 border border-blue-200/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Ver cronograma
            </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {/* Show Delayed/Warning Tasks first, then In Progress */}
            {tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED').length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma tarefa ativa ou atrasada no momento. Todas estão planejadas ou concluídas.
              </div>
            ) : (
              tasks
                .filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED')
                .map((task) => {
                  const isOverdue = new Date(task.endDate) < new Date() && task.status !== 'COMPLETED';
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`p-3.5 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
                        isOverdue || task.status === 'DELAYED'
                          ? 'border-red-200 bg-red-50/50 hover:bg-red-50' 
                          : 'border-slate-200 bg-slate-50/40 hover:bg-slate-55'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isOverdue || task.status === 'DELAYED' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-blue-105 text-blue-700'
                          }`}>
                            {isOverdue || task.status === 'DELAYED' ? 'ATRASO' : 'EM ANDAMENTO'}
                          </span>
                          <span className="text-slate-400 text-xs font-semibold">{task.stageId === 'INFRA' ? 'Fundações' : 
                                  task.stageId === 'ESTRU' ? 'Estrutura' : 
                                  task.stageId === 'ALVEN' ? 'Alvenaria' : 
                                  task.stageId === 'INSTA' ? 'Instalações' : 
                                  task.stageId === 'ACABA' ? 'Acabamento' : 'Áreas Comuns'}</span>
                        </div>
                        <h4 className="font-semibold text-slate-850 text-sm">{task.title}</h4>
                        <p className="text-slate-500 text-xs">{task.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Fim: {new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>Resp: {task.responsible}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-700 text-xs font-bold">{task.progress}%</span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
