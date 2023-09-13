export type PropostaPaginadaDTO = {
  id: number;
  tipoFormacao: string;
  areaPromotora: string;
  modalidade: string;
  nomeFormacao: string;
  numeroHomologacao: number;
  periodoRealizacaoInicio: string | null;
  periodoRealizacaoFim: string | null;
  situacao: string;
};
