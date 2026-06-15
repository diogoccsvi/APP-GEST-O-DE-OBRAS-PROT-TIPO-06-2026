import React, { useState } from 'react';
import { AppUser, UserRole, ProjectDetails } from '../types';
import { 
  Users, 
  Lock, 
  Unlock, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Key, 
  UserPlus, 
  Clock, 
  UserCheck
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: AppUser) => void;
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
}

export function LoginScreen({ onLogin, users, onAddUser }: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<string>(users[0]?.id || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // New user signup states
  const [showRegister, setShowRegister] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('INVESTIDOR');
  const [newCrea, setNewCrea] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const userObj = users.find(u => u.id === selectedUser);
    if (!userObj) {
      setErrorMsg('Por favor, selecione um usuário válido.');
      return;
    }

    if (passwordInput === userObj.password) {
      onLogin(userObj);
      setPasswordInput('');
    } else {
      setErrorMsg('Senha incorreta para o perfil selecionado. Verifique a credencial.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newName.trim() || !newPassword.trim()) {
      alert('Favor preencher todos os campos obrigatórios!');
      return;
    }

    const usernameExists = users.some(u => u.username.toLowerCase() === newUsername.trim().toLowerCase());
    if (usernameExists) {
      alert('Este nome de usuário já está cadastrado!');
      return;
    }

    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      name: newName.trim(),
      username: newUsername.trim().toLowerCase(),
      role: newRole,
      password: newPassword.trim(),
      crea: newCrea.trim() || undefined
    };

    onAddUser(newUser);
    setSelectedUser(newUser.id);
    setPasswordInput(newUser.password);
    setShowRegister(false);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
    setNewCrea('');
    setErrorMsg(null);
    alert(`Usuário "${newUser.name}" cadastrado com sucesso! Clique em "Entrar no Sistema".`);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'MASTER':
        return <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 font-bold px-1.5 py-0.5 rounded font-mono uppercase">Gestor Master</span>;
      case 'COMPRAS':
        return <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-1.5 py-0.5 rounded font-mono uppercase">Gestor de Compras</span>;
      case 'FINANCEIRO':
        return <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 font-bold px-1.5 py-0.5 rounded font-mono uppercase">Gestor Financeiro</span>;
      case 'INVESTIDOR':
        return <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-bold px-1.5 py-0.5 rounded font-mono uppercase">Investidor (Leitor)</span>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden" id="login-layout">
      {/* Decorative ambient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-45 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
        
        {/* Left panel: Info and branding */}
        <div className="md:col-span-5 flex flex-col justify-between text-white p-2">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg">E</div>
              <div>
                <h1 className="text-2xl font-bold font-display tracking-tight leading-none text-white">EdificaPro</h1>
                <p className="text-[10px] text-blue-400 font-mono font-bold tracking-widest uppercase mt-1">MestreObras S.A.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold font-display tracking-tight leading-tight mb-4">
              Gestão de Obras & Engenharia Civil
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans mb-6">
              Acesse o cronograma de obras, homologações de medições, relatórios fotográficos diários e controles financeiros em um ecossistema seguro e auditável.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Segurança por Grupos de Permissões</p>
                <p className="text-[11px] text-slate-400">Papeis específicos parametrizados de acordo com sua responsabilidade na construtora.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Proteção e Chaves Dinâmicas</p>
                <p className="text-[11px] text-slate-400">Cada obra conta com senha individual obrigatória para impedir vazamentos de planilhas locais.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Tab forms card */}
        <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-850 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {showRegister ? 'Criar Nova Credencial Técnica' : 'Sistema de Autenticação'}
              </h3>
              <p className="text-xs text-slate-500">
                {showRegister ? 'Registre uma nova conta com perfil de permissão' : 'Entre com sua senha profissional criptografada'}
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowRegister(!showRegister);
                setErrorMsg(null);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg cursor-pointer"
            >
              {showRegister ? 'Voltar para Entrar' : 'Novo Usuário'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-pulse">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!showRegister ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-550">Selecione Seu Perfil Profissional</label>
                <select
                  value={selectedUser}
                  onChange={e => {
                    setSelectedUser(e.target.value);
                    setErrorMsg(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-hidden focus:border-blue-500 font-sans font-medium"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-550">Senha Pessoal de Acesso</label>
                  <span className="text-[10px] text-slate-400 font-mono">Sensível a maiúsculas</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="Digite sua senha..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-sm text-slate-800 outline-hidden focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-650"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Entrar no Sistema</span>
              </button>
            </form>
          ) : (
            /* Register user form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Nome de Usuário (Ex: ricardo)</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    required
                    maxLength={15}
                    placeholder="ex: ricardo"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Nome Completo (Ex: Ricardo Mendes)</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    required
                    placeholder="ex: Ricardo Mendes"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Nível de Acesso (Cargo)</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as UserRole)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 font-semibold"
                  >
                    <option value="MASTER">Gestor / Coordenador / Responsável Técnico</option>
                    <option value="COMPRAS">Gestor de Compras</option>
                    <option value="FINANCEIRO">Gestor Financeiro</option>
                    <option value="INVESTIDOR">Investidor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">Senha Pessoal de Acesso</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="Qualquer código/senha..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">Registro de CREA / Especialidade (Opcional)</label>
                <input
                  type="text"
                  value={newCrea}
                  onChange={e => setNewCrea(e.target.value)}
                  placeholder="Ex: CREA RS 129388"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Salvar Credencial & Ir para Login</span>
              </button>
            </form>
          )}

          {/* Collapsible preseeded credentials preview for testing */}
          {showDemoCredentials && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-150 pb-1.5 mb-1.5">
                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ambiente de Homologação (Credenciais Prontas)</span>
                </p>
                <button 
                  onClick={() => setShowDemoCredentials(false)} 
                  className="text-[10px] text-slate-400 hover:text-slate-650"
                >
                  Ocultar
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Para testar e avaliar cada uma das 4 regras de usuários estabelecidas pelo cliente, selecione o usuário desejado e utilize a senha padrão para login:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1 font-mono text-[10px]">
                <div className="bg-white p-2 rounded border border-slate-150 space-y-1">
                  <p className="font-bold text-slate-800">1. Gestor Completo</p>
                  <p className="text-slate-500">Nome: <strong>Carlos Silva</strong></p>
                  <p><span className="text-blue-600">Username:</span> carlos</p>
                  <p><span className="text-blue-600">Senha:</span> 123</p>
                  <p className="text-[9px] text-slate-400 font-sans">Acesso total irrestrito.</p>
                </div>

                <div className="bg-white p-2 rounded border border-slate-150 space-y-1">
                  <p className="font-bold text-emerald-800">2. Gestor de Compras</p>
                  <p className="text-slate-500">Nome: <strong>Ana Costa</strong></p>
                  <p><span className="text-blue-600">Username:</span> ana</p>
                  <p><span className="text-blue-600">Senha:</span> 123</p>
                  <p className="text-[9px] text-slate-400 font-sans">Altera Custos e Fornecedores apenas.</p>
                </div>

                <div className="bg-white p-2 rounded border border-slate-150 space-y-1">
                  <p className="font-bold text-amber-800">3. Gestor Financeiro</p>
                  <p className="text-slate-500">Nome: <strong>Roberto Lima</strong></p>
                  <p><span className="text-blue-600">Username:</span> roberto</p>
                  <p><span className="text-blue-600">Senha:</span> 123</p>
                  <p className="text-[9px] text-slate-400 font-sans">Altera Custos, Fornecedores e Medições.</p>
                </div>

                <div className="bg-white p-2 rounded border border-slate-150 space-y-1">
                  <p className="font-bold text-slate-800">4. Investidor</p>
                  <p className="text-slate-500">Nome: <strong>Eduardo Sousa</strong></p>
                  <p><span className="text-blue-600">Username:</span> eduardo</p>
                  <p><span className="text-blue-600">Senha:</span> 123</p>
                  <p className="text-[9px] text-slate-400 font-sans">Leitura geral. Não pode alterar nada.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProjectUnlockModalProps {
  project: ProjectDetails;
  onUnlock: (projectId: string) => void;
  onCancel: () => void;
}

export function ProjectUnlockModal({ project, onUnlock, onCancel }: ProjectUnlockModalProps) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    // Default fallback in case project doesn't have password
    const expectedPassword = project.accessPassword || 'obra123';
    
    if (password === expectedPassword) {
      onUnlock(project.id || '');
    } else {
      setErrorMsg('A senha inserida para esta obra está incorreta. Verifique com a central.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="project-password-lock-screen">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-slate-950 font-display">Obra Protegida por Senha</h2>
          <p className="text-xs text-slate-500 leading-normal">
            Você está tentando acessar as especificações de: <br />
            <strong className="text-slate-800">{project.name}</strong>
          </p>
          <p className="text-[11px] text-indigo-650 bg-indigo-50 border border-indigo-100 rounded-md p-1.5 font-semibold">
             Esta verificação é necessária apenas uma vez por sessão.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500">Chave de Segurança da Obra</label>
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a senha desta obra..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-sm font-semibold text-slate-800 placeholder-slate-400 outline-hidden focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              Confirmar Senha
            </button>
          </div>
        </form>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-[10px] text-slate-500">
          💡 <strong>Dica de homologação:</strong> A senha padrão para o Residencial Horizonte Vista é <code className="bg-white px-1 border font-bold">horizonte123</code>, para o Parque das Rosas é <code className="bg-white px-1 border font-bold">parque456</code>, e para o Corporate Plaza é <code className="bg-white px-1 border font-bold">plaza789</code>.
        </div>
      </div>
    </div>
  );
}

interface UserProfilesTabProps {
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: AppUser;
}

export function UserProfilesTab({ users, onAddUser, onDeleteUser, currentUser }: UserProfilesTabProps) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('INVESTIDOR');
  const [crea, setCrea] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role !== 'MASTER') {
      alert('Somente usuários Gestores (Master) podem criar ou gerenciar outros perfis!');
      return;
    }

    if (!username.trim() || !name.trim() || !password.trim()) {
      alert('Favor preencher todos os campos obrigatórios!');
      return;
    }

    const usernameExists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (usernameExists) {
      alert('Este ID de Usuário já está sendo utilizado!');
      return;
    }

    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      role: role,
      password: password.trim(),
      crea: crea.trim() || undefined
    };

    onAddUser(newUser);
    setName('');
    setUsername('');
    setPassword('');
    setCrea('');
    alert(`Usuário "${newUser.name}" cadastrado com sucesso total!`);
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'MASTER': return 'Gestão Master / RT Completo';
      case 'COMPRAS': return 'Gestão de Compras (Custos/Forn.)';
      case 'FINANCEIRO': return 'Financeiro (Custos/Med./Forn.)';
      case 'INVESTIDOR': return 'Investidor (Visualização Geral)';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="user-profiles-setting-panel">
      {/* Tab Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="p-1 px-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded text-[10px] font-bold font-mono uppercase">Módulo de Segurança & Governança</span>
          <h2 className="text-xl font-bold text-slate-900 font-display mt-1">Gestão de Usuários</h2>
          <p className="text-xs text-slate-500">Configure credenciais técnicas, visualize os perfis vigentes e determine acessos parametrizados</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-right">
          <p className="text-[10px] text-slate-500 font-medium">Seu Perfil Conectado:</p>
          <div className="flex items-center gap-1.5 justify-end mt-0.5">
            <span className="text-xs font-bold text-slate-850">{currentUser.name}</span>
            <span className="text-[9px] bg-indigo-600 text-white font-mono font-bold px-1.5 py-0.2 rounded uppercase">{currentUser.role}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Register user form (Disabled unless target role is MASTER) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Cadastrar Novo Perfil</span>
            </h3>
            <p className="text-[10px] text-slate-400">Adicione novos engenheiros, contadores ou investidores</p>
          </div>

          {currentUser.role !== 'MASTER' ? (
            <div className="py-8 px-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200 text-slate-400 space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">Somente Leitura</p>
              <p className="text-[10px] text-slate-400 leading-normal">Seu perfil técnico não possui permissão para cadastrar ou remover outros usuários do sistema.</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-550">Nome do Usuário (Ex: julia)</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ex: julia"
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-550">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Júlia Andrade"
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-550">Senha Inicial</label>
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Código de acesso para login..."
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-550">Grupo de Acesso (Papel)</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500 font-semibold"
                >
                  <option value="MASTER">Gestor / Responsável Técnico Completo</option>
                  <option value="COMPRAS">Gestor de Compras (Apenas Custos/Forn.)</option>
                  <option value="FINANCEIRO">Gestor Financeiro (Custos/Med./Forn.)</option>
                  <option value="INVESTIDOR">Investidor (Apenas Visualização)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500">Registro Federal/CREA (Opcional)</label>
                <input
                  type="text"
                  value={crea}
                  onChange={e => setCrea(e.target.value)}
                  placeholder="Ex: CREA RS 152994"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar Credencial</span>
              </button>
            </form>
          )}
        </div>

        {/* Existing Accounts Table (8 columns) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm font-display">Tabela de Usuários Ativos</h3>
            <p className="text-[10px] text-slate-400">Relação completa de profissionais credenciados neste ambiente de obras</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest font-mono font-bold text-[9px] py-2">
                  <th className="p-3">Usuário</th>
                  <th className="p-3">Cargo Real</th>
                  <th className="p-3">Senha de Acesso</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center text-slate-700 font-bold shrink-0 uppercase">
                          {u.name.substring(0,2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-850">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-medium">@{u.username} {u.crea && `| ${u.crea}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
                        u.role === 'MASTER' ? 'bg-red-50 text-red-700 border-red-150' :
                        u.role === 'COMPRAS' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                        u.role === 'FINANCEIRO' ? 'bg-amber-50 text-amber-700 border-amber-150' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-600 bg-slate-50/30">
                      {currentUser.role === 'MASTER' ? u.password : '••••••'}
                    </td>
                    <td className="p-3 text-right">
                      {currentUser.role === 'MASTER' ? (
                        u.id === currentUser.id ? (
                          <span className="text-[10px] font-semibold text-slate-400 p-2 italic bg-slate-50 border rounded">Dispositivo Ativo</span>
                        ) : (
                          <button
                            onClick={() => {
                              if (window.confirm(`Tem certeza de que deseja banir/remover a credencial de ${u.name}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="p-1 px-2 hover:bg-red-50 hover:text-red-650 text-red-400 border border-transparent hover:border-red-200 rounded transition-all cursor-pointer inline-flex items-center gap-1 font-semibold text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remover</span>
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 italic">Travado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 flex gap-3 text-[11px] text-slate-550 leading-relaxed mt-4">
            <Shield className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Matriz de Privilégios Detalhada:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                <li><strong>Gestor Master / Resp. Técnico</strong>: Controle total unificado (Capa da Obra, Cronograma, Custos, Medições, Relatórios, Fornecedores, Impostos e Documentos Google Drive).</li>
                <li><strong>Gestor de Compras</strong>: Pode incluir, modificar e deletar dados em <strong className="text-slate-800">Custos & Financeiro</strong> e <strong className="text-slate-800">Fornecedores & Contratos</strong> apenas. Visualização restrita em outras abas.</li>
                <li><strong>Gestor Financeiro</strong>: Pode incluir, modificar e deletar dados em <strong className="text-slate-800">Custos & Financeiro</strong>, <strong className="text-slate-800 font-bold">Medições por Etapa</strong>, e <strong className="text-slate-800">Fornecedores & Contratos</strong>. Visualização restrita em outras abas.</li>
                <li><strong>Investidor</strong>: Visualização integral irrestrita de todas as abas técnicas sem capacidade de inserção ou deleção de dados.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
