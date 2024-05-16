import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { UsuarioRedeParceriaPaginadoDTO } from '~/core/dto/usuario-rede-parceria-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import usuarioRedeParceria from '~/core/services/usuario-rede-parceria';
import { formatterCPFMask } from '~/core/utils/functions';
import { FiltroUsuarioRedeParceriaProps } from '..';

type UsuarioRedeParceriaListaPaginadaProps = {
  filters?: FiltroUsuarioRedeParceriaProps;
};

export const UsuarioRedeParceriaListaPaginada: React.FC<UsuarioRedeParceriaListaPaginadaProps> = ({
  filters,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<UsuarioRedeParceriaPaginadoDTO> = [
    { title: 'Área promotora', dataIndex: 'areaPromotora' },
    { title: 'Nome do usuário', dataIndex: 'nome' },
    { title: 'CPF', dataIndex: 'cpf', render: (value) => formatterCPFMask(value) },
    { title: 'Situação', dataIndex: 'situacao' },
  ];

  const onClickEditar = (row: UsuarioRedeParceriaPaginadoDTO) =>
    navigate(`${ROUTES.USUARIO_REDE_PARCERIA}/editar/${row.id}`, {
      replace: true,
      state: row,
    });

  return (
    <DataTable
      url={usuarioRedeParceria.obterUsuarioRedeParceria()}
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
