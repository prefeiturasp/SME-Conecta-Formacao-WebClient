import { Col, Form, Input, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect, useState } from 'react';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { notification } from '~/components/lib/notification';
import { CF_INPUT_TEXT_AREA } from '~/core/constants/ids/input';
import {
  PropostaPareceristaConsideracaoCadastroDTO,
  PropostaPareceristaConsideracaoDTO,
} from '~/core/dto/parecer-proposta-dto';
import { confirmacao } from '~/core/services/alerta-service';
import { alterarParecer } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type ModalParecerProps = {
  index: number;
  propostaId?: number;
  parecer: PropostaPareceristaConsideracaoDTO;
  onClickExcluir: (id?: number) => void;
  carregarParecer: () => void;
};

export const ModalParecerConteudo: React.FC<ModalParecerProps> = ({
  index,
  parecer,
  propostaId,
  onClickExcluir,
  carregarParecer,
}) => {
  const formInstance = useFormInstance();
  const initialValue = parecer.descricao;
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  const onClickCancelar = () => {
    if (formInstance.isFieldsTouched()) {
      confirmacao({
        content: 'Você não salvou o parecer, deseja descartar a alteração?',
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
    if (!propostaId) return;
    const descricao = formInstance.getFieldsValue(true)[`${parecer.id}`];

    const params: PropostaPareceristaConsideracaoCadastroDTO = {
      propostaId,
      id: parecer?.id || null,
      campo: parecer.campo,
      descricao,
    };

    alterarParecer(params).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: resposta.dados.mensagem,
        });
        setModoEdicao(false);
        carregarParecer();
      }
    });
  };

  const montarBotoesAcoes = () => {
    if (!parecer.podeAlterar) return <></>;

    if (modoEdicao)
      return (
        <>
          <Col>
            <ButtonSecundary size='small' disabled={!modoEdicao} onClick={alterar}>
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

    return (
      <>
        <Col>
          <ButtonSecundary
            size='small'
            disabled={!parecer.podeAlterar}
            onClick={() => setModoEdicao(true)}
          >
            Editar
          </ButtonSecundary>
        </Col>
        <Col>
          <ButtonSecundary
            size='small'
            disabled={!parecer.podeAlterar}
            onClick={() => onClickExcluir(parecer?.id)}
          >
            Excluir
          </ButtonSecundary>
        </Col>
      </>
    );
  };

  useEffect(() => {
    formInstance.resetFields();
  }, [parecer]);

  return (
    <>
      <Form.Item
        initialValue={initialValue}
        name={`${parecer.id}`}
        label={`Descrição do parecer (${index + 1}):`}
        style={{ marginBottom: 6, marginTop: 16 }}
      >
        <Input.TextArea
          rows={5}
          id={`${CF_INPUT_TEXT_AREA}_${index}`}
          disabled={!modoEdicao}
          maxLength={1000}
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
