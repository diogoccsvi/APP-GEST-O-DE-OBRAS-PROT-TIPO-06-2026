import React, { useState } from 'react';
import { ProjectDetails, RealEstateTax } from '../types';
import { 
  Receipt, 
  Calculator, 
  HelpCircle, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Percent, 
  Building2, 
  BookOpen, 
  Layers, 
  BarChart4
} from 'lucide-react';

interface ImpostosVigentesProps {
  activeProject: ProjectDetails;
  taxes: RealEstateTax[];
  setTaxes: React.Dispatch<React.SetStateAction<RealEstateTax[]>>;
  userRole?: string;
}

export default function ImpostosVigentes({
  activeProject,
  taxes,
  setTaxes,
  userRole
}: ImpostosVigentesProps) {
  const isMaster = userRole === 'MASTER';
  // Simulator inputs
  const [revenueSales, setRevenueSales] = useState(activeProject.plannedBudget * 1.3); // sales revenue estimate
  const [servicesValue, setServicesValue] = useState(activeProject.plannedBudget * 0.4); // typical 40% services
  const [payrollValue, setPayrollValue] = useState(activeProject.plannedBudget * 0.25); // typical 25% payroll
  
  // Custom tax insertion state
  const [isAddingTax, setIsAddingTax] = useState(false);
  const [newTax, setNewTax] = useState({
    name: '',
    description: '',
    rate: 1,
    basis: 'Calculado sobre Faturamento Mensal',
    type: 'FEDERAL' as 'FEDERAL' | 'MUNICIPAL' | 'LABOR' | 'INDEX'
  });

  const handleCreateTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTax.name || newTax.rate <= 0) {
      alert("Por favor, informe ao menos o Nome da taxa e uma Alíquota válida.");
      return;
    }

    const created: RealEstateTax = {
      ...newTax,
      id: `tax-${Date.now()}`
    };

    setTaxes(prev => [...prev, created]);
    setIsAddingTax(false);
    setNewTax({
      name: '',
      description: '',
      rate: 1,
      basis: 'Calculado sobre Faturamento Mensal',
      type: 'FEDERAL'
    });
  };

  const handleResetSimulator = () => {
    setRevenueSales(activeProject.plannedBudget * 1.3);
    setServicesValue(activeProject.plannedBudget * 0.4);
    setPayrollValue(activeProject.plannedBudget * 0.25);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Math calculations for Brazilian standard taxes
  const calculatedRET = revenueSales * 0.04; // Model standard RET is 4.0%
  const calculatedISS = servicesValue * 0.03; // Average municipal ISS is 3.0%
  const calculatedINSS = payrollValue * 0.058; // Social charges average is 5.8% under desonerated setup
  
  const estimatedTaxesSum = calculatedRET + calculatedISS + calculatedINSS;
  const projectBudgetPercentage = (estimatedTaxesSum / activeProject.plannedBudget) * 100;

  return (
    <div className="space-y-6 animate-fade-in" id="taxes-module">
      
      {/* Title block banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm" id="taxes-header">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight">Impostos e Carga Fiscal Vigente</h2>
          <p className="text-xs text-slate-500">Manual regulatório, índices setoriais e simulador tributário para incorporações de imóveis no Brasil</p>
        </div>
        {isMaster ? (
          <button
            onClick={() => setIsAddingTax(current => !current)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <span>Inserir Outro Encargo</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-100 border text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>🔒 Modo Leitura (Apenas RT Master altera)</span>
          </div>
        )}
      </div>

      {/* Brazilian Taxes Reference Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="taxes-grid">
        
        {/* Taxes list and info (Left side) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-500" />
              <span>Regulamentos Fiscais na Incorporação</span>
            </h3>
            <p className="text-[10px] text-slate-400">Principais impostos incidentes sobre a construção e comercialização de unidades</p>
          </div>

          {/* Form to insert custom charge */}
          {isAddingTax && (
            <form onSubmit={handleCreateTax} className="p-4 rounded-lg border border-slate-200 bg-slate-55/40 space-y-3.5 animate-fade-in">
              <h4 className="font-bold text-xs text-slate-800">Novo Tributo / Taxa</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Nome Oficial *</label>
                  <input 
                    type="text"
                    required
                    value={newTax.name}
                    onChange={e => setNewTax({...newTax, name: e.target.value})}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md outline-hidden focus:border-blue-500"
                    placeholder="Ex: DIFAL - Diferencial de Alíquota"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Descrição Normatização</label>
                  <input 
                    type="text"
                    value={newTax.description}
                    onChange={e => setNewTax({...newTax, description: e.target.value})}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md outline-hidden focus:border-blue-500"
                    placeholder="Imposto por compra interestadual..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Alíquota Média (%) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newTax.rate}
                    onChange={e => setNewTax({...newTax, rate: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Base Arbitrada</label>
                  <select
                    value={newTax.basis}
                    onChange={e => setNewTax({...newTax, basis: e.target.value})}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md outline-hidden focus:border-blue-500"
                  >
                    <option value="Calculado sobre Faturamento Mensal">Calculado sobre Venda de Unidades</option>
                    <option value="Calculado sobre Folha de Pagamento">Calculado sobre Folha de Obras</option>
                    <option value="Inclusão direta sobre Notas Fiscais">Inclusão direta s/ Notas de Serviços</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-1.5 pt-2">
                <button type="button" onClick={() => setIsAddingTax(false)} className="px-2.5 py-1.5 bg-slate-105 text-[11px] font-bold rounded-md text-slate-600">
                  Fechar
                </button>
                <button type="submit" className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-[11px] font-bold rounded-md text-white">
                  Registrar Taxa
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3.5">
            {taxes.map(tax => (
              <div key={tax.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-lg border border-slate-105 space-y-1.5 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-sm ${
                      tax.type === 'FEDERAL' ? 'bg-sky-100 text-sky-800' :
                      tax.type === 'MUNICIPAL' ? 'bg-indigo-100 text-indigo-850' : 
                      tax.type === 'INDEX' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {tax.type}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs">{tax.name}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-0.5 border border-slate-200 rounded">
                    {tax.rate.toFixed(2)}%
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-normal">{tax.description}</p>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Base: {tax.basis}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/30 rounded-lg border border-amber-100 flex gap-2.5 text-xs text-slate-600">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed font-normal">
              <p className="font-semibold text-slate-700">Atenção Incorporador (RET):</p>
              <p className="text-[11px]">A adesão ao <strong>Patrimônio de Afetação</strong> possibilita consolidar o RET a uma alíquota especial de 4,00% (englobando IRPJ, CSLL, PIS e COFINS). Caso não haja afetação registrada em cartório, as alíquotas pelo Lucro Presumido podem ultrapassar 5,93%.</p>
            </div>
          </div>
        </div>

        {/* Interactive Tax Burden Simulator (Right side) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5" id="tax-simulator">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-slate-500" />
                <span>Simulador Fiscal do Empreendimento</span>
              </h3>
              <p className="text-[10px] text-slate-400">Projeção de carga com base nos dados do canteiro ativo</p>
            </div>
            <button
              onClick={handleResetSimulator}
              className="text-[10px] font-bold text-blue-650 hover:bg-slate-50 border border-slate-150 px-2 py-1 rounded"
            >
              Restaurar Padrões
            </button>
          </div>

          {/* Active Work Context Display */}
          <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{activeProject.name}</span>
            </span>
            <span className="text-[10px] text-slate-450 font-mono">
              Orçamento de Obra: {formatCurrency(activeProject.plannedBudget)}
            </span>
          </div>

          {/* Input Bars */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1 font-semibold text-slate-500">
                <label className="flex items-center gap-1">VGV Estimado (Faturamento de Vendas)</label>
                <span className="font-mono text-slate-800 font-bold">{formatCurrency(revenueSales)}</span>
              </div>
              <input 
                type="range"
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                min={activeProject.plannedBudget}
                max={activeProject.plannedBudget * 2.5}
                step={50000}
                value={revenueSales}
                onChange={e => setRevenueSales(Number(e.target.value))}
              />
              <span className="text-[10px] text-slate-400">Faturamento da venda dos apartamentos/unidades da incorporadora</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 font-semibold text-slate-500">
                <label>Notas Fiscais de Serviços Médios de Terceiros</label>
                <span className="font-mono text-slate-800 font-bold">{formatCurrency(servicesValue)}</span>
              </div>
              <input 
                type="range"
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                min={activeProject.plannedBudget * 0.1}
                max={activeProject.plannedBudget * 0.8}
                step={25000}
                value={servicesValue}
                onChange={e => setServicesValue(Number(e.target.value))}
              />
              <span className="text-[10px] text-slate-400">Base de incidência do Imposto Municipal ISS (Empreitadas hidráulicas, reboco, sondagens)</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 font-semibold text-slate-500">
                <label>Folha de Pagamento Direta Estimada</label>
                <span className="font-mono text-slate-800 font-bold">{formatCurrency(payrollValue)}</span>
              </div>
              <input 
                type="range"
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                min={activeProject.plannedBudget * 0.05}
                max={activeProject.plannedBudget * 0.5}
                step={10000}
                value={payrollValue}
                onChange={e => setPayrollValue(Number(e.target.value))}
              />
              <span className="text-[10px] text-slate-400">Mão de obra direta de serventes, carpinteiros e engenheiros residentes</span>
            </div>
          </div>

          {/* Breakdown results */}
          <div className="p-4 bg-slate-900 text-white rounded-lg space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-slate-400 border-b border-white/10 pb-1.5">Sumário de Projeção Fiscal</h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-350">
                <span>RET Federal (4,0% de faturamento)</span>
                <span className="font-mono font-semibold">{formatCurrency(calculatedRET)}</span>
              </div>
              <div className="flex justify-between text-slate-350">
                <span>ISS Municipal (Aprox. 3,0% de serviços)</span>
                <span className="font-mono font-semibold">{formatCurrency(calculatedISS)}</span>
              </div>
              <div className="flex justify-between text-slate-350">
                <span>Charges Trabalhistas / Previdenciário (5,8% de folha)</span>
                <span className="font-mono font-semibold">{formatCurrency(calculatedINSS)}</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Carga Tributária Estimada</span>
                  <span className="text-[10px] text-slate-400 block font-normal">Impacto sobre orçamento físico: {projectBudgetPercentage.toFixed(1)}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-display text-emerald-400 block tracking-tight">
                    {formatCurrency(estimatedTaxesSum)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 text-center font-mono">
            * Valores arbitrários meramente instrutivos. Consulte a equipe contábil interna para homologação exaustiva.
          </p>
        </div>

      </div>
    </div>
  );
}
