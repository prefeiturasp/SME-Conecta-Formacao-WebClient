import { Col, Form, Input, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect, useState } from 'react';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { CF_INPUT_TEXT_AREA } from '~/core/constants/ids/input';
import { JUSTIFICATIVA_NAO_INFORMADA } from '~/core/constants/mensagens';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { obterSugestoesAprovadas, obterSugestoesRecusadas } from '~/core/services/proposta-service';

type ModalAprovarRecusarConteudoInicialProps = {
  propostaId: number;
  onClickSalvar: () => void;
  aprovarSelecionado: boolean;
};

export const ModalAprovarRecusarConteudoInicial: React.FC<
  ModalAprovarRecusarConteudoInicialProps
> = ({ onClickSalvar, aprovarSelecionado, propostaId }) => {
  const formInstance = useFormInstance();
  const [sugestoes, setSugestoes] = useState<string>();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);

  const ehPerfilParecerista =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.Parecerista];
  const ehPerfilAdminDf =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];

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

  const carregarSugestoes = async () => {
    if (ehPerfilAdminDf) {
      const endpoint = aprovarSelecionado ? obterSugestoesAprovadas : obterSugestoesRecusadas;
      const resposta = await endpoint(propostaId);

      if (resposta.sucesso) {
        const dados = resposta.dados;
        setSugestoes(dados);
      }
    }
  };

  useEffect(() => {
    carregarSugestoes();
  }, [ehPerfilAdminDf]);

  return (
    <>
      <Form.Item
        label='Justificar:'
        name='justificativa'
        style={{ marginBottom: 6 }}
        initialValue={ehPerfilAdminDf ? sugestoes : ''}
        rules={[{ required: !aprovarSelecionado, message: JUSTIFICATIVA_NAO_INFORMADA }]}
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
