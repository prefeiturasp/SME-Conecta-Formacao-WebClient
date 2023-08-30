import dayjs from 'dayjs';

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHoraAuditoria = (data: string) =>
  dayjs(data).format('DD/MM/YYYY [às] HH:mm');
