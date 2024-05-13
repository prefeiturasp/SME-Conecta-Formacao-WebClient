export enum CampoConsideracaoEnum {
  formacaoHomologada = 1,
  tipoFormacao = 2,
  formato = 3,
  tiposInscricao = 4,
  integrarNoSGA = 5,
  dres = 6,
  nomeFormacao = 7,
  publicosAlvo = 8,
  funcoesEspecificas = 9,
  modalidade = 10,
  anosTurmas = 11,
  componentesCurriculares = 12,
  criteriosValidacaoInscricao = 13,
  vagasRemanecentes = 14,
  quantidadeTurmas = 15,
  quantidadeVagasTurma = 16,
  cargaHoraria = 17,
  justificativa = 18,
  objetivos = 19,
  conteudoProgramatico = 20,
  procedimentoMetadologico = 21,
  referencia = 22,
  palavrasChaves = 23,
  periodoRealizacao = 24,
  periodoInscricao = 25,
  cursoComCertificado = 26,
  criterioCertificacao = 27,
  descricaoDaAtividade = 28,
  codigoEventoSigpec = 29,
  linkParaInscricoesExterna = 30,
  funcoesEspecificasOutros = 31,
  criteriosValidacaoInscricaoOutros = 32,
}

export const CampoConsideracaoEnumDisplay: Record<CampoConsideracaoEnum, string> = {
  [CampoConsideracaoEnum.formacaoHomologada]: 'Formação homologada por SME/COPED/DF',
  [CampoConsideracaoEnum.tipoFormacao]: 'Tipo de formação',
  [CampoConsideracaoEnum.formato]: 'Modalidade formativa',
  [CampoConsideracaoEnum.tiposInscricao]: 'Tipos de inscrição',
  [CampoConsideracaoEnum.integrarNoSGA]: 'Integrar no SGA',
  [CampoConsideracaoEnum.dres]: 'DRE',
  [CampoConsideracaoEnum.nomeFormacao]: 'Nome da formação',
  [CampoConsideracaoEnum.publicosAlvo]: 'Público alvo',
  [CampoConsideracaoEnum.funcoesEspecificas]: 'Função específica',
  [CampoConsideracaoEnum.modalidade]: 'Etapa/Modalidade',
  [CampoConsideracaoEnum.anosTurmas]: 'Ano/Etapa',
  [CampoConsideracaoEnum.componentesCurriculares]: 'Componente Curricular',
  [CampoConsideracaoEnum.criteriosValidacaoInscricao]: 'Critérios para validação das inscrições',
  [CampoConsideracaoEnum.vagasRemanecentes]: 'Em caso de vagas remanescentes',
  [CampoConsideracaoEnum.quantidadeTurmas]: 'Quantidade de turmas',
  [CampoConsideracaoEnum.quantidadeVagasTurma]: 'Vagas por turma',
  [CampoConsideracaoEnum.cargaHoraria]: 'Carga horária',
  [CampoConsideracaoEnum.justificativa]: 'Justificativa',
  [CampoConsideracaoEnum.objetivos]: 'Objetivos',
  [CampoConsideracaoEnum.conteudoProgramatico]: 'Conteúdo programático',
  [CampoConsideracaoEnum.procedimentoMetadologico]: 'Procedimentos metodológicos',
  [CampoConsideracaoEnum.referencia]: 'Referências',
  [CampoConsideracaoEnum.palavrasChaves]: 'Palavras-chave',
  [CampoConsideracaoEnum.periodoRealizacao]: 'Período de realização',
  [CampoConsideracaoEnum.periodoInscricao]: 'Período de inscrição',
  [CampoConsideracaoEnum.cursoComCertificado]: 'Curso com certificação',
  [CampoConsideracaoEnum.criterioCertificacao]: 'Critérios para certificação',
  [CampoConsideracaoEnum.descricaoDaAtividade]:
    'Descrição da atividade obrigatória para certificação',
  [CampoConsideracaoEnum.codigoEventoSigpec]: 'Código do Evento (SIGPEC)',
  [CampoConsideracaoEnum.linkParaInscricoesExterna]: 'Link para Inscrições',
  [CampoConsideracaoEnum.funcoesEspecificasOutros]: 'Funções Específicas (Outros)',
  [CampoConsideracaoEnum.criteriosValidacaoInscricaoOutros]:
    'Critérios para validação das inscrições (Outros)',
};

export const CamposParecerNomeEnumDisplay: Record<CampoConsideracaoEnum, string> = {
  [CampoConsideracaoEnum.formacaoHomologada]: 'formacaoHomologada',
  [CampoConsideracaoEnum.tipoFormacao]: 'tipoFormacao',
  [CampoConsideracaoEnum.formato]: 'formato',
  [CampoConsideracaoEnum.tiposInscricao]: 'tiposInscricao',
  [CampoConsideracaoEnum.integrarNoSGA]: 'integrarNoSGA',
  [CampoConsideracaoEnum.dres]: 'dres',
  [CampoConsideracaoEnum.nomeFormacao]: 'nomeFormacao',
  [CampoConsideracaoEnum.publicosAlvo]: 'publicosAlvo',
  [CampoConsideracaoEnum.funcoesEspecificas]: 'funcoesEspecificas',
  [CampoConsideracaoEnum.modalidade]: 'modalidade',
  [CampoConsideracaoEnum.anosTurmas]: 'anosTurmas',
  [CampoConsideracaoEnum.componentesCurriculares]: 'componentesCurriculares',
  [CampoConsideracaoEnum.criteriosValidacaoInscricao]: 'criteriosValidacaoInscricao',
  [CampoConsideracaoEnum.vagasRemanecentes]: 'vagasRemanecentes',
  [CampoConsideracaoEnum.quantidadeTurmas]: 'quantidadeTurmas',
  [CampoConsideracaoEnum.quantidadeVagasTurma]: 'quantidadeVagasTurma',
  [CampoConsideracaoEnum.cargaHoraria]: 'cargaHoraria',
  [CampoConsideracaoEnum.justificativa]: 'justificativa',
  [CampoConsideracaoEnum.objetivos]: 'objetivos',
  [CampoConsideracaoEnum.conteudoProgramatico]: 'conteudoProgramatico',
  [CampoConsideracaoEnum.procedimentoMetadologico]: 'procedimentoMetadologico',
  [CampoConsideracaoEnum.referencia]: 'referencia',
  [CampoConsideracaoEnum.palavrasChaves]: 'palavrasChaves',
  [CampoConsideracaoEnum.periodoRealizacao]: 'periodoRealizacao',
  [CampoConsideracaoEnum.periodoInscricao]: 'periodoInscricao',
  [CampoConsideracaoEnum.cursoComCertificado]: 'cursoComCertificado',
  [CampoConsideracaoEnum.criterioCertificacao]: 'criterioCertificacao',
  [CampoConsideracaoEnum.descricaoDaAtividade]: 'descricaoDaAtividade',
  [CampoConsideracaoEnum.codigoEventoSigpec]: 'codigoEventoSigpec',
  [CampoConsideracaoEnum.linkParaInscricoesExterna]: 'linkParaInscricoesExterna',
  [CampoConsideracaoEnum.funcoesEspecificasOutros]: 'funcoesEspecificasOutros',
  [CampoConsideracaoEnum.criteriosValidacaoInscricaoOutros]: 'criteriosValidacaoInscricaoOutros',
};
