import { Button, Col, Divider, Form, Row, notification } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import Steps from '~/components/main/steps';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_EXCLUIR_REGISTRO,
} from '~/core/constants/mensagens';
import { AreaPromotoraDTO } from '~/core/dto/area-promotora-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { deletarRegistro, obterRegistro } from '~/core/services/api';
import FormInformacoesGerais from './steps/informacoes-gerais';
import Auditoria from '~/components/main/text/auditoria';

const FormCadastroDePropostas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const id = paramsRoute?.id || 0;
  // ATUALIZAR TIPAGEM DO DTO
  const [current, setCurrent] = useState(0);
  const [formInitialValues, setFormInitialValues] = useState<AreaPromotoraDTO>();

  const vagasTurma = Form.useWatch('vagasTurma', form);
  const quantidadeTurmas = Form.useWatch('quantidadeTurmas', form);
  const totalVagas = Number(quantidadeTurmas) + Number(vagasTurma);

  const stepTitles = [
    'Informações gerais',
    'Datas',
    'Detalhamento',
    'Profissionais',
    'Certificação',
  ];

  const validateMessages: FormProps['validateMessages'] = {
    required: 'Campo obrigatório',
  };

  // ATUALIZAR QUANDO O ENDPOINT ESTIVER PRONTO
  const URL_DEFAULT = 'v1/cadastrodepropostas';

  const carregarDados = useCallback(async () => {
    // ATUALIZAR TIPAGEM DO DTO
    const resposta = await obterRegistro<AreaPromotoraDTO>(`${URL_DEFAULT}/${id}`);

    if (resposta.sucesso) {
      if (!resposta.dados?.telefones?.length) {
        resposta.dados.telefones = [{ telefone: '' }];
      }
      setFormInitialValues(resposta.dados);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          navigate(ROUTES.AREA_PROMOTORA);
        },
      });
    } else {
      navigate(ROUTES.AREA_PROMOTORA);
    }
  };

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
      });
    }
  };

  const salvar = async (values: any) => {
    console.log('🚀 ~ salvar ~ values:', values);
  };

  const salvarRascunho = async () => {
    /* Salvar rascunho: Grava o registro no banco de dados como rascunho, apresenta mensagem de feedback para o usuário e mantém o usuário na tela. Neste caso não há necessidade de preencher todos os campos obrigatórios.*/
  };

  const proximoPasso = async () => {
    /* deve ir para o próximo step se todos os campos obrigatórios estiverem preenchidos e o anterior fica verde e abre o próximo step com algum texto.*/

    setCurrent(current + 1);
  };

  const passoAnterior = async () => {
    /* deve ir para o próximo step se todos os campos obrigatórios estiverem preenchidos e o anterior fica verde e abre o próximo step com algum texto.*/

    current >= 1 && setCurrent(current - 1);
  };

  const onClickExcluir = () => {
    if (id) {
      confirmacao({
        content: DESEJA_EXCLUIR_REGISTRO,
        onOk() {
          deletarRegistro(`${URL_DEFAULT}/${id}`).then((response) => {
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: 'Registro excluído com sucesso',
              });
              navigate(ROUTES.CADASTRO);
            }
          });
        },
      });
    }
  };

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={salvar}
        initialValues={formInitialValues}
        validateMessages={validateMessages}
      >
        <HeaderPage title='Cadastro de Propostas'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
              {id ? (
                <Col>
                  <ButtonExcluir id={CF_BUTTON_EXCLUIR} onClick={onClickExcluir} />
                </Col>
              ) : (
                <></>
              )}
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      onClick={onClickCancelar}
                      style={{ fontWeight: 700 }}
                      disabled={!form.isFieldsTouched()}
                    >
                      Cancelar
                    </Button>
                  )}
                </Form.Item>
              </Col>
              {current > 0 && (
                <Col>
                  <Button
                    block
                    htmlType='submit'
                    onClick={passoAnterior}
                    id={CF_BUTTON_NOVO}
                    style={{ fontWeight: 700 }}
                  >
                    Passo anterior
                  </Button>
                </Col>
              )}
              <Col>
                <Button
                  block
                  htmlType='submit'
                  onClick={proximoPasso}
                  id={CF_BUTTON_NOVO}
                  style={{ fontWeight: 700 }}
                >
                  Próximo passo
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  onClick={salvarRascunho}
                  style={{ fontWeight: 700 }}
                >
                  Salvar rascunho
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Divider orientation='left' />
          <Steps
            current={current}
            items={stepTitles.map((title) => ({ title }))}
            onChange={(value) => setCurrent(value)}
          />
          {current === 0 && (
            <FormInformacoesGerais totalVagas={totalVagas ? String(totalVagas) : '0'} />
          )}
          <Auditoria dados={formInitialValues?.auditoria} />
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormCadastroDePropostas;
