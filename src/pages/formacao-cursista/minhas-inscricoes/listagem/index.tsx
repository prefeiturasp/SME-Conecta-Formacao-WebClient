import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useContext } from 'react';
import DataTable from '~/components/lib/card-table';
import { DataTableContext } from '~/components/lib/card-table/provider';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_INSCRICAO } from '~/core/constants/mensagens';
import { confirmacao } from '~/core/services/alerta-service';
import { URL_INSCRICAO, cancelarInscricao } from '~/core/services/inscricao-service';

export interface InscricaoProps {
  id: number;
  codigoFormacao: number;
  nomeFormacao: string;
  nomeTurma: string;
  datas: string;
  cargoFuncao: string;
  situacao: string;
  podeCancelar: boolean;
}

export const MinhasInscricoesListaPaginada = () => {
  const { tableState } = useContext(DataTableContext);

  const columns: ColumnsType<InscricaoProps> = [
    { title: 'Código da formação', dataIndex: 'codigoFormacao', width: '6%' },
    { title: 'Título da formação', dataIndex: 'nomeFormacao', width: '10%' },
    { title: 'Turma', dataIndex: 'nomeTurma', width: '10%' },
    { title: 'Datas', dataIndex: 'datas', width: '10%' },
    { title: 'Cargo/Função', dataIndex: 'cargoFuncao', width: '10%' },
    { title: 'Situação', dataIndex: 'situacao', width: '10%' },
    {
      title: 'Ações',
      dataIndex: 'podeCancelar',
      width: '2%',
      render: (_, record) => {
        const cancelar = async () => {
          confirmacao({
            content: DESEJA_CANCELAR_INSCRICAO,
            onOk: async () => {
              const response = await cancelarInscricao(record.id);
              if (response.sucesso) {
                notification.success({
                  message: 'Sucesso',
                  description: 'Inscrição cancelada com sucesso!',
                });

                tableState.reloadData();
              }
            },
          });
        };

        return (
          <Button type='default' size='small' disabled={!record.podeCancelar} onClick={cancelar}>
            Cancelar inscrição
          </Button>
        );
      },
    },
  ];

  return <DataTable url={URL_INSCRICAO} columns={columns} />;
};