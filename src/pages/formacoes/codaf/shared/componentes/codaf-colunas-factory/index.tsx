import { Input, Select, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

export const criarColunasCodafHomologado = (
  paginaAtual: number,
  registrosPorPagina: number,
  bloqueado: boolean,
  onChangeCampo: (id: number, field: string, valor: any) => void,
): ColumnsType<any> => [
  {
    key: 'indice',
    title: ' ',
    width: 60,
    align: 'center',
    render: (_, __, index) => (paginaAtual - 1) * registrosPorPagina + index + 1,
  },
  { key: 'rfOuCpf', title: 'Funcional (RF) ou CPF', dataIndex: 'rfOuCpf', width: 180 },
  { key: 'nomeCursista', title: 'Nome do Cursista', dataIndex: 'nomeCursista', ellipsis: true },
  {
    key: 'frequencia',
    title: 'Frequência (%)',
    dataIndex: 'frequencia',
    width: 150,
    render: (freq, record) => (
      <Input
        disabled={bloqueado}
        value={freq !== null ? `${freq}%` : ''}
        placeholder='%'
        onChange={(e) => {
          const numericValue = e.target.value.replace(/\D/g, '');
          const numValue = numericValue ? Math.min(parseInt(numericValue, 10), 100) : null;
          onChangeCampo(record.id, 'frequencia', numValue);
        }}
        style={{ width: '100%' }}
        maxLength={4}
      />
    ),
  },
  {
    key: 'atividade',
    title: 'Atividade',
    dataIndex: 'atividade',
    width: 150,
    render: (atividade, record) => (
      <Select
        disabled={bloqueado}
        value={atividade}
        placeholder='Selecione'
        onChange={(value) => onChangeCampo(record.id, 'atividade', value)}
        style={{ width: '100%' }}
        options={[
          { label: 'Sim', value: 'S' },
          { label: 'Não', value: 'N' },
        ]}
        allowClear
      />
    ),
  },
  {
    key: 'conceitoFinal',
    title: 'Conceito final',
    dataIndex: 'conceitoFinal',
    width: 250,
    render: (conceitoFinal, record) => (
      <Select
        disabled={bloqueado}
        value={conceitoFinal}
        placeholder='Selecione'
        onChange={(value) => onChangeCampo(record.id, 'conceitoFinal', value || null)}
        style={{ width: '100%' }}
        options={[
          { label: 'Plenamente satisfatório (P)', value: 'P' },
          { label: 'Satisfatório (S)', value: 'S' },
          { label: 'Não Satisfatório (NS)', value: 'NS' },
        ]}
        allowClear
      />
    ),
  },
  {
    key: 'aprovado',
    title: 'Aprovado',
    dataIndex: 'aprovado',
    width: 120,
    render: (aprovado, record) => (
      <Select
        disabled={bloqueado}
        value={aprovado !== null ? (aprovado ? 'S' : 'N') : null}
        placeholder='Selecione'
        onChange={(value) =>
          onChangeCampo(record.id, 'aprovado', value ? value === 'S' : null)
        }
        style={{ width: '100%' }}
        options={[
          { label: 'Sim', value: 'S' },
          { label: 'Não', value: 'N' },
        ]}
        allowClear
      />
    ),
  },
];

export const criarColunasCodafNaoHomologado = (
  paginaAtual: number,
  registrosPorPagina: number,
  bloqueado: boolean,
  onChangeParticipou: (id: number, valor: boolean) => void,
): ColumnsType<any> => [
  {
    key: 'indice',
    title: ' ',
    width: 60,
    align: 'center',
    render: (_, __, index) => (paginaAtual - 1) * registrosPorPagina + index + 1,
  },
  { key: 'rfOuCpf', title: 'Funcional (RF) ou CPF', dataIndex: 'rfOuCpf', width: 180 },
  { key: 'nomeCursista', title: 'Nome do Cursista', dataIndex: 'nomeCursista', ellipsis: true },
  {
    key: 'participou',
    title: 'Participou',
    dataIndex: 'participou',
    width: 480,
    render: (participou, record) => (
      <Select
        disabled={bloqueado}
        value={participou}
        placeholder='Selecione'
        style={{ width: '100%' }}
        options={[
          { label: 'Sim', value: true },
          { label: 'Não', value: false },
        ]}
        onChange={(valor) => onChangeParticipou(record.id, valor)}
      />
    ),
  },
];

export const criarColunasBaseListagemCodaf = <T extends object>(
  ocultarColunas: boolean,
  obterSituacaoTexto: (status: number) => string
): ColumnsType<T> => [
  {
    key: 'codigoFormacao',
    title: 'Código da formação',
    dataIndex: 'codigoFormacao' as any,
    width: ocultarColunas ? 100 : 80,
  },
  {
    key: 'numeroHomologacao',
    title: 'Número de homologação',
    dataIndex: 'numeroHomologacao' as any,
    width: ocultarColunas ? 100 : 80,
  },
  {
    key: 'nomeFormacao',
    title: 'Nome da formação',
    dataIndex: 'nomeFormacao' as any,
    ellipsis: { showTitle: false },
    width: 300,
    render: (text: string) => (
      <Tooltip title={text}>
        <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
      </Tooltip>
    ),
  },
  {
    key: 'nomeAreaPromotora',
    title: 'Área promotora',
    dataIndex: 'nomeAreaPromotora' as any,
    width: ocultarColunas ? 200 : 150,
    ellipsis: true,
  },
  {
    key: 'nomeTurma',
    title: 'Turma',
    dataIndex: 'nomeTurma' as any,
    width: ocultarColunas ? 150 : 120,
    ellipsis: true,
  },
  {
    key: 'status',
    title: 'Situação',
    dataIndex: 'status' as any,
    width: ocultarColunas ? 150 : 100,
    render: (status: number) => obterSituacaoTexto(status),
  },
];