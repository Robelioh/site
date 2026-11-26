/* =========================================================================
   CONTEÚDO DOS SEGMENTOS — TeAtende
   -------------------------------------------------------------------------
   ATENÇÃO: os textos abaixo são um RASCUNHO comercial. Revise cada item e
   remova qualquer recurso que o TeAtende NÃO tenha hoje. Prometer recurso
   inexistente no site gera venda frustrada e cancelamento.
   ========================================================================= */

export const CONFIG = {
  empresa: "RBI Tecnologia em Gestão",
  razaoSocial: "TE ATENDE TECNOLOGIA EM GESTAO LTDA",
  cnpj: "51.366.373/0001-11",
  produto: "TeAtende",
  site: "https://rbitecnologia.com.br",
  whatsapp: "5534999440693", // DDI + DDD + número, só dígitos
  whatsappExibir: "(34) 99944-0693",
  email: "comercial@rbitecnologia.com.br",
  // TODO: telefone fixo (deixe "" para ocultar)
  telefone: "",
  endereco: "Rua Manuel de Souza, 20, Sala 01 — Parque dos Verdes",
  cidade: "Araguari - MG",
  cep: "38445-560",
};

export const GRUPOS = {
  comercio: "Comércio e varejo",
  industria: "Indústria e construção",
  servicos: "Serviços e oficinas",
  logistica: "Logística e ambiental",
  agro: "Agro",
  pessoas: "Associações e pessoas",
};

export const MODULOS = {
  nfe: "NF-e",
  nfce: "NFC-e / PDV",
  cte: "CT-e",
  mdfe: "MDF-e",
  estoque: "Estoque",
  compras: "Compras",
  financeiro: "Contas a pagar e receber",
  lote: "Baixa em lote",
  os: "Ordem de serviço",
  producao: "Produção",
  balanca: "Integração com balança",
  frota: "Frota e fretes",
  mensalidade: "Mensalidades e cobrança",
  obras: "Centro de custo por obra",
  entregas: "Pedidos e entregas",
  ponto: "Controle de ponto",
};

// Os 6 módulos oficiais do TeAtende. Cada um agrupa as funcionalidades de MODULOS (a classificação é uma
// decisão de produto: ajuste aqui e rode `node scripts/gerar-paginas.mjs`).
export const AREAS = {
  erp: {
    nome: "ERP",
    resumo: "A base que conecta tudo: a venda baixa o estoque, gera o título e emite a nota, sem redigitar. Venda e frente de caixa, estoque, compras e relatórios no mesmo cadastro.",
    itens: ["estoque", "compras", "os", "frota", "entregas", "obras"],
  },
  financeiro: {
    nome: "Financeiro",
    resumo: "Contas a pagar e a receber geradas pelas vendas e compras, com fluxo de caixa, inadimplência e baixa em lote de dezenas de títulos de uma vez.",
    itens: ["financeiro", "lote", "mensalidade"],
  },
  fiscal: {
    nome: "Fiscal",
    resumo: "Emissão, cancelamento, carta de correção e inutilização de documentos fiscais eletrônicos, com XML armazenado e enviado ao contador.",
    itens: ["nfe", "nfce", "cte", "mdfe"],
  },
  producao: {
    nome: "Produção",
    resumo: "Ficha técnica para calcular o consumo de matéria-prima e o custo de produção, ligada ao pedido e ao faturamento.",
    itens: ["producao"],
  },
  balanca: {
    nome: "Balança",
    resumo: "Integração com balança para pesagem, com ticket de pesagem e leitura de etiqueta no caixa.",
    itens: ["balanca"],
  },
  ponto: {
    nome: "Ponto",
    resumo: "Controle de ponto e da jornada dos funcionários.",
    itens: ["ponto"],
  },
};
// funcionalidade -> chave do módulo oficial (ex.: cte -> "fiscal")
export const MODULO_AREA = Object.fromEntries(Object.entries(AREAS).flatMap(([k, a]) => a.itens.map((i) => [i, k])));

// Descrição curta de cada funcionalidade (usada nas páginas por segmento).
// Derivadas do texto já publicado na home e dos itens de "solucoes" de cada segmento: valide com quem conhece o produto.
export const MODULOS_DESC = {
  nfe: "Emissão, cancelamento, carta de correção e inutilização de NF-e, com XML armazenado e enviado ao contador.",
  nfce: "Frente de caixa com venda rápida no balcão, várias formas de pagamento, fechamento de caixa por operador e emissão de NFC-e.",
  cte: "Emissão e cancelamento de CT-e a partir do cadastro da carga, com XML armazenado.",
  mdfe: "Emissão e encerramento de MDF-e sem redigitar os dados do CT-e.",
  estoque: "Estoque mínimo, inventário e histórico de movimentação, com baixa automática a cada venda.",
  compras: "Entrada de mercadoria por XML do fornecedor e pedidos de compra com histórico.",
  financeiro: "Contas a pagar e a receber geradas pelas vendas e compras, com fluxo de caixa e controle de inadimplência.",
  lote: "Baixa em lote: quite dezenas de títulos, pagamentos ou recebimentos, de uma só vez.",
  os: "Ordem de serviço com orçamento, peças e mão de obra, ligada ao estoque e ao faturamento.",
  producao: "Ficha técnica para calcular o consumo de matéria-prima e o custo de produção, ligada ao pedido e ao faturamento.",
  balanca: "Integração com balança para pesagem, com ticket de pesagem e leitura de etiqueta no caixa.",
  frota: "Custos de frete, pedágio e combustível ligados à viagem, para saber o resultado de cada uma.",
  mensalidade: "Cobranças recorrentes, controle de inadimplência e baixa em lote dos pagamentos recebidos.",
  obras: "Centro de custo por obra em compras e contas a pagar, com acompanhamento do custo realizado.",
  entregas: "Lançamento de pedidos pelo telefone, acerto por entregador e controle de vasilhames por cliente.",
  ponto: "Controle de ponto e da jornada dos funcionários.", // única descrição confirmada: detalhe só com o que o produto faz
};

// Documentos fiscais: explicação factual (não é promessa de funcionalidade).
export const DOCS_FISCAIS = {
  nfe: ["NF-e", "Nota Fiscal Eletrônica (modelo 55)", "Documento fiscal digital da venda de mercadorias, autorizado pela SEFAZ antes da saída do produto."],
  nfce: ["NFC-e", "Nota Fiscal de Consumidor Eletrônica (modelo 65)", "Documento fiscal digital da venda no varejo ao consumidor final, emitido no ponto de venda."],
  cte: ["CT-e", "Conhecimento de Transporte Eletrônico", "Documento fiscal que a transportadora emite para registrar a prestação do serviço de transporte de cargas."],
  mdfe: ["MDF-e", "Manifesto Eletrônico de Documentos Fiscais", "Reúne, em uma única viagem, os documentos fiscais da carga transportada e precisa ser encerrado ao fim do percurso."],
};

export const SEGMENTOS = [
  {
    id: "transporte",
    slug: "transportadora", // URL: /sistema-para-transportadora/
    kw: "transportadora", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Transportadora",
    grupo: "logistica",
    icone: "truck",
    termos: "transporte transportadora frete caminhao logistica carga cte mdfe",
    frase: "Do CT-e ao acerto do motorista, sem planilha paralela.",
    dores: [
      "Emitir CT-e e MDF-e em sistemas separados e redigitar dados",
      "Não saber o lucro real de cada viagem",
      "Frete faturado à mão depois da viagem, quando não é esquecido",
    ],
    solucoes: [
      "CT-e e MDF-e emitidos a partir do mesmo cadastro de carga",
      "Custo de frete, pedágio e combustível ligados à viagem",
      "Contas a receber geradas direto dos conhecimentos emitidos",
    ],
    modulos: ["cte", "mdfe", "frota", "financeiro", "lote"],
  },
  {
    id: "comercio",
    slug: "comercio", // URL: /sistema-para-comercio/
    kw: "comércio", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Comércio em geral",
    grupo: "comercio",
    icone: "store",
    termos: "comercio loja varejo mercado mercearia atacado vendas pdv caixa",
    frase: "Caixa rápido no balcão, estoque certo no fim do dia.",
    dores: [
      "Fila no caixa em horário de pico",
      "Estoque do sistema que nunca bate com a prateleira",
      "Fiado e crediário controlados no caderno",
    ],
    solucoes: [
      "PDV ágil com emissão fiscal integrada",
      "Baixa de estoque automática a cada venda e entrada por XML",
      "Crediário e contas a receber com baixa em lote",
    ],
    modulos: ["nfce", "nfe", "estoque", "compras", "financeiro", "lote"],
  },
  {
    id: "botinas",
    slug: "fabrica-de-calcados", // URL: /sistema-para-fabrica-de-calcados/
    kw: "fábrica de calçados e botinas", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Fábrica de botinas e calçados",
    grupo: "industria",
    icone: "boot",
    termos: "fabrica botina calcado sapato bota industria epi couro solado producao grade numeracao",
    frase: "Produção por grade de numeração, do couro à expedição.",
    dores: [
      "Controlar estoque por número (37, 38, 39…) na mão",
      "Não saber quanto de couro e solado cada pedido consome",
      "Pedidos de revenda com prazo apertado e sem visibilidade",
    ],
    solucoes: [
      "Produtos com grade de numeração e estoque por tamanho",
      "Ficha técnica para calcular consumo de matéria-prima",
      "Pedidos de venda ligados à ordem de produção e ao faturamento",
    ],
    modulos: ["producao", "estoque", "compras", "nfe", "financeiro"],
  },
  {
    id: "oficina",
    slug: "oficina-mecanica", // URL: /sistema-para-oficina-mecanica/
    kw: "oficina mecânica", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Oficina de veículos",
    grupo: "servicos",
    icone: "wrench",
    termos: "oficina mecanica auto centro carro moto veiculo funilaria servico os ordem placa",
    frase: "Ordem de serviço com peça, mão de obra e histórico por placa.",
    dores: [
      "Orçamento no papel que some antes da aprovação do cliente",
      "Peça usada no serviço que não sai do estoque",
      "Não lembrar o que foi feito no carro da última vez",
    ],
    solucoes: [
      "OS com orçamento, aprovação, peças e mão de obra",
      "Baixa automática das peças aplicadas",
      "Histórico de serviços por veículo e por cliente",
    ],
    modulos: ["os", "estoque", "nfe", "nfce", "financeiro"],
  },
  {
    id: "agricolas",
    slug: "maquinas-agricolas", // URL: /sistema-para-maquinas-agricolas/
    kw: "máquinas agrícolas", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Máquinas agrícolas e equipamentos",
    grupo: "agro",
    icone: "tractor",
    termos: "agricola maquina trator implemento equipamento revenda assistencia tecnica serie peca",
    frase: "Venda, peças e assistência técnica no mesmo lugar.",
    dores: [
      "Equipamento vendido sem controle de número de série",
      "Assistência técnica de campo sem registro de horas e peças",
      "Peças de reposição com giro baixo e capital parado",
    ],
    solucoes: [
      "Controle por número de série do equipamento",
      "Ordem de serviço para assistência com peças e deslocamento",
      "Relatórios de giro de estoque para comprar melhor",
    ],
    modulos: ["nfe", "os", "estoque", "compras", "financeiro"],
  },
  {
    id: "construtora",
    slug: "construtora", // URL: /sistema-para-construtora/
    kw: "construtora", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Construtora",
    grupo: "industria",
    icone: "building",
    termos: "construtora construcao obra engenharia empreiteira reforma incorporadora",
    frase: "Cada obra com seu custo, sua compra e seu resultado.",
    dores: [
      "Gasto de uma obra lançado em outra",
      "Compras emergenciais sem aprovação",
      "Descobrir que a obra deu prejuízo só no final",
    ],
    solucoes: [
      "Centro de custo por obra em compras e contas a pagar",
      "Requisição e pedido de compra com histórico",
      "Acompanhamento de custo realizado por obra",
    ],
    modulos: ["obras", "compras", "estoque", "financeiro", "lote"],
  },
  {
    id: "bebidas",
    slug: "distribuidora-de-bebidas", // URL: /sistema-para-distribuidora-de-bebidas/
    kw: "distribuidora de bebidas", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Disk bebidas e distribuidora",
    grupo: "comercio",
    icone: "bottle",
    termos: "disk bebida distribuidora cerveja refrigerante gas agua deposito entrega delivery vasilhame casco",
    frase: "Pedido pelo telefone, entrega na porta, caixa fechado certo.",
    dores: [
      "Pedido anotado errado no telefone ou WhatsApp",
      "Entregador volta e o dinheiro não bate",
      "Vasilhame/casco emprestado sem controle",
    ],
    solucoes: [
      "Lançamento rápido de pedido pelo telefone do cliente",
      "Acerto de entregas por entregador",
      "Controle de vasilhames por cliente",
    ],
    modulos: ["entregas", "nfce", "estoque", "financeiro"],
  },
  {
    id: "agropecuaria",
    slug: "agropecuaria", // URL: /sistema-para-agropecuaria/
    kw: "agropecuária", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Agropecuária",
    grupo: "agro",
    icone: "leaf",
    termos: "agropecuaria agro racao veterinario semente adubo fertilizante produtor rural fazenda",
    frase: "Venda ao produtor rural com prazo de safra sob controle.",
    dores: [
      "Venda a prazo para pagamento na safra sem acompanhamento",
      "Produtos com lote e validade vencendo na prateleira",
      "Cadastro de produtor rural e inscrição estadual confusos",
    ],
    solucoes: [
      "Contas a receber com vencimentos longos e negociação",
      "Controle de lote e validade no estoque",
      "Cadastro de cliente pessoa física ou produtor rural para NF-e",
    ],
    modulos: ["nfe", "nfce", "estoque", "financeiro", "lote"],
  },
  {
    id: "eletrico",
    slug: "material-eletrico", // URL: /sistema-para-material-eletrico/
    kw: "loja de material elétrico", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Material elétrico",
    grupo: "comercio",
    icone: "bolt",
    termos: "material eletrico eletrica fio cabo iluminacao eletricista construcao",
    frase: "Milhares de itens, orçamento rápido para o eletricista.",
    dores: [
      "Catálogo enorme e item difícil de achar no balcão",
      "Orçamento de obra feito à mão e perdido",
      "Venda por metro e por rolo no mesmo produto",
    ],
    solucoes: [
      "Busca de produto por código, descrição ou fabricante",
      "Orçamento convertido em venda com um clique",
      "Unidades de venda diferentes para o mesmo item",
    ],
    modulos: ["nfce", "nfe", "estoque", "compras", "financeiro"],
  },
  {
    id: "pecas",
    slug: "loja-de-pecas", // URL: /sistema-para-loja-de-pecas/
    kw: "loja de peças", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Loja de peças",
    grupo: "comercio",
    icone: "gear",
    termos: "loja de pecas autopecas moto pecas reposicao aplicacao codigo fabricante",
    frase: "A peça certa pelo código, pela aplicação ou pelo similar.",
    dores: [
      "Cliente chega com a peça na mão e ninguém acha o código",
      "Mesma peça com códigos diferentes por fabricante",
      "Estoque parado de peça que não gira",
    ],
    solucoes: [
      "Busca por código original, fabricante e aplicação",
      "Cadastro de equivalências entre marcas",
      "Curva de giro para orientar a compra",
    ],
    modulos: ["nfce", "nfe", "estoque", "compras", "financeiro"],
  },
  {
    id: "sindicato",
    slug: "sindicato-e-associacao", // URL: /sistema-para-sindicato-e-associacao/
    kw: "sindicato e associação", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Sindicato e associação",
    grupo: "pessoas",
    icone: "users",
    termos: "sindicato associacao entidade associado filiado contribuicao mensalidade cooperativa clube",
    frase: "Associados, contribuições e inadimplência num só painel.",
    dores: [
      "Lista de associados desatualizada",
      "Contribuições recebidas sem conciliação",
      "Inadimplência descoberta tarde demais",
    ],
    solucoes: [
      "Cadastro de associados com situação e histórico",
      "Geração de cobranças recorrentes",
      "Baixa em lote dos recebimentos e relatório de inadimplentes",
    ],
    modulos: ["mensalidade", "financeiro", "lote"],
  },
  {
    id: "residuos",
    slug: "gestao-de-residuos", // URL: /sistema-para-gestao-de-residuos/
    kw: "empresa de gestão de resíduos", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Gestão de resíduos",
    grupo: "logistica",
    icone: "recycle",
    termos: "residuo coleta lixo reciclagem cacamba entulho ambiental descarte",
    frase: "Coletas, rotas e faturamento recorrente sem perder nada.",
    dores: [
      "Coleta realizada que não foi faturada",
      "Contratos recorrentes controlados em planilha",
      "Pesagem do material sem registro confiável",
    ],
    solucoes: [
      "Registro de coletas por cliente e período",
      "Faturamento a partir das coletas realizadas",
      "Integração com balança para pesagem",
    ],
    modulos: ["frota", "balanca", "nfe", "financeiro", "lote"],
  },
  {
    id: "areia",
    slug: "areia-e-brita", // URL: /sistema-para-areia-e-brita/
    kw: "areia, brita e agregados", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Areia, brita e agregados",
    grupo: "industria",
    icone: "mountain",
    termos: "areia brita pedra agregado pedreira porto de areia cascalho terra m3 tonelada",
    frase: "Do ticket de pesagem à nota, sem caderno no balcão.",
    dores: [
      "Carga saindo sem pesagem registrada",
      "Conversão entre m³ e tonelada feita de cabeça",
      "Venda com frete incluso sem custo controlado",
    ],
    solucoes: [
      "Integração com balança rodoviária e ticket de pesagem",
      "Venda por m³ ou tonelada com conversão configurada",
      "Frete lançado junto com a venda",
    ],
    modulos: ["balanca", "nfe", "estoque", "frota", "financeiro"],
  },
  {
    id: "joalheria",
    slug: "joalheria", // URL: /sistema-para-joalheria/
    kw: "relojoaria e joalheria", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Relojoaria e joalheria",
    grupo: "comercio",
    icone: "gem",
    termos: "relojoaria joalheria joia relogio ourives otica ouro prata conserto bateria",
    frase: "Peças de alto valor e consertos com rastreio do início ao fim.",
    dores: [
      "Relógio de cliente em conserto sem comprovante formal",
      "Peças de alto valor sem identificação individual",
      "Venda parcelada com risco de inadimplência",
    ],
    solucoes: [
      "Ordem de serviço com entrada, previsão e retirada",
      "Controle individual de peças (código/série)",
      "Parcelamento com acompanhamento no contas a receber",
    ],
    modulos: ["os", "nfce", "estoque", "financeiro"],
  },
  {
    id: "padaria",
    slug: "padaria", // URL: /sistema-para-padaria/
    kw: "padaria e confeitaria", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Padaria e confeitaria",
    grupo: "comercio",
    icone: "bread",
    termos: "padaria panificadora confeitaria lanchonete pao bolo doceria cafe",
    frase: "Balcão rápido, balança integrada e produção do dia na conta.",
    dores: [
      "Fila no caixa às 7h da manhã",
      "Produto pesado na balança redigitado no caixa",
      "Não saber o custo real do pão francês",
    ],
    solucoes: [
      "PDV rápido com leitura de etiqueta de balança",
      "Integração com balança de balcão",
      "Ficha técnica para custo de produção",
    ],
    modulos: ["nfce", "balanca", "producao", "estoque", "financeiro"],
  },
  {
    id: "danca",
    slug: "estudio-de-danca", // URL: /sistema-para-estudio-de-danca/
    kw: "estúdio de dança e academia", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Estúdio de dança e academia",
    grupo: "pessoas",
    icone: "music",
    termos: "estudio danca ballet academia escola curso aula aluno turma mensalidade pilates",
    frase: "Alunos, turmas e mensalidades sem cobrar ninguém no WhatsApp.",
    dores: [
      "Mensalidade atrasada que ninguém lembrou de cobrar",
      "Turmas lotadas ou vazias sem visão clara",
      "Matrícula e rematrícula em papel",
    ],
    solucoes: [
      "Mensalidades recorrentes e controle de inadimplência",
      "Cadastro de alunos vinculados a turmas",
      "Baixa em lote dos pagamentos recebidos",
    ],
    modulos: ["mensalidade", "financeiro", "lote"],
  },
  {
    id: "balanca",
    slug: "balancas-e-pesagem", // URL: /sistema-para-balancas-e-pesagem/
    kw: "balanças e pesagem", // como o cliente busca (aparece em título, H1 e textos)
    nome: "Balanças e pesagem",
    grupo: "servicos",
    icone: "scale",
    termos: "balanca pesagem aferição afericao calibracao assistencia tecnica balanca rodoviaria inmetro",
    frase: "Venda, assistência e calibração de balanças organizadas.",
    dores: [
      "Vencimento de aferição do cliente esquecido",
      "Atendimento técnico sem histórico do equipamento",
      "Peças e serviços faturados separadamente",
    ],
    solucoes: [
      "Cadastro do equipamento do cliente com histórico",
      "Ordem de serviço técnica com peças e mão de obra",
      "Faturamento de produto e serviço integrados",
    ],
    modulos: ["os", "nfe", "estoque", "financeiro"],
  },
];
