import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { DataTableContext } from '~/components/lib/card-table/provider';
import { notification } from '~/components/lib/notification';
import {
  CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA,
} from '~/core/constants/mensagens';
import { SituacaoInscricao, SituacaoInscricaoTagDisplay } from '~/core/enum/situacao-inscricao';
import { confirmacao } from '~/core/services/alerta-service';
import { cancelarInscricao } from '~/core/services/inscricao-service';
import { FiltroTurmaInscricoesProps } from '..';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';

interface TurmasInscricoesListaPaginadaProps {
  filters?: FiltroTurmaInscricoesProps;
  realizouFiltro?: boolean;
  alterarRealizouFiltro: (valor: boolean) => void;
}

export interface TurmaInscricaoProps {
  nomeTurma: string;
  registroFuncional: string;
  inscricaoId: number;
  cpf: string;
  nomeCursista: string;
  cargoFuncao: string;
  situacao: string;
  podeCancelar?: boolean;
  integrarNoSga: boolean;
  iniciado: boolean;
}

export const TurmasInscricoesListaPaginada: React.FC<TurmasInscricoesListaPaginadaProps> = ({
  filters,
  realizouFiltro,
  alterarRealizouFiltro,
}) => {
  const params = useParams();
  const id = params.id;
  const { tableState } = useContext(DataTableContext);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const mensagemConfirmacao = (record: TurmaInscricaoProps) => {
    if (record.integrarNoSga && record.iniciado && !ehCursista) {
      return DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA;
    } else {
      return CANCELAR_INSCRICAO;
    }
  };

  const columns: ColumnsType<TurmaInscricaoProps> = [
    { title: 'Turma', dataIndex: 'nomeTurma' },
    { title: 'RF', dataIndex: 'registroFuncional' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Nome do cursista', dataIndex: 'nomeCursista' },
    { title: 'Cargo/Função Atividade', dataIndex: 'cargoFuncao' },
    { title: 'Origem', dataIndex: 'origem' },
    { title: 'Situação', dataIndex: 'situacao' },
    {
      title: 'Ações',
      dataIndex: 'podeCancelar',
      render: (_, record) => {
        const cancelar = async () => {
          confirmacao({
            content: mensagemConfirmacao(record),
            onOk: async () => {
              const response = await cancelarInscricao(record.inscricaoId);
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
          <Button
            type='default'
            size='small'
            disabled={record.situacao === SituacaoInscricaoTagDisplay[SituacaoInscricao.Cancelada]}
            onClick={cancelar}
          >
            Cancelar inscrição
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      url={`v1/Inscricao/${id}`}
      columns={columns}
      filters={filters}
      realizouFiltro={realizouFiltro}
      alterarRealizouFiltro={alterarRealizouFiltro}
    />
  );
};
