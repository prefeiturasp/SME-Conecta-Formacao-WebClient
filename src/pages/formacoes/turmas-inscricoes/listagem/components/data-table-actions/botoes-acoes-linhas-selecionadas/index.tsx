import { Col, Row } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useContext } from 'react';
import { AiOutlineMinus } from 'react-icons/ai';
import { FaCheckCircle, FaPauseCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { IconButtonDataTable } from '~/components/main/button/icon-button-data-table';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import { Colors } from '~/core/styles/colors';
import { TurmasInscricoesListaPaginadaContext } from '../../../provider';
import { ModalCancelarButton } from '../../modal-cancelar/modal-cancelar-button';

const ContainerRow = styled(Row)`
  color: ${Colors.Neutral.WHITE};
  background-color: ${Colors.Components.DataTable.ActionButtons.Primary.WARNING};
  min-height: 46px;
  font-weight: 700;
`;

export interface BtbAcoesListaIncricaoPorTurmaLinhasSelecionadasProps {
  selectedRows: DadosListagemInscricaoDTO[];
}
export const BtbAcoesListaIncricaoPorTurmaLinhasSelecionadas: React.FC<
  BtbAcoesListaIncricaoPorTurmaLinhasSelecionadasProps
> = ({ selectedRows }) => {
  const { onClickColocarEspera, onClickConfirmar } = useContext(
    TurmasInscricoesListaPaginadaContext,
  );

  const totalInscricoesSelecionadas = selectedRows?.length || 0;

  const algumaLinhaSelecionadaPodeCancelar = selectedRows.some(
    (item) => item?.permissao?.podeCancelar,
  );
  const algumaLinhaSelecionadaPodeConfirmar = selectedRows.some(
    (item) => item?.permissao?.podeConfirmar,
  );
  const algumaLinhaSelecionadaPodePausar = selectedRows.some(
    (item) => item?.permissao?.podeColocarEmEspera,
  );

  const desabilitarPausar = !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodePausar;
  const desabilitarCancelar = !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodeCancelar;
  const desabilitarConfirmar = !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodeConfirmar;

  type HandleButtonProps = {
    confirmar?: boolean;
  };

  const handleColocarEsperaConfirmar = (
    { confirmar }: Partial<HandleButtonProps> = { confirmar: true },
  ) => {
    const lista = cloneDeep(selectedRows).filter((item) =>
      confirmar ? !!item?.permissao?.podeConfirmar : !!item?.permissao?.podeColocarEmEspera,
    );
    const ids: number[] = lista.map((item) => item?.inscricaoId);

    if (confirmar) {
      onClickConfirmar(ids);
    } else {
      onClickColocarEspera(ids);
    }
  };

  return (
    <Col>
      <ContainerRow gutter={16} justify='space-between' align='middle'>
        <Col>{`${totalInscricoesSelecionadas} inscrições selecionadas`}</Col>
        <Col>
          <Row align='middle' gutter={10}>
            <Col>
              <Row align='middle'>
                <ModalCancelarButton
                  type='link'
                  tooltipTitle=''
                  record={selectedRows}
                  color={Colors.Neutral.WHITE}
                  disabled={desabilitarCancelar}
                >
                  Cancelar inscrição
                </ModalCancelarButton>
              </Row>
            </Col>
            <Col>
              <Row align='middle'>
                <AiOutlineMinus transform='rotate(90)' size={20} />
                <IconButtonDataTable
                  Icon={FaPauseCircle}
                  type='link'
                  disabled={desabilitarPausar}
                  onClick={() => handleColocarEsperaConfirmar({ confirmar: false })}
                  color={Colors.Neutral.WHITE}
                >
                  Colocar em lista de espera
                </IconButtonDataTable>
              </Row>
            </Col>
            <Col>
              <Row align='middle'>
                <AiOutlineMinus transform='rotate(90)' size={20} />
                <IconButtonDataTable
                  Icon={FaCheckCircle}
                  type='link'
                  disabled={desabilitarConfirmar}
                  onClick={() => handleColocarEsperaConfirmar()}
                  color={Colors.Neutral.WHITE}
                >
                  Confirmar inscrição
                </IconButtonDataTable>
              </Row>
            </Col>
          </Row>
        </Col>
      </ContainerRow>
    </Col>
  );
};
