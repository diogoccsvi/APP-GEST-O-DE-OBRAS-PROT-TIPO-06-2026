import React, { useState } from 'react';
import { Expense, StageId, CostCategory, ConstructionStage } from '../types';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Filter, 
  Search, 
  Building2, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  Download,
  X
} from 'lucide-react';

interface CustosProps {
  expenses: Expense[];
  stages: ConstructionStage[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateExpenseStatus: (id: string, status: Expense['status']) => void;
  userRole?: string;
}

export default function Custos({ expenses, stages, onAddExpense, onDeleteExpense, onUpdateExpenseStatus, userRole }: CustosProps) {
  const isWritable = userRole !== 'INVESTIDOR';
  // Filter variables
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Expense form state
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStageId, setNewStageId] = useState<StageId>('INFRA');
  const [newCategory, setNewCategory] = useState<CostCategory>('MATERIAL');
  const [newValue, setNewValue] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProvider, setNewProvider] = useState('');
  const [newStatus, setNewStatus] = useState<Expense['status']>('PAID');

  const stageTranslations: { [key: string]: string } = {
    INFRA: 'Infraestrutura & Fundações',
    ESTRU: 'Superestrutura & Lajes',
    ALVEN: 'Alvenaria & Fechamentos',
    INSTA: 'Instalações Hidrotérmicas & Elétricas',
    ACABA: 'Revestimentos & Acabamento',
    COMUM: 'Garagens & Áreas Comuns'
  };

  const categoryTranslations: { [key: string]: string } = {
    MATERIAL: 'Material de Obra',
    LABOR: 'Mão de Obra',
    EQUIPMENT: 'Locação Equipamentos',
    ADMIN: 'Custos Administrativos / Taxas',
    OTHER: 'Outros Insumos'
  };

  const categoryBadgeColors: { [key: string]: string } = {
    MATERIAL: 'bg-blue-50 text-blue-700 border-blue-100',
    LABOR: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    EQUIPMENT: 'bg-amber-50 text-amber-700 border-amber-100',
    ADMIN: 'bg-purple-50 text-purple-700 border-purple-100',
    OTHER: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  // Calculations
  const totalPlannedBudget = stages.reduce((acc, stage) => acc + stage.plannedCost, 0);
  const totalPaid = expenses
    .filter(e => e.status === 'PAID')
    .reduce((acc, current) => acc + current.value, 0);
  const totalPending = expenses
    .filter(e => e.status === 'PENDING')
    .reduce((acc, current) => acc + current.value, 0);
  const grandTotalExpenses = totalPaid + totalPending;

  // Filtered expenses
  const filteredExpenses = expenses.filter(exp => {
    const stageMatch = selectedStageFilter === 'ALL' || exp.stageId === selectedStageFilter;
    const catMatch = selectedCategoryFilter === 'ALL' || exp.category === selectedCategoryFilter;
    const statusMatch = selectedStatusFilter === 'ALL' || exp.status === selectedStatusFilter;
    const searchMatch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exp.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return stageMatch && catMatch && statusMatch && searchMatch;
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newValue || Number(newValue) <= 0 || !newProvider.trim()) {
      alert("Por favor preencha todos os campos corretamente!");
      return;
    }

    onAddExpense({
      stageId: newStageId,
      title: newTitle,
      category: newCategory,
      value: Number(newValue),
      date: newDate,
      provider: newProvider,
      status: newStatus
    });

    // Reset Form
    setNewTitle('');
    setNewValue('');
    setNewProvider('');
    setIsAddingExpense(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const downloadExpensesCSV = () => {
    // Generate simple CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID;Etapa;Categoria;Descricao;Fornecedor;Valor;Data;Status\n";

    expenses.forEach(exp => {
      const stageName = stageTranslations[exp.stageId] || exp.stageId;
      const catName = categoryTranslations[exp.category] || exp.category;
      csvContent += `${exp.id};${stageName};${catName};${exp.title};${exp.provider};${exp.value};${exp.date};${exp.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "controle_custos_obra.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="costs-panel">
      {/* Top Banner with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-md">
        <div className="space-y-1 pl-2">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Orçamento Geral Planejado</span>
          <p className="text-3xl font-display font-bold tracking-tight">{formatCurrency(totalPlannedBudget)}</p>
          <p className="text-slate-500 text-[11px] font-mono">Definido no plano original de 1.250 m²</p>
        </div>
        
        <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-700/60 py-4 md:py-0 px-2 md:px-6">
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Total Pago
          </span>
          <p className="text-3xl font-display font-bold tracking-tight text-emerald-300">{formatCurrency(totalPaid)}</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-400 h-full rounded-full" 
              style={{ width: `${Math.min(100, (totalPaid / totalPlannedBudget) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1 pl-2 md:pl-4">
          <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" /> A Pagar / Pendente
          </span>
          <p className="text-3xl font-display font-bold tracking-tight text-amber-300">{formatCurrency(totalPending)}</p>
          <p className="text-slate-400 text-xs mt-1">Saldo Remanescente: {formatCurrency(Math.max(0, totalPlannedBudget - totalPaid))}</p>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800">Controle de Custos e Insumos</h2>
          <p className="text-xs text-slate-500">Planilha financeira, orçamentos setoriais e lançamentos de despesas</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={downloadExpensesCSV}
            className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            title="Download Planilha em CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          
          {isWritable ? (
            <button
              onClick={() => setIsAddingExpense(!isAddingExpense)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {isAddingExpense ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isAddingExpense ? "Cancelar" : "Lançar Despesa"}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-100 border text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <span>🔒 Apenas Leitura (Investidor)</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Form Drawer */}
      {isAddingExpense && (
        <form onSubmit={handleCreateExpense} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-4 max-w-4xl animate-fade-in mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold font-display text-slate-800 text-base">Novo Lançamento Financeiro</h3>
            <p className="text-xs text-slate-400">Insira as notas fiscais, faturas de mão de obra ou locações de equipamentos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Item / Descrição da Despesa</label>
              <input
                type="text"
                required
                placeholder="Ex: Nota Fiscal 1450 - Cimento CP-II Votorantim"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Fornecedor / Prestador de Serviço</label>
              <input
                type="text"
                required
                placeholder="Ex: Comercial de Areias Sul Ltda"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CostCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="MATERIAL">Material</option>
                <option value="LABOR">Mão de Obra</option>
                <option value="EQUIPMENT">Equipamento</option>
                <option value="ADMIN">Taxas/Admin</option>
                <option value="OTHER">Outros</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Valor R$</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 12450.00"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Data Competência</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status Fluxo</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Expense['status'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="PAID">Pago (Liquidado)</option>
                <option value="PENDING">A Pagar (Agendado)</option>
                <option value="ESTIMATED">Estimado / Orçamento</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingExpense(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Registrar Compra
            </button>
          </div>
        </form>
      )}

      {/* Advanced Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por descrição da despesa ou nome do fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-55 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">FILTRAR:</span>
          </div>

          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-600 focus:outline-none "
          >
            <option value="ALL">Todas as Etapas</option>
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-600 focus:outline-none"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="MATERIAL">Material</option>
            <option value="LABOR">Mão de Obra</option>
            <option value="EQUIPMENT">Equipamentos</option>
            <option value="ADMIN">Administrativo</option>
            <option value="OTHER">Outros</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-600 focus:outline-none"
          >
            <option value="ALL">Todos os status</option>
            <option value="PAID">Pago</option>
            <option value="PENDING">A Pagar</option>
            <option value="ESTIMATED">Estimado</option>
          </select>
        </div>
      </div>

      {/* Expense List Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="expense-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider border-b border-slate-100">
                <th className="px-5 py-4">Data / Nota</th>
                <th className="px-5 py-4">Item & Fornecedor</th>
                <th className="px-5 py-4">Etapa da Obra</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4 text-right">Valor</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Nenhuma despesa ou nota cadastrada com as opções de filtragem atuais.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Date & competency */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-slate-600">{new Date(exp.date).toLocaleDateString('pt-BR')}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Competência</span>
                        </div>
                      </td>

                      {/* Description & supplier */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 leading-snug">{exp.title}</span>
                          <span className="text-slate-500 text-xs flex mt-0.5">{exp.provider}</span>
                        </div>
                      </td>

                      {/* Construction Stage details */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {exp.stageId === 'INFRA' ? 'Fundações' : 
                          exp.stageId === 'ESTRU' ? 'Superestrutura' : 
                          exp.stageId === 'ALVEN' ? 'Alvenaria' : 
                          exp.stageId === 'INSTA' ? 'Instalações' : 
                          exp.stageId === 'ACABA' ? 'Acabamento' : 'Áreas Comuns'}
                        </span>
                      </td>

                      {/* Category Pill tag */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${categoryBadgeColors[exp.category]}`}>
                          {categoryTranslations[exp.category] ? categoryTranslations[exp.category].split(' ')[0] : exp.category}
                        </span>
                      </td>

                      {/* Monetary Value */}
                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-800">
                        {formatCurrency(exp.value)}
                      </td>

                      {/* Expense State details */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {isWritable ? (
                          <select
                            value={exp.status}
                            onChange={(e) => onUpdateExpenseStatus(exp.id, e.target.value as Expense['status'])}
                            className={`text-xs font-semibold p-1 rounded-md border text-center transition-colors focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                              exp.status === 'PAID' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-150 shadow-sm' 
                                : exp.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 border-amber-150'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="PAID">✔ Pago</option>
                            <option value="PENDING">⌛ A Pagar</option>
                            <option value="ESTIMATED">✎ Orçado</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase border ${
                            exp.status === 'PAID' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                              : exp.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border-amber-150'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {exp.status === 'PAID' ? 'Pago' : exp.status === 'PENDING' ? 'A Pagar' : 'Orçado'}
                          </span>
                        )}
                      </td>

                      {/* Delete actions */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {isWritable ? (
                          <button
                            onClick={() => {
                              if (confirm(`Deseja mesmo remover a despesa "${exp.title}"?`)) {
                                onDeleteExpense(exp.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-650 p-1.5 hover:bg-red-50 rounded transition-colors inline-block"
                            title="Excluir Registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] italic text-slate-400">Restrito</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
