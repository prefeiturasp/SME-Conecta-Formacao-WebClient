import { ColumnsType } from 'antd/es/table';
import React from 'react';
import DataTable from '~/components/lib/card-table';
import { FiltersProps } from '..';

interface MinhasInscricoesListaPaginadaProps {
  filters?: FiltersProps;
}

interface InscricoesProps {
  id: number;
  codigoFormacao: number;
  nomeFormacao: string;
  turmas: TurmasProps[];
}

interface TurmasProps {
  nomeTurma: string;
  data: string;
  quantidadeVagas: number;
  quantidadeInscricoes: number;
}

const dataMock: InscricoesProps[] = [
  {
    id: 1,
    codigoFormacao: 1,
    nomeFormacao: 'Formacao 001',
    turmas: [
      {
        nomeTurma: 'Turma 1',
        data: '2023-10-01',
        quantidadeVagas: 10,
        quantidadeInscricoes: 3,
      },
      {
        nomeTurma: 'Turma 1',
        data: '2023-10-01',
        quantidadeVagas: 10,
        quantidadeInscricoes: 3,
      },
    ],
  },
  {
    id: 2,
    codigoFormacao: 2,
    nomeFormacao: 'Formacao 002',
    turmas: [
      {
        nomeTurma: 'Turma 2',
        data: '2023-10-01',
        quantidadeVagas: 10,
        quantidadeInscricoes: 3,
      },
      {
        nomeTurma: 'Turma 2',
        data: '2023-10-01',
        quantidadeVagas: 10,
        quantidadeInscricoes: 3,
      },
    ],
  },
];

export const MinhasInscricoesListaPaginada: React.FC<MinhasInscricoesListaPaginadaProps> = ({
  filters,
}) => {
  const columns: ColumnsType<InscricoesProps> = [
    { title: 'Código da formação', dataIndex: 'codigoFormacao' },
    { title: 'Nome da formação', dataIndex: 'nomeFormacao' },
  ];

  const expandedRowRender = (record: InscricoesProps) => {
    const columns: ColumnsType<TurmasProps> = [
      { title: 'Turma', dataIndex: 'nomeTurma' },
      { title: 'Data', dataIndex: 'data' },
      { title: 'Quantidade de vagas', dataIndex: 'quantidadeVagas' },
      { title: 'Quantidade de inscricoes', dataIndex: 'quantidadeInscricoes' },
    ];

    return <DataTable dataSource={record.turmas} columns={columns} />;
  };

  //TODO - USAR URL NA TABLE
  return (
    <DataTable
      url=''
      filters={filters}
      dataSource={dataMock}
      columns={columns}
      expandable={{
        expandedRowRender,
      }}
    />
  );
};
