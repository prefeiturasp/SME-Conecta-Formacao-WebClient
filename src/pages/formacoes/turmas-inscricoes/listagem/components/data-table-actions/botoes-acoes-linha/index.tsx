import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { FaCheckCircle, FaPauseCircle, FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { IconButtonDataTable } from '~/components/main/button/icon-button-data-table';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import { Colors } from '~/core/styles/colors';
import { TurmasInscricoesListaPaginadaContext } from '../../../provider';
import { ModalCancelarButton } from '../../modal-cancelar/modal-cancelar-button';

export interface BtbAcoesListaIncricaoPorTurmaProps {
  record: DadosListagemInscricaoDTO;
}

export const BtbAcoesListaIncricaoPorTurma: React.FC<BtbAcoesListaIncricaoPorTurmaProps> = ({
  record,
}) => {
  const { onClickColocarEspera, onClickConfirmar, onClickReativar } = useContext(
    TurmasInscricoesListaPaginadaContext,
  );

  const desabilitarEmEspera = !record?.permissao?.podeColocarEmEspera;

  const desabilitarConfirmar = !record?.permissao?.podeConfirmar;

  const desabilitarReativar = !record?.permissao?.podeReativar;

  return (
    <Row gutter={[8, 0]}>
      <Col>
        <ModalCancelarButton record={[record]} />
      </Col>
        <Col>
        <IconButtonDataTable
          Icon={desabilitarReativar ? FaToggleOff : FaToggleOn }
          disabled={desabilitarReativar}
          tooltipTitle='Reativar incrição'
          onClick={() => onClickReativar([record.inscricaoId])}
          color={Colors.Components.DataTable.ActionButtons.Primary.WARNING}
          backgroundColor={Colors.Components.DataTable.ActionButtons.Secondary.WARNING}
        />
      </Col>
      <Col>
        <IconButtonDataTable
          Icon={FaPauseCircle}
          disabled={desabilitarEmEspera}
          tooltipTitle='Colocar em espera'
          onClick={() => onClickColocarEspera([record.inscricaoId])}
          color={Colors.Components.DataTable.ActionButtons.Primary.WARNING}
          backgroundColor={Colors.Components.DataTable.ActionButtons.Secondary.WARNING}
        />
      </Col>
      <Col>
        <IconButtonDataTable
          Icon={FaCheckCircle}
          disabled={desabilitarConfirmar}
          tooltipTitle='Confirmar incrição'
          onClick={() => onClickConfirmar([record.inscricaoId])}
          color={Colors.Components.DataTable.ActionButtons.Primary.SUCCESS}
          backgroundColor={Colors.Components.DataTable.ActionButtons.Secondary.SUCCESS}
        />
      </Col>
    
    </Row>
  );
};
