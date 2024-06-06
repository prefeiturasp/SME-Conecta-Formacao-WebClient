/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { DataTableContext } from '~/components/lib/card-table/provider';
import { notification } from '~/components/lib/notification';
import {
  DESEJA_COLOCAR_INSCRICAO_EM_ESPERA,
  DESEJA_CONFIRMAR_INSCRICAO,
  INSCRICAO_CANCELADA_SUCESSO,
  INSCRICAO_COLOCADA_ESPERA_SUCESSO,
  INSCRICAO_CONFIRMADA_SUCESSO,
} from '~/core/constants/mensagens';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import { confirmacao } from '~/core/services/alerta-service';
import {
  cancelarInscricoes,
  colocarEmEsperaInscricao,
  confirmarInscricao,
} from '~/core/services/inscricao-service';

type DataTableContextProps = {
  onClickCancelar: (ids: number[], motivo: string) => Promise<boolean>;
  onClickConfirmar: (ids: number[]) => void;
  onClickColocarEspera: (ids: number[]) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<DadosListagemInscricaoDTO[]>>;
  selectedRows: DadosListagemInscricaoDTO[];
};

const DEFAULT_VALUES: DataTableContextProps = {
  onClickCancelar: () => new Promise((resolve) => resolve(false)),
  onClickConfirmar: () => null,
  onClickColocarEspera: () => null,
  setSelectedRows: () => {},
  selectedRows: [],
};

export const TurmasInscricoesListaPaginadaContext =
  createContext<DataTableContextProps>(DEFAULT_VALUES);

export const TurmasInscricoesListaPaginadaContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { tableState } = useContext(DataTableContext);

  const [selectedRows, setSelectedRows] = useState<DadosListagemInscricaoDTO[]>([]);

  const onClickColocarEspera = (ids: number[]) => {
    confirmacao({
      content: DESEJA_COLOCAR_INSCRICAO_EM_ESPERA,
      onOk: () => {
        colocarEmEsperaInscricao(ids).then((response) => {
          if (response.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: response?.dados?.mensagem || INSCRICAO_COLOCADA_ESPERA_SUCESSO,
            });

            tableState.reloadData();
            setSelectedRows([]);
          }
        });
      },
    });
  };

  const onClickConfirmar = (ids: number[]) => {
    confirmacao({
      content: DESEJA_CONFIRMAR_INSCRICAO,
      onOk: () => {
        confirmarInscricao(ids).then((response) => {
          if (response.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: response?.dados?.mensagem || INSCRICAO_CONFIRMADA_SUCESSO,
            });

            tableState.reloadData();
            setSelectedRows([]);
          }
        });
      },
    });
  };

  const onClickCancelar = async (ids: number[], motivo: string) => {
    const response = await cancelarInscricoes(ids, { motivo });
    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: response?.dados?.mensagem || INSCRICAO_CANCELADA_SUCESSO,
      });

      tableState.reloadData();
      setSelectedRows([]);
    }

    return response.sucesso;
  };

  return (
    <TurmasInscricoesListaPaginadaContext.Provider
      value={{
        onClickCancelar,
        onClickConfirmar,
        onClickColocarEspera,
        setSelectedRows,
        selectedRows,
      }}
    >
      {children}
    </TurmasInscricoesListaPaginadaContext.Provider>
  );
};
