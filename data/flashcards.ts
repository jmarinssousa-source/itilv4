import { Flashcard } from "@/lib/types";

export const flashcards: Flashcard[] = [
  {
    id: "F001",
    frente: "O que é utilidade?",
    verso: "É quando o serviço é adequado ao propósito e faz o que precisa fazer.",
    exemplo: "Um sistema de chamados que permite registrar solicitações.",
    dica_prova: "Utilidade responde: faz a função certa?",
    area: "Conceitos-chave de gerenciamento de serviços"
  },
  {
    id: "F002",
    frente: "O que é garantia?",
    verso: "É quando o serviço é adequado ao uso, com disponibilidade, capacidade, continuidade e segurança.",
    exemplo: "O sistema de chamados fica disponível no horário combinado.",
    dica_prova: "Garantia responde: funciona bem o suficiente?",
    area: "Conceitos-chave de gerenciamento de serviços"
  },
  {
    id: "F003",
    frente: "Qual é a diferença entre output e outcome?",
    verso: "Output é uma entrega; outcome é o resultado alcançado pelo consumidor.",
    exemplo: "Dashboard é output; decisão mais rápida é outcome.",
    dica_prova: "Entregável x efeito.",
    area: "Conceitos-chave de gerenciamento de serviços"
  },
  {
    id: "F004",
    frente: "Quais são as quatro dimensões?",
    verso: "Organizações e pessoas; informação e tecnologia; parceiros e fornecedores; fluxos de valor e processos.",
    exemplo: "Um novo serviço deve considerar equipe, ferramenta, contrato e processo.",
    dica_prova: "A ITIL cobra visão holística.",
    area: "Quatro dimensões do gerenciamento de serviços"
  },
  {
    id: "F005",
    frente: "Qual é a entrada e a saída do SVS?",
    verso: "Entrada: demanda e oportunidade. Saída: valor.",
    exemplo: "Uma necessidade de cliente entra no sistema e gera valor por meio de serviços.",
    dica_prova: "Demanda/oportunidade entram; valor sai.",
    area: "Sistema de valor de serviço"
  },
  {
    id: "F006",
    frente: "O que governança faz no SVS?",
    verso: "Avalia, direciona e monitora.",
    exemplo: "Definir políticas e acompanhar aderência.",
    dica_prova: "Memorize a tríade: avaliar, direcionar, monitorar.",
    area: "Sistema de valor de serviço"
  },
  {
    id: "F007",
    frente: "O que significa foco no valor?",
    verso: "Tudo que a organização faz deve contribuir para valor aos stakeholders.",
    exemplo: "Priorizar melhoria que reduz impacto real para usuários.",
    dica_prova: "Valor é percebido, não apenas produzido.",
    area: "Princípios orientadores"
  },
  {
    id: "F008",
    frente: "Quando usar 'começar de onde você está'?",
    verso: "Ao avaliar o estado atual e reaproveitar o que funciona antes de mudar.",
    exemplo: "Analisar métricas e processos existentes antes do redesenho.",
    dica_prova: "Não confunda com resistência à mudança.",
    area: "Princípios orientadores"
  },
  {
    id: "F009",
    frente: "Qual a finalidade de gerenciamento de incidentes?",
    verso: "Restaurar a operação normal do serviço o mais rápido possível.",
    exemplo: "Resolver indisponibilidade de e-mail.",
    dica_prova: "Restauração rápida é incidente.",
    area: "Práticas ITIL"
  },
  {
    id: "F010",
    frente: "Qual a finalidade de gerenciamento de problemas?",
    verso: "Reduzir probabilidade e impacto de incidentes por meio da análise de causas.",
    exemplo: "Investigar por que o e-mail cai toda segunda-feira.",
    dica_prova: "Causa raiz é problema.",
    area: "Práticas ITIL"
  }
];
