import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

export type CodafListagemItemBase = {
  id: number;
  codigoFormacao: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  nomeAreaPromotora: string;
  nomeTurma: string;
  status: number;
};

type ObterSituacaoTextoFn = (status: number) => string;

export const getColunasBase = <T extends CodafListagemItemBase>(
  ocultarColunas: boolean,
  obterSituacaoTexto: ObterSituacaoTextoFn,
): ColumnsType<T> => [
  {
    key: 'codigoFormacao',
    title: 'Código da formação',
    dataIndex: 'codigoFormacao',
    width: ocultarColunas ? 100 : 80,
  },
  {
    key: 'numeroHomologacao',
    title: 'Número de homologação',
    dataIndex: 'numeroHomologacao',
    width: ocultarColunas ? 100 : 80,
  },
  {
    key: 'nomeFormacao',
    title: 'Nome da formação',
    dataIndex: 'nomeFormacao',
    ellipsis: { showTitle: false },
    width: 300,
    render: (text: string) => (
      <Tooltip title={text}>
        <div
          style={{
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </div>
      </Tooltip>
    ),
  },
  {
    key: 'nomeAreaPromotora',
    title: 'Área promotora',
    dataIndex: 'nomeAreaPromotora',
    width: ocultarColunas ? 200 : 150,
    ellipsis: true,
  },
  {
    key: 'nomeTurma',
    title: 'Turma',
    dataIndex: 'nomeTurma',
    width: ocultarColunas ? 150 : 120,
    ellipsis: true,
  },
  {
    key: 'status',
    title: 'Situação',
    dataIndex: 'status',
    width: ocultarColunas ? 150 : 100,
    render: (status: number) => obterSituacaoTexto(status),
  },
];
