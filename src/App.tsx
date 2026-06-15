import React, { useState, useEffect } from 'react';
import { 
  ProjectDetails, 
  ConstructionStage, 
  ScheduleTask, 
  Expense, 
  Measurement, 
  PhotoReport,
  Supplier,
  Contract,
  TeamMember,
  RealEstateTax,
  AppUser,
  UserRole
} from './types';
import { 
  INITIAL_PROJECT, 
  INITIAL_STAGES, 
  INITIAL_TASKS, 
  INITIAL_EXPENSES, 
  INITIAL_MEASUREMENTS, 
  INITIAL_PHOTO_REPORTS,
  INITIAL_PROJECTS,
  INITIAL_SUPPLIERS,
  INITIAL_CONTRACTS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TAXES
} from './data';
import Dashboard from './components/Dashboard';
import Cronograma from './components/Cronograma';
import Custos from './components/Custos';
import Medicoes from './components/Medicoes';
import RelatorioFotografico from './components/RelatorioFotografico';
import FornecedoresContratos from './components/FornecedoresContratos';
import ProjetosEquipe from './components/ProjetosEquipe';
import ImpostosVigentes from './components/ImpostosVigentes';
import CapaObra from './components/CapaObra';
import ProjetosDrive from './components/ProjetosDrive';
import { 
  LoginScreen, 
  ProjectUnlockModal, 
  UserProfilesTab 
} from './components/UserManagement';
import { 
  Building2,
  LayoutDashboard, 
  CalendarDays, 
  DollarSign, 
  Scale, 
  Camera, 
  Wrench,
  RotateCcw,
  Sparkles,
  Github,
  Briefcase,
  Users,
  Receipt,
  BookOpen,
  HardDrive,
  LogOut,
  ShieldAlert,
  Key
} from 'lucide-react';

const DEFAULT_USERS: AppUser[] = [
  {
    id: 'user-1',
    name: 'Carlos Silva',
    username: 'carlos',
    role: 'MASTER',
    password: '123',
    crea: 'CREA 123456-D'
  },
  {
    id: 'user-2',
    name: 'Ana Costa',
    username: 'ana',
    role: 'COMPRAS',
    password: '123',
    crea: 'CR-COMP-997'
  },
  {
    id: 'user-3',
    name: 'Roberto Lima',
    username: 'roberto',
    role: 'FINANCEIRO',
    password: '123',
    crea: 'CR-FIN-554'
  },
  {
    id: 'user-4',
    name: 'Eduardo Sousa',
    username: 'eduardo',
    role: 'INVESTIDOR',
    password: '123',
    crea: 'Investidor Líder'
  }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // User system states
  const [usersList, setUsersList] = useState<AppUser[]>(() => {
    const cached = localStorage.getItem('gestao_obras_users');
    return cached ? JSON.parse(cached) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const cached = localStorage.getItem('gestao_obras_current_user');
    return cached ? JSON.parse(cached) : DEFAULT_USERS[0];
  });

  const [unlockedProjectIds, setUnlockedProjectIds] = useState<string[]>(() => {
    const cached = localStorage.getItem('gestao_obras_unlocked_projects');
    return cached ? JSON.parse(cached) : [];
  });

  const [projectToUnlock, setProjectToUnlock] = useState<ProjectDetails | null>(null);

  // State
  const [project, setProject] = useState<ProjectDetails>(() => {
    const cached = localStorage.getItem('gestao_obras_project');
    return cached ? JSON.parse(cached) : INITIAL_PROJECT;
  });

  const [stages, setStages] = useState<ConstructionStage[]>(() => {
    const cached = localStorage.getItem('gestao_obras_stages');
    return cached ? JSON.parse(cached) : INITIAL_STAGES;
  });

  const [tasks, setTasks] = useState<ScheduleTask[]>(() => {
    const cached = localStorage.getItem('gestao_obras_tasks');
    return cached ? JSON.parse(cached) : INITIAL_TASKS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const cached = localStorage.getItem('gestao_obras_expenses');
    return cached ? JSON.parse(cached) : INITIAL_EXPENSES;
  });

  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    const cached = localStorage.getItem('gestao_obras_measurements');
    return cached ? JSON.parse(cached) : INITIAL_MEASUREMENTS;
  });

  const [photos, setPhotos] = useState<PhotoReport[]>(() => {
    const cached = localStorage.getItem('gestao_obras_photos');
    return cached ? JSON.parse(cached) : INITIAL_PHOTO_REPORTS;
  });

  const [projects, setProjects] = useState<ProjectDetails[]>(() => {
    const cached = localStorage.getItem('gestao_obras_projects');
    return cached ? JSON.parse(cached) : INITIAL_PROJECTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const cached = localStorage.getItem('gestao_obras_suppliers');
    return cached ? JSON.parse(cached) : INITIAL_SUPPLIERS;
  });

  const [contracts, setContracts] = useState<Contract[]>(() => {
    const cached = localStorage.getItem('gestao_obras_contracts');
    return cached ? JSON.parse(cached) : INITIAL_CONTRACTS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const cached = localStorage.getItem('gestao_obras_teamMembers');
    return cached ? JSON.parse(cached) : INITIAL_TEAM_MEMBERS;
  });

  const [taxes, setTaxes] = useState<RealEstateTax[]>(() => {
    const cached = localStorage.getItem('gestao_obras_taxes');
    return cached ? JSON.parse(cached) : INITIAL_TAXES;
  });

  // Synchronization with LocalStorage
  useEffect(() => {
    localStorage.setItem('gestao_obras_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gestao_obras_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gestao_obras_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_unlocked_projects', JSON.stringify(unlockedProjectIds));
  }, [unlockedProjectIds]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_project', JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_stages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('gestao_obras_taxes', JSON.stringify(taxes));
  }, [taxes]);

  // Recalculates Spent Costs for stages based on total PAID expenses + updates project total spent budget
  const syncFinancials = (currentExpenses: Expense[]) => {
    const updatedStages = stages.map(stage => {
      const totalSpentForStage = currentExpenses
        .filter(exp => exp.stageId === stage.id && exp.status === 'PAID')
        .reduce((sum, exp) => sum + exp.value, 0);
      return {
        ...stage,
        spentCost: totalSpentForStage
      };
    });

    setStages(updatedStages);

    const totalSpentBudget = currentExpenses
      .filter(e => e.status === 'PAID')
      .reduce((sum, e) => sum + e.value, 0);

    setProject(prev => ({
      ...prev,
      spentBudget: totalSpentBudget
    }));
  };

  const handleSelectProject = (projId: string) => {
    const updatedProjects = projects.map(p => p.id === project.id ? project : p);
    setProjects(updatedProjects);
    const found = updatedProjects.find(p => p.id === projId);
    if (found) {
      const isUnlocked = !found.accessPassword || unlockedProjectIds.includes(projId);
      if (!isUnlocked) {
        setProjectToUnlock(found);
      } else {
        setProject(found);
      }
    }
  };

  const handleUnlockProjectSuccess = (projId: string) => {
    setUnlockedProjectIds(prev => {
      const next = prev.includes(projId) ? prev : [...prev, projId];
      return next;
    });
    const found = projects.find(p => p.id === projId);
    if (found) {
      setProject(found);
    }
    setProjectToUnlock(null);
  };

  const handleUpdateProject = (updated: ProjectDetails) => {
    setProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = (projId: string) => {
    if (projects.length <= 1) {
      alert("Não é possível excluir o único empreendimento ativo. Crie outra obra antes de excluir esta.");
      return;
    }
    if (confirm("Tem certeza de que deseja excluir esta obra? Todos os dados vinculados a ela serão removidos.")) {
      const remaining = projects.filter(p => p.id !== projId);
      setProjects(remaining);
      
      // If we deleted the active project, select another one
      if (project.id === projId) {
        setProject(remaining[0]);
      }
    }
  };

  // Reset helper
  const handleResetToDefaults = () => {
    if (confirm("Gostaria de redefinir o diário e o cronograma para as informações originais da demonstração?")) {
      setProject(INITIAL_PROJECT);
      setStages(INITIAL_STAGES);
      setTasks(INITIAL_TASKS);
      setExpenses(INITIAL_EXPENSES);
      setMeasurements(INITIAL_MEASUREMENTS);
      setPhotos(INITIAL_PHOTO_REPORTS);
      setProjects(INITIAL_PROJECTS);
      setSuppliers(INITIAL_SUPPLIERS);
      setContracts(INITIAL_CONTRACTS);
      setTeamMembers(INITIAL_TEAM_MEMBERS);
      setTaxes(INITIAL_TAXES);
      setActiveTab('dashboard');
    }
  };

  // Callback: Add a task
  const handleAddTask = (newTask: Omit<ScheduleTask, 'id'>) => {
    const added: ScheduleTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    const updated = [added, ...tasks];
    setTasks(updated);
  };

  // Callback: Update a task
  const handleUpdateTask = (updatedTask: ScheduleTask) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(updated);
  };

  // Callback: Delete a task
  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
  };

  // Callback: Add an expense
  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const added: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`
    };
    const updated = [added, ...expenses];
    setExpenses(updated);
    syncFinancials(updated);
  };

  // Callback: Delete an expense
  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    syncFinancials(updated);
  };

  // Callback: Update expense paid status
  const handleUpdateExpenseStatus = (id: string, newStatus: Expense['status']) => {
    const updated = expenses.map(e => e.id === id ? { ...e, status: newStatus } : e);
    setExpenses(updated);
    syncFinancials(updated);
  };

  // Callback: Add measurement
  const handleAddMeasurement = (newMeas: Omit<Measurement, 'id'>) => {
    const added: Measurement = {
      ...newMeas,
      id: `meas-${Date.now()}`
    };
    setMeasurements(prev => [...prev, added]);
  };

  // Callback: Update measurement status (Approve / Reject)
  const handleUpdateMeasurementStatus = (id: string, status: Measurement['status']) => {
    const updatedMeasurements = measurements.map(m => m.id === id ? { ...m, status } : m);
    setMeasurements(updatedMeasurements);

    if (status === 'APPROVED') {
      const measurement = measurements.find(m => m.id === id);
      if (measurement) {
        // 1. Update progress of targeted stage
        const targetStage = stages.find(s => s.id === measurement.stageId);
        if (targetStage) {
          const updatedStages = stages.map(s => {
            if (s.id === measurement.stageId) {
              const newProgress = Math.min(100, s.progress + measurement.measuredPercentage);
              return {
                ...s,
                progress: newProgress
              };
            }
            return s;
          });
          setStages(updatedStages);
        }

        // 2. Insert a correspond paid labor expense automatically!
        const autoLaborExpense: Expense = {
          id: `exp-auto-${Date.now()}`,
          stageId: measurement.stageId,
          title: `Liberação de Mão de Obra - Med. +${measurement.measuredPercentage}%`,
          category: 'LABOR',
          value: measurement.valueAmount,
          date: measurement.date,
          provider: measurement.responsible.split('(')[0].trim(),
          status: 'PAID'
        };
        const currentExpenses = [autoLaborExpense, ...expenses];
        setExpenses(currentExpenses);
        syncFinancials(currentExpenses);
      }
    }
  };

  // Callback: Add Photo log
  const handleAddPhoto = (newPhoto: Omit<PhotoReport, 'id' | 'timestamp'>) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const added: PhotoReport = {
      ...newPhoto,
      id: `photo-${Date.now()}`,
      timestamp: `${formattedDate} ${formattedTime}`
    };
    setPhotos(prev => [added, ...prev]);
  };

  // Callback: Delete photo
  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };


  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden" id="app-root">
      
      {/* Sidebar Nav (Desktop only) */}
      <aside className="hidden" id="app-sidebar-nav">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-550 rounded-lg flex items-center justify-center font-bold text-white shrink-0">E</div>
          <span className="text-xl font-bold tracking-tight text-white font-display">EdificaPro</span>
        </div>
        
        <div className="mt-8 flex-1">
          <div className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Menu Principal</div>
          <div className="space-y-11">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('capa')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'capa'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Capa da Obra & PDF</span>
            </button>
            
            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Cronograma</span>
            </button>

            <button
              onClick={() => setActiveTab('costs')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'costs'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Custos & Financeiro</span>
            </button>

            <button
              onClick={() => setActiveTab('measurements')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'measurements'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Medições por Etapa</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Relatórios Fotográficos</span>
            </button>

            <button
              onClick={() => setActiveTab('suppliers')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'suppliers'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Fornecedores & Contratos</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Obras</span>
            </button>

            <button
              onClick={() => setActiveTab('drive-projects')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'drive-projects'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Projetos & Plantas (Drive)</span>
            </button>

            <button
              onClick={() => setActiveTab('taxes')}
              className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                activeTab === 'taxes'
                  ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-450 font-medium'
                  : 'text-slate-305 hover:bg-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Impostos Vigentes</span>
            </button>
          </div>
        </div>

        {/* User profile footer - customized match */}
        <div className="p-6 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-300">ENG</div>
            <div>
              <div className="text-sm font-medium text-white">Eng. Ricardo Silva</div>
              <div className="text-xs text-slate-400 font-mono">CREA 123456-D</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area next to sidebar */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden" id="app-main-view">
        {/* Unified Top Navigation & Header - ALWAYS sticky at the top */}
        <header className="bg-slate-900 text-white border-b border-slate-850 shadow-md flex flex-col shrink-0 z-50 animate-fade-in" id="app-top-nav-bar">
          {/* Row 1: Logo & Brand, Active Project, Action buttons, profile */}
          <div className="px-4 py-3 md:px-6 flex items-center justify-between border-b border-slate-800/60 flex-wrap gap-y-2.5 gap-x-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shrink-0 shadow-xs shadow-blue-500/20">E</div>
              <span className="text-lg font-bold tracking-tight text-white font-display">EdificaPro</span>
            </div>

            {/* Active project badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 max-w-xs md:max-w-md truncate">
              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">OBRA:</span>
              <span className="text-xs font-bold text-white truncate">{project.name}</span>
              <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-black rounded uppercase tracking-wider shrink-0">
                Ativa
              </span>
            </div>

            {/* Access Switcher & Actions & Logged in Indicator */}
            <div className="flex items-center gap-3.5 flex-wrap">
              {/* User Access Profile Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="user-role-select" className="inline text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Acesso:</label>
                <select
                  id="user-role-select"
                  value={currentUser?.id || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const found = usersList.find(u => u.id === selectedId);
                    setCurrentUser(found || null);
                  }}
                  className="bg-slate-800 text-white text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-all animate-none"
                >
                  <option value="">Sem Acesso (Modo Leitura)</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({(u.role)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset buttons */}
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 py-1.5 px-3 rounded-lg transition-all cursor-pointer font-semibold shadow-xs"
                title="Redefinir para de demonstração recomendados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-semibold">Redefinir Dados</span>
              </button>
            </div>
          </div>

          {/* Row 2: Scrolling Horizontal Tabs Menu */}
          <nav className="bg-slate-950 px-4 md:px-6 py-1.5 flex items-center overflow-x-auto gap-1 scrollbar-thin select-none snap-x" id="app-nav-tabs">
            {[
              { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
              { id: 'capa', label: 'Capa & PDF', icon: BookOpen },
              { id: 'schedule', label: 'Cronograma', icon: CalendarDays },
              { id: 'costs', label: 'Custos', icon: DollarSign },
              { id: 'measurements', label: 'Medições', icon: Scale },
              { id: 'photos', label: 'Relatórios', icon: Camera },
              { id: 'suppliers', label: 'Fornecedores', icon: Briefcase },
              { id: 'projects', label: 'Obras', icon: Building2 },
              { id: 'drive-projects', label: 'Projetos (Drive)', icon: HardDrive },
              { id: 'taxes', label: 'Impostos', icon: Receipt },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer snap-start ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Mobile menu bar */}
        <nav className="hidden" id="app-nav-tabs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Painel</span>
          </button>
          <button
            onClick={() => setActiveTab('capa')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'capa' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Capa & PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'schedule' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Cronograma</span>
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'costs' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Custos</span>
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'measurements' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Medições</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'photos' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Relatórios</span>
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'suppliers' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Fornecedores</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'projects' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Obras</span>
          </button>
          <button
            onClick={() => setActiveTab('drive-projects')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'drive-projects' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <HardDrive className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Projetos (Drive)</span>
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'taxes' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Receipt className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Impostos</span>
          </button>
        </nav>

        {/* Primary Workspace Viewport Container */}
        <main className="flex-1 min-w-0 p-6 overflow-y-auto bg-slate-50" id="main-workbench">
          {activeTab === 'dashboard' && (
            <Dashboard 
              project={project} 
              projects={projects}
              onSelectProject={handleSelectProject}
              stages={stages} 
              tasks={tasks} 
              expenses={expenses} 
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'capa' && (
            <CapaObra
              project={project}
              onUpdateProject={handleUpdateProject}
              stages={stages}
              tasks={tasks}
              expenses={expenses}
              photos={photos}
              teamMembers={teamMembers}
              taxes={taxes}
              userRole={currentUser?.role}
            />
          )}

          {activeTab === 'schedule' && (
            <Cronograma 
              tasks={tasks}
              stages={stages}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              userRole={currentUser?.role}
            />
          )}

          {activeTab === 'costs' && (
            <Custos 
              expenses={expenses}
              stages={stages}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onUpdateExpenseStatus={handleUpdateExpenseStatus}
              userRole={currentUser?.role}
            />
          )}

          {activeTab === 'measurements' && (
            <Medicoes 
              stages={stages}
              measurements={measurements}
              onAddMeasurement={handleAddMeasurement}
              onUpdateMeasurementStatus={handleUpdateMeasurementStatus}
              userRole={currentUser?.role}
            />
          )}

           {activeTab === 'photos' && (
            <RelatorioFotografico 
              stages={stages}
              photos={photos}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
              userRole={currentUser?.role}
            />
          )}

          {activeTab === 'suppliers' && (
            <FornecedoresContratos
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              contracts={contracts}
              setContracts={setContracts}
              userRole={currentUser?.role}
            />
          )}

          {activeTab === 'projects' && (
            <ProjetosEquipe
              projects={projects}
              activeProject={project}
              onSelectProject={(projId) => {
                handleSelectProject(projId);
                setActiveTab('dashboard');
              }}
              onAddProject={(newProj) => {
                setProjects(prev => [...prev, newProj]);
                setProject(newProj);
                setActiveTab('dashboard');
              }}
              onDeleteProject={handleDeleteProject}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              userRole={currentUser?.role}
            />
          )}

          {activeTab === 'drive-projects' && (
            <ProjetosDrive 
              activeProject={project}
            />
          )}

          {activeTab === 'taxes' && (
            <ImpostosVigentes
              activeProject={project}
              taxes={taxes}
              setTaxes={setTaxes}
              userRole={currentUser?.role}
            />
          )}
        </main>

        <footer className="bg-white border-t border-slate-200 py-3 text-center shrink-0" id="app-footer-bar">
          <p className="text-xs text-slate-400 font-medium">
            EdificaPro MestreObras • Sistema Integrado de Gestão • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
