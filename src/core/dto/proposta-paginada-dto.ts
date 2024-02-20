export type PropostaPaginadaDTO = {
  id: number;
  tipoFormacao: string;
  areaPromotora: string;
  modalidade: string;
  nomeFormacao: string;
  numeroHomologacao: number | null;
  dataRealizacaoInicio: string | null;
  dataRealizacaoFim: string | null;
  situacao: string;
};
