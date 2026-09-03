import { Button, Col, Row } from 'antd';
import React from 'react';
import ButtonVoltar from '~/components/main/button/voltar';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_SALVAR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';

interface BotoesAcaoCodafProps {
  bloqueiosBotoes: any;
  loading: boolean;
  formValido?: boolean;
  onClickVoltar: () => void;
  onClickExcluir: () => void;
  onClickCancelar: () => void;
  onClickSalvar: () => void;
  onClickEnviarParaDF?: () => void;
  onClickDevolverParaDF?: () => void;
}

export const BotoesAcaoCodaf: React.FC<BotoesAcaoCodafProps> = ({
  bloqueiosBotoes,
  loading,
  formValido,
  onClickVoltar,
  onClickExcluir,
  onClickCancelar,
  onClickSalvar,
  onClickEnviarParaDF,
  onClickDevolverParaDF,
}) => {
  return (
    <Row gutter={[8, 8]}>
      <Col>
        <ButtonVoltar onClick={onClickVoltar} id={CF_BUTTON_VOLTAR} />
      </Col>
      {bloqueiosBotoes.excluir?.visivel && (
        <Col>
          <Button
            type='default'
            disabled={bloqueiosBotoes.excluir?.bloqueado}
            onClick={onClickExcluir}
            id={CF_BUTTON_EXCLUIR}
            style={{ fontWeight: 700 }}
          >
            Excluir
          </Button>
        </Col>
      )}
      {bloqueiosBotoes.salvar?.visivel && (
        <Col>
          <Button
            disabled={bloqueiosBotoes.salvar?.bloqueado}
            type='default'
            onClick={onClickCancelar}
            id={CF_BUTTON_CANCELAR}
            style={{ fontWeight: 700 }}
          >
            Cancelar
          </Button>
        </Col>
      )}
      {bloqueiosBotoes.salvar?.visivel && (
        <Col>
          <Button
            disabled={bloqueiosBotoes.salvar?.bloqueado}
            type='primary'
            onClick={onClickSalvar}
            loading={loading}
            id={CF_BUTTON_SALVAR}
            style={{ fontWeight: 700 }}
          >
            Salvar
          </Button>
        </Col>
      )}
      <Col>
        {onClickEnviarParaDF && bloqueiosBotoes.enviarDF?.visivel && (
          <Button
            type='primary'
            onClick={onClickEnviarParaDF}
            loading={loading}
            disabled={!formValido || bloqueiosBotoes.enviarDF?.bloqueado}
            style={{ fontWeight: 700 }}
          >
            Enviar para DF
          </Button>
        )}
        {onClickDevolverParaDF && bloqueiosBotoes.devolver?.visivel && (
          <Button
            type='primary'
            onClick={onClickDevolverParaDF}
            loading={loading}
            disabled={!formValido || bloqueiosBotoes.devolver?.bloqueado}
            style={{ fontWeight: 700, marginLeft: 8 }}
          >
            Devolver
          </Button>
        )}
      </Col>
    </Row>
  );
};