import { AreaPromotoraTipoEnum } from '../enum/area-promotora-tipo';

export interface PropostaInformacoesCadastranteDTO {
  usuarioLogadoNome: string;
  usuarioLogadoEmail: string;
  areaPromotora: string;
  areaPromotoraTipo: string;
  areaPromotoraTipoId: AreaPromotoraTipoEnum;
  areaPromotoraTelefones: string;
  areaPromotoraEmails: string;
}
