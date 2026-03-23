import { inserirRegistro } from './api';

const URL_DEFAULT = 'v1/relatorio';

export type RelatorioInscritosPorFormacaoFiltrosDTO = {
  propostaId?: number;
  numeroHomologacao?: number;
  nomeFormacao?: string;
  propostaTurmaId?: number;
  formato?: number;
  areaPromotoraId?: number;
  periodoDeRealizacaoInicial?: string;
  periodoDeRealizacaoFinal?: string;
  situacaoProposta?: number;
  situacaoInscricao?: number;
  cargoPublicoAlvoId?: number;
  funcaoId?: number;
  modalidade?: number;
  anoTurmaId?: number;
  componenteCurricularId?: number;
  dreId?: number;
  ueId?: string;
  documentoCursista?: string;
  email?: string;
  pcd?: boolean;
  necessitaAdaptacao?: boolean;
};

const gerarRelatorioInscritosPorFormacao = (params: RelatorioInscritosPorFormacaoFiltrosDTO) =>
  inserirRegistro(`${URL_DEFAULT}/inscritos-por-formacao`, params);

export { gerarRelatorioInscritosPorFormacao };
