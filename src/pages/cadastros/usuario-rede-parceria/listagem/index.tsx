import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { UsuarioRedeParceriaDTO } from '~/core/dto/usuario-rede-parceria-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { FiltroUsuarioRedeParceriaProps } from '..';

type UsuarioRedeParceriaListaPaginadaProps = {
  filters?: FiltroUsuarioRedeParceriaProps;
};

// TODO: REMOVER MOCKING
const MOCK_DATA = [
  {
    id: 1,
    areaPromotora: 'Área promotora',
    nome: 'Vinicius A. Nyari',
    cpf: '00000000000',
    situacao: 'Ativo',
  },
  {
    id: 2,
    areaPromotora: 'Área promotora',
    nome: 'Neder H. Simões',
    cpf: '11111111111',
    situacao: 'Ativo',
  },
];

export const UsuarioRedeParceriaListaPaginada: React.FC<UsuarioRedeParceriaListaPaginadaProps> = ({
  filters,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<UsuarioRedeParceriaDTO> = [
    { title: 'Área promotora', dataIndex: 'areaPromotora' },
    { title: 'Nome do usuário', dataIndex: 'nome' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Situação', dataIndex: 'situacao' },
  ];

  const onClickEditar = (row: UsuarioRedeParceriaDTO) =>
    navigate(`${ROUTES.USUARIO_REDE_PARCERIA}/editar/${row.id}`, {
      replace: true,
      state: row,
    });

  return (
    <DataTable
      //TODO: AGUARDAR ENDPOINT
      url=''
      dataSource={MOCK_DATA}
      filters={filters}
      columns={columns}
      onRow={(row) => ({
        onClick: () => {
          onClickEditar(row);
        },
      })}
    />
  );
};
