import { cloneDeep } from 'lodash';
import { dayjs } from '~/core/date/dayjs';
import { TotalDePareceresDTO } from '~/core/dto/parecer-proposta-dto';
import { CamposParecerEnum } from '~/core/enum/campos-proposta-enum';
import { OpcaoListagem } from '~/core/enum/opcao-listagem';

export const scrollNoInicio = () => window.scrollTo(0, 0);

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHoraAuditoria = (data: string) =>
  dayjs(data).format('DD/MM/YYYY [às] HH:mm');

export const formatarDuasCasasDecimais = (value: any) =>
  removerTudoQueNaoEhDigito(value).replace(/(\d{3})(\d{2})$/, '$1:$2');

export const validarOnChangeMultiSelectOutros = (newValues: any[], currentValues: any[]) => {
  let valorParaSetar: any[] = newValues;
  const valorAtualTemOpcaoOutros = currentValues?.includes(OpcaoListagem.Outros);
  const valoresNovosTemOpcaoOutros = newValues.includes(OpcaoListagem.Outros);

  if (valorAtualTemOpcaoOutros) {
    const listaSemOpcaoOutros = newValues.filter((valor) => valor !== OpcaoListagem.Outros);
    valorParaSetar = listaSemOpcaoOutros;
  }
  if (!valorAtualTemOpcaoOutros && valoresNovosTemOpcaoOutros) {
    valorParaSetar = [OpcaoListagem.Outros];
  }

  return valorParaSetar;
};

export const validarOnChangeMultiSelectUnico = (valoresNovos: any, valoreAtuais: any) => {
  if (!valoresNovos?.length) return [];

  let valorParaSetar: any[] = valoresNovos;

  const valorAtualTemOpcaoUnico = valoreAtuais?.find((item: any) => item?.unico);
  const valoresNovosTemOpcaoUnico = valoresNovos.find((item: any) => item?.unico);

  if (valorAtualTemOpcaoUnico) {
    const listaSemOpcaoUnico = valoresNovos.filter((item: any) => !item?.unico);
    valorParaSetar = listaSemOpcaoUnico;
  }
  if (!valorAtualTemOpcaoUnico && valoresNovosTemOpcaoUnico) {
    return [valoresNovosTemOpcaoUnico.value];
  }

  return valorParaSetar.map((item) => item?.value);
};

export const formatterCPFMask = (value: string | number | undefined) =>
  `${value}`
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');

export const onchangeMultiSelectOpcaoTodos = (
  valores: any[],
  valorAtual: any[],
  valorTodosComparacao: any = OpcaoListagem.Todos,
) => {
  let valorParaSetar = valores;
  const valorAtualTemOpcaoTodos = valorAtual?.includes(valorTodosComparacao);
  const valoresTemOpcaoTodos = valores.includes(valorTodosComparacao);

  if (valorAtualTemOpcaoTodos) {
    const listaSemOpcaoTodos = valores.filter((valor) => valor !== valorTodosComparacao);
    valorParaSetar = listaSemOpcaoTodos;
  }
  if (!valorAtualTemOpcaoTodos && valoresTemOpcaoTodos) {
    valorParaSetar = [valorTodosComparacao];
  }

  return valorParaSetar;
};

export const onchangeMultiSelectLabelInValueOpcaoTodos = (
  valores: any[],
  valorAtual: any[],
  valorTodosComparacao: any = OpcaoListagem.Todos,
) => {
  let valorParaSetar = valores;
  const valorAtualTemOpcaoTodos = valorAtual?.find((item) => item?.value === valorTodosComparacao);
  const valoresTemOpcaoTodos = valores?.find((item) => item?.value === valorTodosComparacao);

  if (valorAtualTemOpcaoTodos) {
    const listaSemOpcaoTodos = cloneDeep(valores).filter(
      (item) => item?.value !== valorTodosComparacao,
    );

    valorParaSetar = listaSemOpcaoTodos;
  }
  if (!valorAtualTemOpcaoTodos && valoresTemOpcaoTodos) {
    valorParaSetar = [valoresTemOpcaoTodos];
  }

  return valorParaSetar;
};

export const mostrarQtdParecer = (
  campo: CamposParecerEnum,
  totalDePareceres: TotalDePareceresDTO[],
) => {
  const qtdParecer = totalDePareceres
    ?.filter((parecer) => parecer.campo === campo)
    .map((parecer) => parecer.quantidade);

  return !!qtdParecer?.length ? qtdParecer[0] : 0;
};
