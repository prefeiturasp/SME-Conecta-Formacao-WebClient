import { Col, Form, Input, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect, useState } from 'react';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { CF_INPUT_TEXT_AREA } from '~/core/constants/ids/input';
import { JUSTIFICATIVA_NAO_INFORMADA } from '~/core/constants/mensagens';
import { RetornoJustificativaDTO } from '~/core/dto/retorno-justificativa-dto';
import { confirmacao } from '~/core/services/alerta-service';
import { Colors } from '~/core/styles/colors';

type ModalAprovarRecusarConteudoProps = {
  index: number;
  sugestao: RetornoJustificativaDTO;
  carregarSugestoes: () => void;
};

export const ModalAprovarRecusarConteudo: React.FC<ModalAprovarRecusarConteudoProps> = ({
  index,
  sugestao,
  carregarSugestoes,
}) => {
  const formInstance = useFormInstance();
  const initialValue = sugestao.descricao;
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  const onClickCancelar = () => {
    if (formInstance.isFieldsTouched()) {
      confirmacao({
        content: 'Você não salvou a justificativa, deseja descartar a alteração?',
        onOk() {
          formInstance.resetFields();
          setModoEdicao(false);
        },
        okText: 'Sim',
        cancelText: 'Não',
      });
    } else {
      formInstance.resetFields();
      setModoEdicao(false);
    }
  };

  const alterar = () => {
    const descricao = formInstance.getFieldsValue(true)[`${sugestao.id}`];

    const params: RetornoJustificativaDTO = {
      id: sugestao?.id || null,
      descricao,
    };

    console.log(params, carregarSugestoes());

    // TODO: VERIFICAR ENDPOINT DE ALTERAR SUGESTAO
    // alterarParecer(params).then((resposta) => {
    //   if (resposta.sucesso) {
    //     notification.success({
    //       message: 'Sucesso',
    //       description: resposta.dados.mensagem,
    //     });
    //     setModoEdicao(false);
    //     carregarSugestoes();
    //   }
    // });
  };

  const montarBotoesAcoes = () => {
    if (modoEdicao) {
      return (
        <>
          <Col>
            <ButtonSecundary size='small' disabled={!modoEdicao} onClick={() => alterar}>
              Salvar
            </ButtonSecundary>
          </Col>
          <Col>
            <ButtonSecundary size='small' disabled={!modoEdicao} onClick={onClickCancelar}>
              Cancelar
            </ButtonSecundary>
          </Col>
        </>
      );
    }

    return (
      <Col>
        <ButtonSecundary size='small' disabled={false} onClick={() => setModoEdicao(true)}>
          Editar
        </ButtonSecundary>
      </Col>
    );
  };

  useEffect(() => {
    formInstance.resetFields();
  }, [sugestao]);

  return (
    <>
      <Form.Item
        name={`${sugestao.id}`}
        initialValue={initialValue}
        style={{ marginBottom: 0 }}
        label={`Justificativa do parecerista (${index + 1}):`}
        rules={[{ required: modoEdicao, message: JUSTIFICATIVA_NAO_INFORMADA }]}
      >
        <Input.TextArea
          rows={5}
          disabled={!modoEdicao}
          id={`${CF_INPUT_TEXT_AREA}_${index}`}
          style={{
            resize: 'none',
            marginBottom: 6,
            color: Colors.Neutral.DARK,
            background: modoEdicao ? 'none' : Colors.Neutral.LIGHTEST,
          }}
        />
      </Form.Item>
      <Row justify='end' gutter={[16, 16]}>
        {montarBotoesAcoes()}
      </Row>
    </>
  );
};
