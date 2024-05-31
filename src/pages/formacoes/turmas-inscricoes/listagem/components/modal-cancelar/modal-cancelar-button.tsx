import React, { PropsWithChildren, useState } from 'react';

import { ButtonType } from 'antd/es/button';
import { FaTimesCircle } from 'react-icons/fa';
import { IconButtonDataTable } from '~/components/main/button/icon-button-data-table';
import {
  CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA,
} from '~/core/constants/mensagens';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import { SituacaoInscricao, SituacaoInscricaoTagDisplay } from '~/core/enum/situacao-inscricao';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { Colors } from '~/core/styles/colors';
import { ModalCancelarInscricao } from './modal-cancelar';

type ModalCancelarButtonProps = {
  type?: ButtonType;
  disabled?: boolean;
  tooltipTitle?: string;
  record: DadosListagemInscricaoDTO[];
  color?: string;
  children?: React.ReactNode;
} & PropsWithChildren;
export const ModalCancelarButton: React.FC<ModalCancelarButtonProps> = ({
  type,
  record,
  children,
  color = '',
  disabled = false,
  tooltipTitle = 'Cancelar incrição',
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);
  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  let desabilitarCancelar = disabled;

  if (record?.length == 1) {
    desabilitarCancelar =
      !record[0]?.permissao?.podeCancelar ||
      record[0].situacao === SituacaoInscricaoTagDisplay[SituacaoInscricao.Cancelada];
  }

  const mensagemConfirmacaoCancelar = () => {
    if (record?.length == 1 && record[0].integrarNoSga && record[0].iniciado && !ehCursista) {
      return DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA;
    } else {
      return CANCELAR_INSCRICAO;
    }
  };

  const onClickCancelar = () => {
    confirmacao({
      content: mensagemConfirmacaoCancelar(),
      onOk: () => {
        setOpen(true);
      },
    });
  };

  return (
    <>
      <IconButtonDataTable
        type={type}
        Icon={FaTimesCircle}
        onClick={onClickCancelar}
        tooltipTitle={tooltipTitle}
        disabled={desabilitarCancelar || disabled}
        color={color || Colors.Components.DataTable.ActionButtons.Primary.ERROR}
        backgroundColor={color || Colors.Components.DataTable.ActionButtons.Secondary.ERROR}
      >
        {children}
      </IconButtonDataTable>
      {open && (
        <ModalCancelarInscricao
          ids={record.map((item) => item?.inscricaoId)}
          onFecharButton={() => setOpen(false)}
        />
      )}
    </>
  );
};
