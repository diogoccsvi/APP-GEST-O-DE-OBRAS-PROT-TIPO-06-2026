import { ProjectDetails, ConstructionStage, ScheduleTask, Expense, Measurement, PhotoReport, Supplier, Contract, TeamMember, RealEstateTax } from './types';

export const INITIAL_PROJECT: ProjectDetails = {
  id: "proj-1",
  name: "Residencial Horizonte Vista",
  totalArea: 1250, // m²
  apartmentsCount: 8,
  garagesCount: 12,
  commonAreasDescription: "Salão de festas com churrasqueira, playground externo e guarita automatizada.",
  address: "Rua das Palmeiras, 350 - Bairro Jardim, Porto Alegre - RS",
  plannedBudget: 1450000, // R$ 1.450.000
  spentBudget: 876000, // R$ 876.000
  startDate: "2026-01-10",
  expectedEndDate: "2026-12-15",
  coordinator: "Eng. Ricardo Silva",
  crea: "CREA 123456-D",
  accessPassword: "horizonte123"
};

export const INITIAL_STAGES: ConstructionStage[] = [
  {
    id: "INFRA",
    name: "Infraestrutura & Fundações",
    weight: 12, // 12%
    plannedCost: 174000,
    spentCost: 172500,
    progress: 100,
    startDate: "2026-01-10",
    endDate: "2026-02-28",
    color: "emerald"
  },
  {
    id: "ESTRU",
    name: "Superestrutura & Lajes",
    weight: 25, // 25%
    plannedCost: 362500,
    spentCost: 368000,
    progress: 100,
    startDate: "2026-03-01",
    endDate: "2026-05-30",
    color: "blue"
  },
  {
    id: "ALVEN",
    name: "Alvenaria & Fechamentos",
    weight: 15, // 15%
    plannedCost: 217500,
    spentCost: 185000,
    progress: 85,
    startDate: "2026-05-15",
    endDate: "2026-07-15",
    color: "amber"
  },
  {
    id: "INSTA",
    name: "Instalações Hidráulicas & Elétricas",
    weight: 15, // 15%
    plannedCost: 217500,
    spentCost: 98000,
    progress: 45,
    startDate: "2026-06-01",
    endDate: "2026-08-30",
    color: "indigo"
  },
  {
    id: "ACABA",
    name: "Revestimentos & Acabamentos",
    weight: 23, // 23%
    plannedCost: 333500,
    spentCost: 32500,
    progress: 10,
    startDate: "2026-07-20",
    endDate: "2026-11-15",
    color: "purple"
  },
  {
    id: "COMUM",
    name: "Garagens & Áreas Comuns",
    weight: 10, // 10%
    plannedCost: 145000,
    spentCost: 20000,
    progress: 15,
    startDate: "2026-09-01",
    endDate: "2026-12-10",
    color: "teal"
  }
];

export const INITIAL_TASKS: ScheduleTask[] = [
  // INFRA tasks
  {
    id: "task-infra-1",
    stageId: "INFRA",
    title: "Sondagem do Solo e Locação",
    description: "Serviço de topografia, marcação de estacas e sondagem de reconhecimento de solo.",
    startDate: "2026-01-10",
    endDate: "2026-01-20",
    status: "COMPLETED",
    progress: 100,
    responsible: "AeroTopografia RS"
  },
  {
    id: "task-infra-2",
    stageId: "INFRA",
    title: "Perfuração e Concretagem de Estacas",
    description: "Perfuração mecânica, colocação da armação de ferro e lançamento de concreto em estacas profundas.",
    startDate: "2026-01-21",
    endDate: "2026-02-15",
    status: "COMPLETED",
    progress: 100,
    responsible: "Engenharia de Solos Sul"
  },
  {
    id: "task-infra-3",
    stageId: "INFRA",
    title: "Vigas Baldrame e Blocos de Coroamento",
    description: "Montagem de formas, armação de aço das vigas baldrame e concretagem direta.",
    startDate: "2026-02-16",
    endDate: "2026-02-28",
    status: "COMPLETED",
    progress: 100,
    responsible: "Mestre João e Equipe"
  },

  // ESTRU tasks
  {
    id: "task-estru-1",
    stageId: "ESTRU",
    title: "Pilares e Vigas do Térreo (Garagem)",
    description: "Execução das formas de madeira, montagem do aço CA-50 e concretagem auto-adensável.",
    startDate: "2026-03-01",
    endDate: "2026-03-25",
    status: "COMPLETED",
    progress: 100,
    responsible: "Mestre João & Armadores"
  },
  {
    id: "task-estru-2",
    stageId: "ESTRU",
    title: "Lajes do 1° ao 4° Pavimento",
    description: "Montagem de esccoramentos metálicos, colocação de lajotas de EPS, tubulações de elétrica e concretagem.",
    startDate: "2026-03-26",
    endDate: "2026-05-15",
    status: "COMPLETED",
    progress: 100,
    responsible: "LajeFácil Betoneiras"
  },
  {
    id: "task-estru-3",
    stageId: "ESTRU",
    title: "Reservatório Superior e Telhado",
    description: "Concretagem da laje de cobertura, caixa d'água técnica e suporte estrutural para telhas termoacústicas.",
    startDate: "2026-05-16",
    endDate: "2026-05-30",
    status: "COMPLETED",
    progress: 100,
    responsible: "Mestre João e Equipe"
  },

  // ALVEN tasks
  {
    id: "task-alven-1",
    stageId: "ALVEN",
    title: "Elevação de Alvenaria Externa e Divisórias",
    description: "Elevação de paredes com blocos cerâmicos estruturais e argamassa industrializada.",
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    status: "IN_PROGRESS",
    progress: 95,
    responsible: "Empreiteira Silva Santos"
  },
  {
    id: "task-alven-2",
    stageId: "ALVEN",
    title: "Vergas, Contravergas e Resbordo de Janelas",
    description: "Moldagem de pequenas vigas de concreto sobre e sob aberturas de janelas e portas para evitar trincas.",
    startDate: "2026-06-10",
    endDate: "2026-06-25",
    status: "IN_PROGRESS",
    progress: 40,
    responsible: "Mestre João e Equipe"
  },
  {
    id: "task-alven-3",
    stageId: "ALVEN",
    title: "Chapisco e Reboco Interno",
    description: "Aplicação de chapisco seguido de reboco com argamassa projetada nos apartamentos.",
    startDate: "2026-06-20",
    endDate: "2026-07-15",
    status: "PENDING",
    progress: 0,
    responsible: "Empreiteira Silva Santos"
  },

  // INSTA tasks
  {
    id: "task-insta-1",
    stageId: "INSTA",
    title: "Prumadas Hidráulicas e Esgoto",
    description: "Passagem das tubulações verticais de PVC de água fria, água quente (PPR) e esgoto sanitário.",
    startDate: "2026-06-01",
    endDate: "2026-06-28",
    status: "IN_PROGRESS",
    progress: 75,
    responsible: "Marcos Instalador Hidráulico"
  },
  {
    id: "task-insta-2",
    stageId: "INSTA",
    title: "Infraestrutura de Elétrica e Conectividade",
    description: "Instalação de eletrodutos corrugados pesados e caixas de luz (4x2 / 4x4) nas alvenarias antes do reboco.",
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    status: "IN_PROGRESS",
    progress: 30,
    responsible: "EletroVolt Instalações"
  },
  {
    id: "task-insta-3",
    stageId: "INSTA",
    title: "Infraestrutura para Ar Condicionado (Split)",
    description: "Passagem de drenos e tubulações de cobre isoladas para os pontos de split dos quartos e salas.",
    startDate: "2026-07-10",
    endDate: "2026-08-10",
    status: "PENDING",
    progress: 0,
    responsible: "ClimaFrio Refrigeração"
  },

  // ACABA tasks
  {
    id: "task-acaba-1",
    stageId: "ACABA",
    title: "Impermeabilização de Banheiros e Sacadas",
    description: "Aplicação de manta asfáltica líquida elastomérica nos boxes e terraços abertos.",
    startDate: "2026-07-20",
    endDate: "2026-08-10",
    status: "PENDING",
    progress: 0,
    responsible: "Vedação Forte Impermeabilizadora"
  },
  {
    id: "task-acaba-2",
    stageId: "ACABA",
    title: "Assentamento de Pisos Porcelanatos",
    description: "Colocação de cerâmicas e porcelanatos retificados nos pisos de salas e paredes dos banheiros.",
    startDate: "2026-08-15",
    endDate: "2026-10-10",
    status: "PENDING",
    progress: 0,
    responsible: "Empreiteira Silva Santos"
  },
  {
    id: "task-acaba-3",
    stageId: "ACABA",
    title: "Pintura e Esquadrias",
    description: "Lixamento de paredes com massa corrida, aplicação de selador, duas demãos de tinta acrílica e instalação de esquadrias de alumínio.",
    startDate: "2026-10-12",
    endDate: "2026-11-15",
    status: "PENDING",
    progress: 0,
    responsible: "Pinturas Premium"
  },

  // COMUM tasks
  {
    id: "task-comum-1",
    stageId: "COMUM",
    title: "Contrapiso do Estacionamento/Garagem",
    description: "Nivelamento do solo, brita compactada, malha de ferro e concretagem polida de alta resistência.",
    startDate: "2026-09-01",
    endDate: "2026-09-25",
    status: "PENDING",
    progress: 0,
    responsible: "Mestre João e Equipe"
  },
  {
    id: "task-comum-2",
    stageId: "COMUM",
    title: "Montagem do Salão de Festas",
    description: "Revestimentos cerâmicos diferenciados, churrasqueira pré-moldada integrada e forro de gesso decorativo.",
    startDate: "2026-10-01",
    endDate: "2026-11-10",
    status: "PENDING",
    progress: 0,
    responsible: "Empreiteira Silva Santos"
  },
  {
    id: "task-comum-3",
    stageId: "COMUM",
    title: "Paisagismo e Gradil Externo",
    description: "Plantio de grama esmeralda, árvores ornamentais pequenas e fixação do portão automatizado de alumínio.",
    startDate: "2026-11-15",
    endDate: "2026-12-10",
    status: "PENDING",
    progress: 0,
    responsible: "Sol & Jardim Paisagismo"
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    stageId: "INFRA",
    title: "Estudos de Solo (Provas de Carga)",
    category: "ADMIN",
    value: 8500,
    date: "2026-01-12",
    provider: "SondaSondagens S/A",
    status: "PAID"
  },
  {
    id: "exp-2",
    stageId: "INFRA",
    title: "Aço CA-50 para Armação de Estacas",
    category: "MATERIAL",
    value: 48000,
    date: "2026-01-20",
    provider: "Gerdau Comercial",
    status: "PAID"
  },
  {
    id: "exp-3",
    stageId: "INFRA",
    title: "Mão de Obra de Escavação e Estacamento",
    category: "LABOR",
    value: 62000,
    date: "2026-02-15",
    provider: "Empreiteira de Solos Sul",
    status: "PAID"
  },
  {
    id: "exp-4",
    stageId: "INFRA",
    title: "Cimento e Areia Fina Baldrame",
    category: "MATERIAL",
    value: 54000,
    date: "2026-02-22",
    provider: "Votorantim Materiais",
    status: "PAID"
  },
  {
    id: "exp-5",
    stageId: "ESTRU",
    title: "Metalúrgica Coberturas - Perfis de Coroamento",
    category: "MATERIAL",
    value: 124000,
    date: "2026-03-12",
    provider: "AçoMax Estruturas",
    status: "PAID"
  },
  {
    id: "exp-6",
    stageId: "ESTRU",
    title: "Locação de Andaimes e Escoras Metálicas",
    category: "EQUIPMENT",
    value: 23600,
    date: "2026-03-20",
    provider: "Mills Locações Ltda",
    status: "PAID"
  },
  {
    id: "exp-7",
    stageId: "ESTRU",
    title: "Concreto Usinado Fck 30 MPa (150 m³)",
    category: "MATERIAL",
    value: 98000,
    date: "2026-04-10",
    provider: "Concreteira Gaúcha",
    status: "PAID"
  },
  {
    id: "exp-8",
    stageId: "ESTRU",
    title: "Instalação de lajes e vigas (Mão de Obra)",
    category: "LABOR",
    value: 122400,
    date: "2026-05-20",
    provider: "Mestre João e Equipe",
    status: "PAID"
  },
  {
    id: "exp-9",
    stageId: "ALVEN",
    title: "Tijolos Cerâmicos / Canaletas",
    category: "MATERIAL",
    value: 45000,
    date: "2026-05-18",
    provider: "Olaria Cerâmica Nova",
    status: "PAID"
  },
  {
    id: "exp-10",
    stageId: "ALVEN",
    title: "Argamassa de Assentamento Pronta",
    category: "MATERIAL",
    value: 22000,
    date: "2026-05-25",
    provider: "Matrix Argamassas",
    status: "PAID"
  },
  {
    id: "exp-11",
    stageId: "ALVEN",
    title: "Sinal de Mão de Obra Levantamento Paredes",
    category: "LABOR",
    value: 118000,
    date: "2026-06-05",
    provider: "Empreiteira Silva Santos",
    status: "PAID"
  },
  {
    id: "exp-12",
    stageId: "INSTA",
    title: "Canos, Joelhos e Conexões de PVC Tigre",
    category: "MATERIAL",
    value: 38000,
    date: "2026-06-03",
    provider: "Tigre Distribuidora RS",
    status: "PAID"
  },
  {
    id: "exp-13",
    stageId: "INSTA",
    title: "Quadros de distribuição de luz e fiação flex.",
    category: "MATERIAL",
    value: 45000,
    date: "2026-06-07",
    provider: "EletroVolt Materiais",
    status: "PENDING"
  },
  {
    id: "exp-14",
    stageId: "ACABA",
    title: "Porcelanato Retificado 80x80 (Lotes Iniciais)",
    category: "MATERIAL",
    value: 32500,
    date: "2026-06-02",
    provider: "Portobello Shop POA",
    status: "PAID"
  },
  {
    id: "exp-15",
    stageId: "COMUM",
    title: "Taxa Municipal Alvará de Construção Integrada",
    category: "ADMIN",
    value: 20000,
    date: "2026-01-15",
    provider: "Prefeitura Municipal de Porto Alegre",
    status: "PAID"
  }
];

export const INITIAL_MEASUREMENTS: Measurement[] = [
  {
    id: "meas-1",
    stageId: "INFRA",
    date: "2026-02-01",
    measuredPercentage: 50,
    valueAmount: 87000,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "APPROVED",
    notes: "Fundação concluída na ala Leste. Estacas cravadas conforme projeto de cargas estruturais."
  },
  {
    id: "meas-2",
    stageId: "INFRA",
    date: "2026-03-02",
    measuredPercentage: 50,
    valueAmount: 87000,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "APPROVED",
    notes: "Medição final de infraestrutura. Vigas baldrame concluídas e impermeabilizadas com emulsão asfáltica."
  },
  {
    id: "meas-3",
    stageId: "ESTRU",
    date: "2026-04-10",
    measuredPercentage: 40,
    valueAmount: 145000,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "APPROVED",
    notes: "Lajes do 1° e 2° pavimento concretadas. Geometria de vigas e níveis de pilares de acordo com gabaritos."
  },
  {
    id: "meas-4",
    stageId: "ESTRU",
    date: "2026-05-12",
    measuredPercentage: 40,
    valueAmount: 145000,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "APPROVED",
    notes: "Lajes do 3° e 4° pavimento prontas. Ensaios de compressão axial do concreto em 28 dias atingiram os 30 Mpa pretendidos."
  },
  {
    id: "meas-5",
    stageId: "ESTRU",
    date: "2026-06-01",
    measuredPercentage: 20,
    valueAmount: 72500,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "APPROVED",
    notes: "Cobertura, poço do elevador e montagem técnica do reservatório d'água superior totalmente executados."
  },
  {
    id: "meas-6",
    stageId: "ALVEN",
    date: "2026-06-05",
    measuredPercentage: 60,
    valueAmount: 130500,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "APPROVED",
    notes: "Elevação das alvenarias externas de fechamento e divisórias da maioria dos banheiros concluídas."
  },
  {
    id: "meas-7",
    stageId: "ALVEN",
    date: "2026-06-09",
    measuredPercentage: 25,
    valueAmount: 54375,
    responsible: "Eng. Pedro S. Mendonça (CREA 123456-RS)",
    status: "PENDING",
    notes: "Medição de acompanhamento de vergas sobre aberturas dos apartamentos residenciais 101, 102, 201 e 202."
  }
];

export const INITIAL_PHOTO_REPORTS: PhotoReport[] = [
  {
    id: "photo-1",
    stageId: "ESTRU",
    title: "Concretagem da Laje de Cobertura superior",
    description: "Equipe finalizando o alisamento e cura úmida contínua na laje técnica superior. Concreto com aditivo plastificante.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-05-28 14:30",
    uploadedBy: "Manoel Pinheiro (Mestre de Obras)",
    locationTag: "Laje Superior / Casa de Máquinas"
  },
  {
    id: "photo-2",
    stageId: "ALVEN",
    title: "Alvenaria do 3° Andar - Apartamento 301",
    description: "Instalação da primeira fiação técnica guia nos cantos de prumo do Apartamento 301. Blocos devidamente molhados e colados por cordão.",
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-06-01 10:15",
    uploadedBy: "Eng. Pedro S. Mendonça",
    locationTag: "Apartamento 301 - Quarto Suíte"
  },
  {
    id: "photo-3",
    stageId: "INSTA",
    title: "Instalação sanitária do prumo de escoamento principal",
    description: "Tubo reforçado de queda de esgoto e ramais de ventilação secundária devidamente travados com abraçadeiras metálicas no duto.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-06-04 16:45",
    uploadedBy: "Marcos (Encanador)",
    locationTag: "Shaft de Tubulação - Ala Norte"
  },
  {
    id: "photo-4",
    stageId: "ALVEN",
    title: "Montagem de Caixilharia e Vergas de Janelas",
    description: "Vergas pré-fabricadas montadas no nível exato de projeto para evitar concentração de tensões nos cantos das esquadrias.",
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-06-08 09:00",
    uploadedBy: "Manoel Pinheiro (Mestre de Obras)",
    locationTag: "Janelas Apartamento 102"
  }
];

export const INITIAL_PROJECTS: ProjectDetails[] = [
  INITIAL_PROJECT,
  {
    id: "proj-2",
    name: "Condomínio Parque das Rosas",
    totalArea: 2450,
    apartmentsCount: 16,
    garagesCount: 20,
    commonAreasDescription: "Espaço fitness completo, piscina aquecida, bicicletário e portaria 24h.",
    address: "Av. do Forte, 780 - Bairro Vila Ipiranga, Porto Alegre - RS",
    plannedBudget: 2850000,
    spentBudget: 420000,
    startDate: "2026-03-01",
    expectedEndDate: "2027-04-15",
    coordinator: "Eng. Pedro S. Mendonça",
    crea: "CREA 147589-D",
    accessPassword: "parque456"
  },
  {
    id: "proj-3",
    name: "Edifício Corporate Plaza",
    totalArea: 3200,
    apartmentsCount: 0,
    garagesCount: 45,
    commonAreasDescription: "Auditório para 60 pessoas, salas de reuniões modulares e recepção corporativa bilingue.",
    address: "Av. Carlos Gomes, 1200 - Bairro Três Figueiras, Porto Alegre - RS",
    plannedBudget: 4800000,
    spentBudget: 150000,
    startDate: "2026-05-10",
    expectedEndDate: "2027-10-30",
    coordinator: "Arq. Amanda Ferreira",
    crea: "CAU A23984-1",
    accessPassword: "plaza789"
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Concreteira Gaúcha Ltda",
    cnpj: "12.345.678/0001-90",
    contact: "Roberto Fagundes (Comercial)",
    email: "comercial@concreteiragaucha.com.br",
    phone: "(51) 98111-2233",
    serviceType: "Fornecimento de Concreto Usinado Fck 30/40MPa",
    rating: 5
  },
  {
    id: "sup-2",
    name: "Empreiteira Silva Santos S/C",
    cnpj: "98.765.432/0001-10",
    contact: "Valdir Santos (Diretor)",
    email: "valdir.santos@silvasantosempreiteira.com.br",
    phone: "(51) 98455-1234",
    serviceType: "Mão de Obra de Alvenaria, Reboco e Revestimento",
    rating: 4
  },
  {
    id: "sup-3",
    name: "EletroVolt Instalações Comerciais",
    cnpj: "34.567.890/0002-44",
    contact: "Bruno Eletricista",
    email: "projetos@eletrovoltpoa.com.br",
    phone: "(51) 99312-5678",
    serviceType: "Instalação Elétrica, SPDA e Redes de Comunicação",
    rating: 5
  },
  {
    id: "sup-4",
    name: "Gerdau Comercial de Aços S/A",
    cnpj: "01.002.582/0045-88",
    contact: "Juliana Medeiros",
    email: "vendas.poa@gerdau.com.br",
    phone: "(51) 3302-9000",
    serviceType: "Fornecimento de Aço CA-50, CA-60 e Malhas Metálicas",
    rating: 5
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "cont-1",
    supplierId: "sup-1",
    title: "Fornecimento de Concreto para Estuturas Principais",
    description: "Fornecimento programado de até 350m³ de concreto dosado em central, Fck 30 MPa, com aplicação via caminhão bomba.",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    value: 185000,
    status: "ACTIVE"
  },
  {
    id: "cont-2",
    supplierId: "sup-2",
    title: "Contrato de Mão de Obra de Alvenaria e Reboco",
    description: "Empreitada de mão de obra para elevação de blocos cerâmicos nos pavimentos 1 a 4 e aplicação de reboco interno fracionado.",
    startDate: "2026-05-15",
    endDate: "2026-09-30",
    value: 295000,
    status: "ACTIVE"
  },
  {
    id: "cont-3",
    supplierId: "sup-3",
    title: "Execução Elétrica e Infraestrutura de Conectividade",
    description: "Lançamento de eletrodutos pesados, fiação de prumadas, aterramento geral de obra e montagem de quadros disjuntores.",
    startDate: "2026-06-15",
    endDate: "2026-10-15",
    value: 120000,
    status: "ACTIVE"
  },
  {
    id: "cont-4",
    supplierId: "sup-4",
    title: "Fornecimento Preventivo de Vergalhões e Aço",
    description: "Fornecimento à vista de barras de aço CA-50 cortadas e dobradas conforme projeto executivo estrutural do residencial.",
    startDate: "2026-01-15",
    endDate: "2026-03-15",
    value: 160000,
    status: "EXPIRED"
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    projectId: "proj-1",
    name: "Eng. Ricardo Silva",
    role: "Responsável Técnico (Coodenador)",
    email: "ricardo.silva@edificapro.com",
    phone: "(51) 99111-9988"
  },
  {
    id: "team-2",
    projectId: "proj-1",
    name: "Manoel Pinheiro",
    role: "Mestre de Obras Geral",
    email: "manoel.obras@gmail.com",
    phone: "(51) 98777-6655"
  },
  {
    id: "team-3",
    projectId: "proj-1",
    name: "Gabriel Neves",
    role: "Técnico de Segurança do Trabalho",
    email: "gabriel.sst@edificapro.com",
    phone: "(51) 98333-2211"
  },
  {
    id: "team-4",
    projectId: "proj-2",
    name: "Eng. Pedro S. Mendonça",
    role: "Engenheiro Residente",
    email: "pedro.mendonca@edificapro.com",
    phone: "(51) 99144-8877"
  },
  {
    id: "team-5",
    projectId: "proj-2",
    name: "Carlos Eduardo Costa",
    role: "Encarregado de Fundações",
    email: "cadu.fundacao@gmail.com",
    phone: "(51) 98222-3344"
  },
  {
    id: "team-6",
    projectId: "proj-3",
    name: "Arq. Amanda Ferreira",
    role: "Coordenadora de Projetos",
    email: "amanda.ferreira@edificapro.com",
    phone: "(51) 99345-6712"
  }
];

export const INITIAL_TAXES: RealEstateTax[] = [
  {
    id: "tax-1",
    name: "RET (Regime Especial de Tributação)",
    description: "Tributação unificada federal facilitadora para incorporações imobiliárias sob o regime de patrimônio de afetação.",
    rate: 4, // 4.0%
    basis: "Calulado sobre as Receitas Mensais de Vendas das Unidades",
    type: "FEDERAL"
  },
  {
    id: "tax-2",
    name: "INCC-M (Índice Nacional de Custo da Construção)",
    description: "Taxa de reajuste setorial indexadora mensal aplicada sobre o saldo devedor de parcelas de contratos de promessa de compra e venda.",
    rate: 0.65, // média de 0.65% ao mês dependendo do período
    basis: "Calculado sobre Saldo Devedor dos Compradores",
    type: "INDEX"
  },
  {
    id: "tax-3",
    name: "ISSQN (Imposto Sobre Serviços de Qualquer Natureza)",
    description: "Imposto municipal cobrado do prestador de serviços na execução de obras de construção civil com descontos legais de materiais.",
    rate: 3, // 3% a 5% dependendo da prefeitura municipal
    basis: "Calculado sobre Valor da Nota Fiscal de Serviços",
    type: "MUNICIPAL"
  },
  {
    id: "tax-4",
    name: "Previdência Social (INSS Obra / FGTS / CPRB)",
    description: "Encargos trabalhista retido e contribuição sobre a folha de pagamento ou faturamento bruto desonerado de trabalhadores da construção civil.",
    rate: 5.8, // 5.8% de desoneração ou conforme folha (média de aferição INSS por m²)
    basis: "Calculado sobre a Folha ou Faturamento (Aferição de Obra por m²)",
    type: "LABOR"
  }
];
