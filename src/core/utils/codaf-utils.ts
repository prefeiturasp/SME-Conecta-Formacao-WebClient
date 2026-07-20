import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { RegrasAprovacaoCursistaCodafDto } from '../dto/cursista-dto';

/**
 * @interface RetificacaoDTO
 * @description Objeto de Transferência de Dados (DTO) padrão para payloads e respostas da API de Retificações.
 */
export interface RetificacaoDTO {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
}

/**
 * @interface RetificacaoMapEntry
 * @description Representação do estado interno de uma retificação original da API para rastrear IDs em requisições PUT.
 */
export interface RetificacaoMapEntry {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
}

/**
 * @interface HydrationResult
 * @description O resultado estrutural retornado após hidratar o formulário de retificações. Contém o mapa de retificações, as chaves ativas e o contador total.
 * @property {Map<number, RetificacaoMapEntry>} retificacoesMap - Mapeamento das retificações originais da API.
 * @property {number[]} retificacaoKeys - Lista de chaves numéricas ativas no formulário.
 * @property {number} contadorRetificacoes - Contagem total de retificações atualmente no formulário.
 */
export interface HydrationResult {
  retificacoesMap: Map<number, RetificacaoMapEntry>;
  retificacaoKeys: number[];
  contadorRetificacoes: number;
}

/**
 * @function formatRetificacaoKey
 * @description Formata um índice numérico em um sufixo de string preenchido com zeros para chaves planas do AntD.
 * @param {number} num - O índice da retificação.
 * @returns {string} String de dois dígitos (ex.: "01", "02").
 */
export const formatRetificacaoKey = (num: number): string => num.toString().padStart(2, '0');

/**
 * @function hydrateRetificacoesForm
 * @description Hidrata uma instância de formulário do Ant Design com chaves planas de retificações, correspondendo ao contrato do componente SecaoRetificacoes.
 * @template T - O tipo dos valores do formulário.
 * @param {FormInstance<T>} form - A instância do formulário do Ant Design.
 * @param {RetificacaoDTO[]} [retificacoesApi] - O array de retificações recuperadas da API.
 * @returns {HydrationResult | null} O mapa e as chaves necessárias para o estado do componente, ou null se não houver dados.
 */
export function hydrateRetificacoesForm<T = any>(
  form: FormInstance<T>,
  retificacoesApi?: RetificacaoDTO[]
): HydrationResult | null {
  if (!retificacoesApi || retificacoesApi.length === 0) {
    return null;
  }

  const retificacoesMap = new Map<number, RetificacaoMapEntry>();
  const flatFormValues: Record<string, any> = {};

  retificacoesApi.forEach((retificacao, index) => {
    const key = index + 1;
    const formattedNum = formatRetificacaoKey(key);

    retificacoesMap.set(key, {
      id: retificacao.id,
      dataRetificacao: retificacao.dataRetificacao,
      paginaRetificacaoDom: retificacao.paginaRetificacaoDom,
    });

    flatFormValues[`dataRetificacao${formattedNum}`] = retificacao.dataRetificacao
      ? dayjs(retificacao.dataRetificacao)
      : null;
      
    flatFormValues[`paginaRetificacao${formattedNum}`] = retificacao.paginaRetificacaoDom;
  });

  // Bulk update to avoid multiple re-renders
  form.setFieldsValue(flatFormValues as any);

  return {
    retificacoesMap,
    retificacaoKeys: Array.from(retificacoesMap.keys()),
    contadorRetificacoes: retificacoesMap.size,
  };
}

/**
 * @function extractRetificacoesPayload
 * @description Extrai e formata os valores planos do formulário AntD de volta para um array de RetificacaoDTO para requisições POST/PUT.
 * @template T - O tipo dos valores do formulário.
 * @param {T} formValues - Os valores brutos extraídos do formulário AntD.
 * @param {number[]} activeKeys - As chaves de retificações atualmente ativas no estado local do componente.
 * @param {Map<number, RetificacaoMapEntry>} [originaisMap] - Mapa opcional dos dados originais da API para preservar IDs durante o PUT.
 * @returns {RetificacaoDTO[]} Array formatado pronto para o payload da API.
 */
export function extractRetificacoesPayload<T extends Record<string, any>>(
  formValues: T,
  activeKeys: number[],
  originaisMap?: Map<number, RetificacaoMapEntry>
): RetificacaoDTO[] {
  return activeKeys
    .map((key) => {
      const formattedNum = formatRetificacaoKey(key);
      const rawData = formValues[`dataRetificacao${formattedNum}`];
      const rawPagina = formValues[`paginaRetificacao${formattedNum}`];

      const dataParsed =
        rawData instanceof Date || dayjs.isDayjs(rawData)
          ? dayjs(rawData).format('YYYY-MM-DD')
          : null;

      const paginaParsed = Number(rawPagina) || 0;

      // Ignore empty entries created and never filled by the user
      if (!dataParsed && !paginaParsed) {
        return null;
      }

      const retificacaoOriginal = originaisMap?.get(key);

      return {
        id: retificacaoOriginal?.id ?? 0,
        dataRetificacao: dataParsed,
        paginaRetificacaoDom: paginaParsed,
      };
    })
    .filter((r): r is RetificacaoDTO => r !== null);
}

export const calcularAprovacao = (
  frequencia: number | null,
  conceitoFinal: string | null,
  atividade: string | null,
  regras?: RegrasAprovacaoCursistaCodafDto
): boolean | null => {
    if (!regras || !regras.possuiRegraAvaliacao) return null;

    let aprovado = true;

    if (regras.frequenciaMinima > 0) {
      if ((frequencia ?? 0) < regras.frequenciaMinima) aprovado = false;
    }
    
    if (regras.conceitosAceitos.length > 0) {
      if (!conceitoFinal || !regras.conceitosAceitos.includes(conceitoFinal)) aprovado = false;
    }
    
    if (regras.exigeAtividadeObrigatoria) {
      if (atividade !== 'S') aprovado = false;
    }

    return aprovado;
};