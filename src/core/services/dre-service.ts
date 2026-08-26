import { DreDTO } from '../dto/retorno-listagem-dto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/Dre';

const obterDREs = (exibirOpcaoTodos?: boolean) =>
  obterRegistro<DreDTO[]>(URL_DEFAULT, { params: { exibirOpcaoTodos } });

export { obterDREs };


const obterDREsUsuarioLogado = () =>
  obterRegistro<DreDTO[]>(URL_DEFAULT + '/usuario-logado');

export { obterDREsUsuarioLogado };
