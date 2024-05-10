import { Col, Form, Input, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { CF_INPUT_TEXT_AREA } from '~/core/constants/ids/input';
import { JUSTIFICATIVA_NAO_INFORMADA } from '~/core/constants/mensagens';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';

type ModalAprovarRecusarConteudoInicialProps = {
  aprovarSelecionado: boolean;
  onClickSalvar: () => void;
};

export const ModalAprovarRecusarConteudoInicial: React.FC<
  ModalAprovarRecusarConteudoInicialProps
> = ({ onClickSalvar, aprovarSelecionado }) => {
  const formInstance = useFormInstance();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);

  const ehPerfilParecerista =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.Parecerista];

  const maxLength = () => {
    const situacao = formInstance.getFieldsValue(true).situacao;

    if (
      ehPerfilParecerista &&
      (situacao === SituacaoProposta.AguardandoAnalisePeloParecerista ||
        situacao === SituacaoProposta.AguardandoReanalisePeloParecerista)
    ) {
      return 1000;
    }
  };

  return (
    <>
      <Form.Item
        label='Justificar:'
        name='justificativa'
        rules={[{ required: !aprovarSelecionado, message: JUSTIFICATIVA_NAO_INFORMADA }]}
        style={{ marginBottom: 6 }}
      >
        <Input.TextArea
          rows={5}
          disabled={false}
          maxLength={maxLength()}
          id={CF_INPUT_TEXT_AREA}
          style={{ resize: 'none' }}
        />
      </Form.Item>
      <Row justify='end'>
        <Col>
          <ButtonSecundary size='small' disabled={false} onClick={onClickSalvar}>
            {`Enviar ${aprovarSelecionado ? 'Aprovação' : 'Recusa'}`}
          </ButtonSecundary>
        </Col>
      </Row>
    </>
  );
};
