import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { AreaPromotoraTipoEnum } from '~/core/enum/area-promotora-tipo';
import { ROUTES } from '~/core/enum/routes-enum';
import { FiltroRedeParceriaUsuariosProps } from '..';

interface RedeParceriaUsuariosListaPaginadaProps {
  filters?: FiltroRedeParceriaUsuariosProps;
}

interface RedeParceriaUsuariosProps {
  id: number;
  areaPromotora: AreaPromotoraTipoEnum;
  nome: number;
  cpf: string;
  situacao: string;
}

export const RedeParceriaUsuariosListaPaginada: React.FC<
  RedeParceriaUsuariosListaPaginadaProps
> = ({ filters }) => {
  const navigate = useNavigate();

  const columns: ColumnsType<RedeParceriaUsuariosProps> = [
    { title: 'Área promotora', dataIndex: ' areaPromotora' },
    { title: 'Nome do usuário', dataIndex: 'nome' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Situação', dataIndex: 'situacao' },
  ];

  const onClickEditar = (row: RedeParceriaUsuariosProps) =>
    navigate(`${ROUTES.FORMACAOES_INSCRICOES}/editar/${row.id}`, { replace: true, state: row });

  return (
    <DataTable
      //TODO: AGUARDAR ENDPOINT
      url=''
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
