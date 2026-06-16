import { TrapCard } from "@/lib/types";

export const trapCards: TrapCard[] = [
  {
    id: "trap-01",
    title: "Incidente x problema",
    conceito_principal: "Incidente restaura serviço; problema investiga causa.",
    como_confunde: "A prova descreve falha recorrente e oferece alternativas que misturam restauração rápida com causa raiz.",
    exemplo_pergunta: "Qual prática deve investigar a causa de incidentes repetidos?",
    dica_memorizacao: "Incidente apaga o fogo; problema descobre por que o fogo começou."
  },
  {
    id: "trap-02",
    title: "Utilidade x garantia",
    conceito_principal: "Utilidade é adequação ao propósito; garantia é adequação ao uso.",
    como_confunde: "Disponibilidade e capacidade aparecem como se fossem função do serviço.",
    exemplo_pergunta: "O serviço faz o que o cliente precisa, mas cai com frequência. O que falta?",
    dica_memorizacao: "Utilidade faz a coisa certa. Garantia faz a coisa certa funcionar bem."
  },
  {
    id: "trap-03",
    title: "Output x outcome",
    conceito_principal: "Output é entrega; outcome é resultado alcançado.",
    como_confunde: "Um relatório, aplicativo ou dashboard é tratado como se fosse o benefício final.",
    exemplo_pergunta: "O relatório que permite reduzir atrasos é output ou outcome?",
    dica_memorizacao: "Output sai do provedor. Outcome muda a realidade do consumidor."
  },
  {
    id: "trap-04",
    title: "Cliente x usuário x patrocinador",
    conceito_principal: "Cliente define requisito; usuário usa; patrocinador autoriza orçamento.",
    como_confunde: "A questão usa 'cliente' de forma coloquial e cobra o papel formal.",
    exemplo_pergunta: "Quem aprova o orçamento para consumir um serviço?",
    dica_memorizacao: "Define, usa, paga: cliente, usuário, patrocinador."
  },
  {
    id: "trap-05",
    title: "Mudança x requisição de serviço",
    conceito_principal: "Mudança altera estado e envolve risco; requisição é pedido padronizado.",
    como_confunde: "Solicitar acesso parece mudança, mas pode ser requisição se for pré-aprovado.",
    exemplo_pergunta: "Pedido padrão de acesso a sistema já aprovado é tratado por qual prática?",
    dica_memorizacao: "Padronizado e pré-aprovado: requisição."
  },
  {
    id: "trap-06",
    title: "Liberação x implantação",
    conceito_principal: "Liberação disponibiliza versões; implantação move componentes para ambientes.",
    como_confunde: "As palavras são usadas como sinônimos em conversas do dia a dia.",
    exemplo_pergunta: "Qual prática disponibiliza funcionalidades novas para uso?",
    dica_memorizacao: "Implantar coloca no ambiente; liberar torna disponível."
  },
  {
    id: "trap-07",
    title: "Evento x incidente",
    conceito_principal: "Evento é mudança de estado detectada; incidente é interrupção ou redução de qualidade.",
    como_confunde: "Todo alerta é tratado como incidente, mesmo sem impacto no serviço.",
    exemplo_pergunta: "Um alerta de CPU sem indisponibilidade é inicialmente o quê?",
    dica_memorizacao: "Evento pode virar incidente, mas não nasce incidente sempre."
  },
  {
    id: "trap-08",
    title: "Serviço x produto",
    conceito_principal: "Produto é configuração de recursos; serviço permite cocriação de valor.",
    como_confunde: "A prova descreve um aplicativo e pergunta pelo conceito mais amplo.",
    exemplo_pergunta: "Um app, suporte e dados agrupados para atender clientes formam o quê?",
    dica_memorizacao: "Produto empacota recursos; serviço habilita valor."
  },
  {
    id: "trap-09",
    title: "Custo x risco",
    conceito_principal: "Custo é gasto; risco é incerteza que pode afetar objetivos.",
    como_confunde: "A questão fala em possível perda e oferece alternativa de custo.",
    exemplo_pergunta: "Chance de indisponibilidade em período crítico representa custo ou risco?",
    dica_memorizacao: "Custo dói no orçamento; risco mora na incerteza."
  },
  {
    id: "trap-10",
    title: "Valor x resultado",
    conceito_principal: "Resultado contribui para valor, mas valor depende da percepção.",
    como_confunde: "Um outcome positivo é tratado automaticamente como valor para todos.",
    exemplo_pergunta: "Uma redução de tempo sempre gera valor igual para todas as partes?",
    dica_memorizacao: "Valor precisa de percepção e contexto."
  },
  {
    id: "trap-11",
    title: "Otimizar x automatizar",
    conceito_principal: "Otimizar vem antes de automatizar.",
    como_confunde: "A alternativa com ferramenta parece moderna e atraente.",
    exemplo_pergunta: "O que fazer antes de automatizar um processo confuso?",
    dica_memorizacao: "Automação acelera. Se o caminho está errado, ela acelera o erro."
  },
  {
    id: "trap-12",
    title: "Começar de onde está x transformar tudo do zero",
    conceito_principal: "Avalie o estado atual antes de propor mudanças.",
    como_confunde: "A prova oferece transformação radical como se fosse sempre melhor.",
    exemplo_pergunta: "Por que analisar práticas atuais antes de redesenhar um serviço?",
    dica_memorizacao: "Não jogue fora valor existente sem observar."
  }
];
