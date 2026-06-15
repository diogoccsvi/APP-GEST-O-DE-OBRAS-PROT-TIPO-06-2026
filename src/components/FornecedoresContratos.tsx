import React, { useState } from 'react';
import { Supplier, Contract } from '../types';
import { 
  Building2, 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Star, 
  Trash, 
  User, 
  Mail, 
  Phone, 
  FileSignature,
  FileCheck,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';

interface FornecedoresContratosProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
  userRole?: string;
}

export default function FornecedoresContratos({
  suppliers,
  setSuppliers,
  contracts,
  setContracts,
  userRole
}: FornecedoresContratosProps) {
  const isWritable = userRole !== 'INVESTIDOR';
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('ALL');
  const [contractStatusFilter, setContractStatusFilter] = useState('ALL');

  // Modal/Drawer state
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isAddingContract, setIsAddingContract] = useState(false);

  // New Supplier form state
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    cnpj: '',
    contact: '',
    email: '',
    phone: '',
    serviceType: '',
    rating: 5
  });

  // New Contract form state
  const [newContract, setNewContract] = useState({
    supplierId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    value: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'DRAFT'
  });

  // Form helper handlers
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.cnpj || !newSupplier.serviceType) {
      alert("Por favor, preencha Nome, CNPJ e Tipo de Serviço.");
      return;
    }

    const createdSupplier: Supplier = {
      ...newSupplier,
      id: `sup-${Date.now()}`
    };

    setSuppliers(prev => [createdSupplier, ...prev]);
    setIsAddingSupplier(false);
    setNewSupplier({
      name: '',
      cnpj: '',
      contact: '',
      email: '',
      phone: '',
      serviceType: '',
      rating: 5
    });
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContract.supplierId || !newContract.title || newContract.value <= 0 || !newContract.startDate || !newContract.endDate) {
      alert("Por favor, preencha todos os campos obrigatórios e um valor válido.");
      return;
    }

    const createdContract: Contract = {
      ...newContract,
      id: `cont-${Date.now()}`
    };

    setContracts(prev => [createdContract, ...prev]);
    setIsAddingContract(false);
    setNewContract({
      supplierId: '',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      value: 0,
      status: 'ACTIVE'
    });
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm("Deseja realmente excluir este fornecedor? Todos os seus contratos permanecerão sem vínculo.")) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleDeleteContract = (id: string) => {
    if (confirm("Deseja realmente rescindir/excluir este contrato?")) {
      setContracts(prev => prev.filter(c => c.id !== id));
    }
  };

  // Helper formatting values
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Get active contracts for a supplier
  const getSupplierContracts = (supplierId: string) => {
    return contracts.filter(c => c.supplierId === supplierId);
  };

  // Unique service types for filtering
  const serviceTypes = Array.from(new Set(suppliers.map(s => s.serviceType)));

  // Filtered Suppliers List
  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toUpperCase().includes(searchTerm.toUpperCase()) || 
                          s.cnpj.includes(searchTerm) || 
                          s.serviceType.toUpperCase().includes(searchTerm.toUpperCase());
    const matchesService = selectedServiceFilter === 'ALL' || s.serviceType === selectedServiceFilter;
    return matchesSearch && matchesService;
  });

  // KPI Calculations
  const activeContractsCount = contracts.filter(c => c.status === 'ACTIVE').length;
  const totalContractsValue = contracts.reduce((acc, curr) => acc + curr.value, 0);
  const averageRating = suppliers.length > 0
    ? (suppliers.reduce((acc, curr) => acc + curr.rating, 0) / suppliers.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 animate-fade-in" id="fornecedores-contratos-module">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm" id="module-header">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display">Fornecedores & Contratos</h2>
          <p className="text-xs text-slate-500">Gestão integrada da cadeia de suprimentos, terceirizados e acordos financeiros de obras</p>
        </div>
        {isWritable ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAddingSupplier(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Fornecedor</span>
            </button>
            <button
              onClick={() => setIsAddingContract(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Vincular Contrato</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-100 border text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>🔒 Modo Leitura (Investidor)</span>
          </div>
        )}
      </div>

      {/* KPI Sumary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="supplier-kpis">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase font-mono tracking-wider">Parceiros Homologados</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{suppliers.length}</span>
            <div className="bg-slate-100 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-slate-505" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase font-mono tracking-wider">Contratos Ativos</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold tracking-tight text-blue-600">{activeContractsCount}</span>
            <div className="bg-blue-50 p-2 rounded-lg">
              <FileCheck className="w-5 h-5 text-blue-550" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase font-mono tracking-wider">Volume Contratado</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-600">{formatCurrency(totalContractsValue)}</span>
            <div className="bg-emerald-50 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-555" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase font-mono tracking-wider">Média de Classificação</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold tracking-tight text-amber-500">{averageRating} / 5.0</span>
            <div className="bg-amber-50 p-2 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Adding Supplier Form Dialog/Drawer */}
      {isAddingSupplier && (
        <form onSubmit={handleCreateSupplier} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-4 max-w-3xl mx-auto animate-fade-in" id="add-supplier-form">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-base font-display">Cadastrar Novo Fornecedor Parceiro</h3>
              <p className="text-xs text-slate-400">Insira os dados cadastrais da empresa e contatos para vinculação posterior</p>
            </div>
            <button type="button" onClick={() => setIsAddingSupplier(false)} className="text-slate-400 hover:text-slate-650 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Razão Social / Nome Fantasia *</label>
              <input 
                type="text" 
                required
                value={newSupplier.name}
                onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="Ex: Concreteira Gaúcha Ltda"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">CNPJ (Apenas números ou formato) *</label>
              <input 
                type="text" 
                required
                value={newSupplier.cnpj}
                onChange={e => setNewSupplier({ ...newSupplier, cnpj: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="Ex: 12.345.678/0001-90"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Contato Geral Responsável *</label>
              <input 
                type="text" 
                required
                value={newSupplier.contact}
                onChange={e => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="Ex: Roberto Fagundes (Vendas)"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo de Serviço Prestado *</label>
              <input 
                type="text" 
                required
                value={newSupplier.serviceType}
                onChange={e => setNewSupplier({ ...newSupplier, serviceType: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="Ex: Instalação Hidráulica ou Concreto Usinado"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail Comercial</label>
              <input 
                type="email" 
                value={newSupplier.email}
                onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="roberto@fornecedor.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Telefone / WhatsApp</label>
              <input 
                type="text" 
                value={newSupplier.phone}
                onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="(51) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Avaliação Técnica de Homologação</label>
              <select 
                value={newSupplier.rating}
                onChange={e => setNewSupplier({ ...newSupplier, rating: Number(e.target.value) })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ - Excelente / Excelente histórico</option>
                <option value={4}>⭐⭐⭐⭐ - Bom / Satisfez demandas</option>
                <option value={3}>⭐⭐⭐ - Regular / Pequenos atrasos</option>
                <option value={2}>⭐⭐ - Fraco / Atenção necessária</option>
                <option value={1}>⭐ - Crítico</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsAddingSupplier(false)}
              className="px-4 py-2 bg-slate-105 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Salvar Fornecedor
            </button>
          </div>
        </form>
      )}

      {/* Adding Contract Form Dialog/Drawer */}
      {isAddingContract && (
        <form onSubmit={handleCreateContract} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-4 max-w-3xl mx-auto animate-fade-in" id="add-contract-form">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-base font-display">Vincular Novo Contrato Jurídico</h3>
              <p className="text-xs text-slate-400">Associe prazos, valores e termos ao fornecedor responsável correspondente</p>
            </div>
            <button type="button" onClick={() => setIsAddingContract(false)} className="text-slate-400 hover:text-slate-650 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Selecione o Fornecedor Contratado *</label>
              <select 
                required
                value={newContract.supplierId}
                onChange={e => setNewContract({ ...newContract, supplierId: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
              >
                <option value="">-- Escolha um Fornecedor Cadastrado --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.serviceType})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Título Curto do Contrato/Termo *</label>
              <input 
                type="text" 
                required
                value={newContract.title}
                onChange={e => setNewContract({ ...newContract, title: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="Ex: Fornecimento de Concreto e vigas sob demanda"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Objeto do Contrato / Descrição Geral</label>
              <textarea 
                value={newContract.description}
                onChange={e => setNewContract({ ...newContract, description: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 h-16 resize-none"
                placeholder="Detalhes sobre escopo, termos de pagamento ou volume de fornecimento planejado..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Data de Início da Vigência *</label>
              <input 
                type="date" 
                required
                value={newContract.startDate}
                onChange={e => setNewContract({ ...newContract, startDate: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Data Término (Previsão de Entrega) *</label>
              <input 
                type="date" 
                required
                value={newContract.endDate}
                onChange={e => setNewContract({ ...newContract, endDate: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Valor Contratual Estimado (R$) *</label>
              <input 
                type="number" 
                required
                min="1"
                value={newContract.value || ''}
                onChange={e => setNewContract({ ...newContract, value: Number(e.target.value) })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                placeholder="Ex: 145000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status Operacional Inicial *</label>
              <select 
                value={newContract.status}
                onChange={e => setNewContract({ ...newContract, status: e.target.value as any })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
              >
                <option value="ACTIVE">ATIVO / VIGENTE</option>
                <option value="DRAFT">EM MINUTA / RASCUNHO</option>
                <option value="SUSPENDED">SUSPENSO TEMPORARIAMENTE</option>
                <option value="EXPIRED">FINALIZADO / ENCERRADO</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsAddingContract(false)}
              className="px-4 py-2 bg-slate-105 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Salvar Contrato
            </button>
          </div>
        </form>
      )}

      {/* Advanced Filter Box */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-hidden focus:border-blue-500"
            placeholder="Pesquise fornecedores pelo nome, CNPJ ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-650 outline-hidden"
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
          >
            <option value="ALL">Todas Especialidades</option>
            {serviceTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-650 outline-hidden"
            value={contractStatusFilter}
            onChange={(e) => setContractStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos Status Contratuais</option>
            <option value="ACTIVE">Ativo / Vigente</option>
            <option value="EXPIRED">Encerrado / Expirado</option>
            <option value="SUSPENDED">Suspenso</option>
            <option value="DRAFT">Minuta</option>
          </select>
        </div>
      </div>

      {/* Split List Design: Left suppliers list, Right associated selected contracts list or detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Suppliers Panel (Left Column) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-3 font-display uppercase tracking-wider">Parceiros de Negócio Cadastrados ({filteredSuppliers.length})</h3>
            
            {filteredSuppliers.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center bg-slate-50 rounded-lg">Nenhum fornecedor encontrado no cruzamento dos filtros atuais.</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
                {filteredSuppliers.map(s => {
                  const supplierContracts = getSupplierContracts(s.id);
                  const activeContracts = supplierContracts.filter(c => c.status === 'ACTIVE');
                  
                  return (
                    <div key={s.id} className="py-4 hover:bg-slate-50/60 px-2 rounded-lg transition-colors flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <h4 className="font-bold text-slate-800 text-sm">{s.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">CNPJ: {s.cnpj}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {s.contact}</span>
                          {s.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {s.phone}</span>}
                          {s.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {s.email}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] uppercase font-bold rounded">
                            {s.serviceType}
                          </span>
                          <span className="flex items-center text-xs text-amber-500 font-bold">
                            {Array.from({ length: s.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-amber-500 shrink-0" />
                            ))}
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto">
                        <div className="text-right text-xs">
                          <p className="text-slate-400">Contratos vigentes</p>
                          <p className="font-bold text-slate-700 font-mono">
                            {activeContracts.length} de {supplierContracts.length} associados
                          </p>
                        </div>
                        {isWritable && (
                          <button
                            onClick={() => handleDeleteSupplier(s.id)}
                            className="p-1 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 border border-slate-100 rounded-lg cursor-pointer flex items-center gap-1 font-semibold"
                            title="Excluir Fornecedor"
                          >
                            <Trash className="w-3 h-3" />
                            <span>Remover</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contracts Panel (Right Column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-3 font-display uppercase tracking-wider">Histórico de Contratos Vinculados</h3>

            {contracts.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center bg-slate-50 rounded-lg">Não há nenhum contrato registrado atualmente. Clique em "Vincular Contrato" para adicionar.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {contracts
                  .filter(c => contractStatusFilter === 'ALL' || c.status === contractStatusFilter)
                  .map(c => {
                    const associatedSupplier = suppliers.find(s => s.id === c.supplierId);
                    
                    return (
                      <div 
                        key={c.id} 
                        className={`p-3.5 rounded-lg border text-sm transition-all flex flex-col justify-between ${
                          c.status === 'ACTIVE' 
                            ? 'border-slate-200 hover:border-blue-300 bg-white shadow-2xs' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 opacity-90'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                              c.status === 'ACTIVE' ? 'bg-green-150 text-green-700' :
                              c.status === 'DRAFT' ? 'bg-slate-200 text-slate-700' :
                              c.status === 'SUSPENDED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {c.status === 'ACTIVE' ? 'VIGENTE' :
                               c.status === 'DRAFT' ? 'EM DESENHO' :
                               c.status === 'SUSPENDED' ? 'SUSPENSO' : 'EXPIRADO'}
                            </span>
                            <span className="font-mono font-bold text-slate-800 text-xs">
                              {formatCurrency(c.value)}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{c.title}</h4>
                          <p className="text-xs text-slate-650 leading-relaxed font-normal">{c.description || 'Nenhum escopo textual fornecido.'}</p>
                          
                          <div className="p-2 bg-slate-50 rounded-md text-xs space-y-1 mt-1 border border-slate-100">
                            <p className="font-semibold text-slate-700">
                              Fornecedor: <span className="font-normal text-slate-650">{associatedSupplier ? associatedSupplier.name : 'Não Homologado'}</span>
                            </p>
                            <p className="text-slate-400 flex items-center gap-1 text-[10px]">
                              <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                              Serviço: {associatedSupplier ? associatedSupplier.serviceType : 'Indefinido'}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Início: {new Date(c.startDate).toLocaleDateString('pt-BR')}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Fim: {new Date(c.endDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>

                        {isWritable ? (
                          <div className="flex justify-end pt-3 mt-3 border-t border-slate-100/60">
                            <button
                              onClick={() => handleDeleteContract(c.id)}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <Trash className="w-3.5 h-3.5" />
                              <span>Remover Acordo</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
