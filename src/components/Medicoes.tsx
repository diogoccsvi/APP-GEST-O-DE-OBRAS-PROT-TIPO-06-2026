import React, { useState } from 'react';
import { Measurement, StageId, ConstructionStage } from '../types';
import { 
  Plus, 
  Check, 
  X, 
  Calendar, 
  User, 
  Gauge, 
  TrendingUp, 
  AlertTriangle,
  ClipboardList,
  ShieldAlert,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface MedicoesProps {
  stages: ConstructionStage[];
  measurements: Measurement[];
  onAddMeasurement: (measurement: Omit<Measurement, 'id'>) => void;
  onUpdateMeasurementStatus: (id: string, status: Measurement['status']) => void;
  userRole?: string;
}

export default function Medicoes({ stages, measurements, onAddMeasurement, onUpdateMeasurementStatus, userRole }: MedicoesProps) {
  const isWritable = userRole === 'MASTER' || userRole === 'FINANCEIRO';
  // Add Measurement state
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newStageId, setNewStageId] = useState<StageId>('ALVEN');
  const [newPercentage, setNewPercentage] = useState('');
  const [newResponsible, setNewResponsible] = useState('Eng. Pedro S. Mendonça (CREA 123456-RS)');
  const [newNotes, setNewNotes] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const stageTranslations: { [key: string]: string } = {
    INFRA: 'Infraestrutura & Fundações',
    ESTRU: 'Superestrutura & Lajes',
    ALVEN: 'Alvenaria & Fechamentos',
    INSTA: 'Instalações Hidrotérmicas & Elétricas',
    ACABA: 'Revestimentos & Acabamento',
    COMUM: 'Garagens & Áreas Comuns'
  };

  const getStageBudgetUnitForPercentage = (stageId: StageId, percentage: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return 0;
    return (stage.plannedCost * percentage) / 100;
  };

  const handleCreateMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const percentNum = Number(newPercentage);
    if (!newPercentage || percentNum <= 0 || percentNum > 100) {
      alert("Por favor insira um percentual de medição de avanço válido (1% a 100%)!");
      return;
    }

    const calculatedValueAmount = getStageBudgetUnitForPercentage(newStageId, percentNum);

    onAddMeasurement({
      stageId: newStageId,
      date: newDate,
      measuredPercentage: percentNum,
      valueAmount: calculatedValueAmount,
      responsible: newResponsible || 'Engenheiro de Fiscalização',
      notes: newNotes,
      status: 'PENDING' // Newly registered measurements require approval before updating progresses
    });

    // Reset Form
    setNewPercentage('');
    setNewNotes('');
    setIsAddingMeasurement(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Calculate weighted physical progress
  const totalWeightProgress = stages.reduce((acc, stage) => {
    return acc + (stage.progress * (stage.weight / 100));
  }, 0);

  return (
    <div className="space-y-6" id="measurements-root">
      {/* Overview Physical Gauge Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="space-y-1.5 md:flex-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-display font-semibold text-slate-800">Avanço Físico Real Planejado</h3>
          </div>
          <p className="text-xs text-slate-500">
            Avanço geral acumulado: <strong className="text-slate-700">{totalWeightProgress.toFixed(2)}%</strong> das metas gerais de engenharia do empreendimento.
          </p>
          <div className="w-full bg-slate-150 h-3 rounded-full overflow-hidden mt-2 relative">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
              style={{ width: `${totalWeightProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center md:flex-1 shrink-0 w-full sm:w-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Progresso Geral</span>
          <span className="text-3xl font-bold text-indigo-700 font-display mt-1 block">
            {totalWeightProgress.toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-505 block text-slate-500 mt-1">Soma ponderada dos pesos</span>
        </div>
      </div>

      {/* Title block with trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800">Medições de Campo</h2>
          <p className="text-xs text-slate-500">Aferição física das etapas de obra, liberação orçamentária e relatórios de engenharia</p>
        </div>
        {isWritable ? (
          <button
            onClick={() => setIsAddingMeasurement(!isAddingMeasurement)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {isAddingMeasurement ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddingMeasurement ? "Cancelar" : "Nova Medição"}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-100 border text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>🔒 Modo Leitura (Apenas Financeiro e Master alteram)</span>
          </div>
        )}
      </div>

      {/* Measurement Creation Drawer */}
      {isAddingMeasurement && (
        <form onSubmit={handleCreateMeasurement} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-4 max-w-3xl animate-fade-in mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold font-display text-slate-800 text-base">Nova Medição Física por Etapa</h3>
            <p className="text-xs text-slate-400">Lance as porcentagens executadas de concreto, tijolos, tubulações ou demãos para aprovação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Etapa Analisada</label>
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
              <label className="text-xs font-semibold text-slate-500 uppercase">Avanço Medido nesta data (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                placeholder="Ex: 15"
                value={newPercentage}
                onChange={(e) => setNewPercentage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Data da Vistoria</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Engenheiro / Fiscal de Obra Responsável</label>
            <input
              type="text"
              required
              placeholder="Ex: Eng. Pedro S. Mendonça (CREA 123456-RS)"
              value={newResponsible}
              onChange={(e) => setNewResponsible(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Relatório Técnico de Diário de Vistoria</label>
            <textarea
              required
              placeholder="Descreva o que foi inspecionado, diâmetros aprovados, testes de pressão ou alinhamentos das fiadas de tijolo..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 h-24 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingMeasurement(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Registrar Vistoria
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Stages Progress breakdown vs Measurements lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stages Real physical measurements overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-semibold font-display text-slate-800 text-base">Aferição Acumulada das Etapas</h3>
            <p className="text-xs text-slate-400">Progresso físico cumulativo em andamento</p>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              const measurementsForStage = measurements.filter(m => m.stageId === stage.id && m.status === 'APPROVED');
              const totalApprovedSumFromMeasurements = measurementsForStage.reduce((sum, m) => sum + m.measuredPercentage, 0);

              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{stageTranslations[stage.id].split(' ')[0]} {stageTranslations[stage.id].slice(stageTranslations[stage.id].indexOf('&'))}</span>
                    <span className="font-mono text-slate-800 font-bold">{stage.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300`}
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
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Peso geral: {stage.weight}%</span>
                    <span>Liberação Aproximada: {formatCurrency((stage.plannedCost * stage.progress) / 100)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historic logs of Measurements with approve trigger */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-semibold font-display text-slate-800 text-base">Histórico e Aprovação de Relatórios</h3>
            <p className="text-xs text-slate-400">Liberações físicas, financeiras e homologações de engenharia</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {measurements.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-xs">Sem medições lançadas ainda.</p>
            ) : (
              // Latest first
              [...measurements].reverse().map((meas) => {
                return (
                  <div 
                    key={meas.id} 
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition-shadow ${
                      meas.status === 'PENDING' 
                        ? 'border-amber-200 bg-amber-50/20' 
                        : meas.status === 'APPROVED'
                        ? 'border-slate-100 bg-slate-50/50 hover:shadow-xs'
                        : 'border-red-150 bg-red-50/20'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Etapa</span>
                        <span className="font-semibold text-slate-800 text-sm">{stageTranslations[meas.stageId]}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(meas.date).toLocaleDateString('pt-BR')}</span>
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          meas.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : meas.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {meas.status === 'APPROVED' ? 'Aprovado' : meas.status === 'REJECTED' ? 'Recusado' : 'Aprovação Pendente'}
                        </span>
                      </div>
                    </div>

                    {/* Details and metrics */}
                    <div className="bg-white border border-slate-100 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Avanço Físico</span>
                        <span className="font-bold text-slate-700 font-mono text-base">+{meas.measuredPercentage}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Valor Correspondente</span>
                        <span className="font-bold text-slate-700 font-mono text-base">{formatCurrency(meas.valueAmount)}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-400 font-medium block flex items-center gap-0.5"><UserCheck className="w-3.5 h-3.5 text-slate-300" /> Responsável</span>
                        <span className="text-slate-600 italic font-medium mt-0.5 block truncate max-w-[160px]">{meas.responsible}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="text-xs bg-slate-50/50 p-2.5 rounded border border-slate-100 text-slate-600 leading-relaxed italic">
                      <strong>Parecer Técnico:</strong> {meas.notes}
                    </div>

                    {/* Pending tools/action box */}
                    {meas.status === 'PENDING' && (
                      <div className="flex justify-end gap-2 text-xs font-semibold pt-1 border-t border-slate-100">
                        <span className="text-[10px] text-slate-500 font-normal mr-auto flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Requer homologação técnica para atualizar o cronograma físico.
                        </span>
                        
                        {isWritable ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateMeasurementStatus(meas.id, 'REJECTED')}
                              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" /> Rejeitar
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => onUpdateMeasurementStatus(meas.id, 'APPROVED')}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Homologar & Aprovar
                            </button>
                          </>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] py-1 px-2 border rounded font-semibold italic">Requer Permissão Financeira/Master</span>
                        )}
                      </div>
                    )}
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
