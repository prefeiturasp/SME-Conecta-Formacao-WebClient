import { Button, Col, Divider, Form, Row, StepProps, notification } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import Steps from '~/components/main/steps';
import Auditoria from '~/components/main/text/auditoria';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_NOVO,
  CF_BUTTON_PROXIMO_STEP,
  CF_BUTTON_STEP_ANTERIOR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_EXCLUIR_REGISTRO,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  REGISTRO_EXCLUIDO_SUCESSO,
} from '~/core/constants/mensagens';
import { STEP_PROPOSTA, StepPropostaEnum } from '~/core/constants/steps-proposta';
import { PropostaDTO, PropostaFormDTO } from '~/core/dto/proposta-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoRegistro } from '~/core/enum/situacao-registro';
import { confirmacao } from '~/core/services/alerta-service';
import {
  alterarProposta,
  deletarProposta,
  inserirProposta,
  obterPropostaPorId,
} from '~/core/services/proposta-service';
import FormInformacoesGerais from './steps/informacoes-gerais';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { TipoInscricao } from '~/core/enum/tipo-inscricao';

const FormCadastroDePropostas: React.FC = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const [form] = useForm();

  const [currentStep, setCurrentStep] = useState<StepPropostaEnum>(
    StepPropostaEnum.InformacoesGerais,
  );

  const [formInitialValues, setFormInitialValues] = useState<PropostaFormDTO>();

  const id = paramsRoute?.id || 0;

  const stepsProposta: StepProps[] = [
    {
      title: STEP_PROPOSTA.INFORMACOES_GERAIS.TITULO,
    },
    {
      title: STEP_PROPOSTA.DATAS.TITULO,
    },
    {
      title: STEP_PROPOSTA.DETALHAMENTO.TITULO,
    },
    {
      title: STEP_PROPOSTA.PROFISSIONAIS.TITULO,
    },
    {
      title: STEP_PROPOSTA.CERTIFICACAO.TITULO,
    },
  ];

  const validateMessages: FormProps['validateMessages'] = {
    required: 'Campo obrigatório',
  };

  const carregarValoresDefault = () => {
    const valoresIniciais: PropostaFormDTO = {
      tipoFormacao: TipoFormacao.Curso,
      tipoInscricao: TipoInscricao.Optativa,
      publicosAlvo: [],
      funcoesEspecificas: [],
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
    };

    setFormInitialValues(valoresIniciais);
  };

  const carregarDados = useCallback(async () => {
    const resposta = await obterPropostaPorId(id);

    if (resposta.sucesso) {
      let publicosAlvo: number[] = [];
      if (resposta.dados?.publicosAlvo?.length) {
        publicosAlvo = resposta.dados.publicosAlvo.map((item) => item.cargoFuncaoId);
      }

      let funcoesEspecificas: number[] = [];
      if (resposta.dados?.funcoesEspecificas?.length) {
        funcoesEspecificas = resposta.dados.funcoesEspecificas.map((item) => item.cargoFuncaoId);
      }

      let vagasRemanecentes: number[] = [];
      if (resposta.dados?.vagasRemanecentes?.length) {
        vagasRemanecentes = resposta.dados.vagasRemanecentes.map((item) => item.cargoFuncaoId);
      }

      let criteriosValidacaoInscricao: number[] = [];
      if (resposta.dados?.criteriosValidacaoInscricao?.length) {
        criteriosValidacaoInscricao = resposta.dados.criteriosValidacaoInscricao.map(
          (item) => item.criterioValidacaoInscricaoId,
        );
      }

      const valoresIniciais: PropostaFormDTO = {
        ...resposta.dados,
        publicosAlvo,
        funcoesEspecificas,
        vagasRemanecentes,
        criteriosValidacaoInscricao,
      };

      setFormInitialValues(valoresIniciais);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    } else {
      carregarValoresDefault();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

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

  const salvar = async (values: PropostaFormDTO, situacao: SituacaoRegistro) => {
    let response = null;
    const clonedValues = cloneDeep(values);

    const valoresSalvar: PropostaDTO = {
      tipoFormacao: clonedValues?.tipoFormacao,
      modalidade: clonedValues?.modalidade,
      tipoInscricao: clonedValues?.tipoInscricao,
      nomeFormacao: clonedValues?.nomeFormacao,
      quantidadeTurmas: clonedValues?.quantidadeTurmas,
      quantidadeVagasTurma: clonedValues?.quantidadeVagasTurma,
      publicosAlvo: [],
      quantidadeTotal: clonedValues?.quantidadeTotal,
      funcoesEspecificas: [],
      funcaoEspecificaOutros: clonedValues?.funcaoEspecificaOutros || '',
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      criterioValidacaoInscricaoOutros: clonedValues?.criterioValidacaoInscricaoOutros || '',
      situacao,
    };

    if (clonedValues?.publicosAlvo?.length) {
      valoresSalvar.publicosAlvo = clonedValues.publicosAlvo.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }

    if (clonedValues?.funcoesEspecificas?.length) {
      valoresSalvar.funcoesEspecificas = clonedValues.funcoesEspecificas.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }

    if (clonedValues?.vagasRemanecentes?.length) {
      valoresSalvar.vagasRemanecentes = clonedValues.vagasRemanecentes.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }

    if (clonedValues?.criteriosValidacaoInscricao?.length) {
      valoresSalvar.criteriosValidacaoInscricao = clonedValues.criteriosValidacaoInscricao.map(
        (criterioValidacaoInscricaoId) => ({
          criterioValidacaoInscricaoId,
        }),
      );
    }

    if (id) {
      response = await alterarProposta(id, valoresSalvar);
    } else {
      response = await inserirProposta(valoresSalvar);
    }

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: `Registro ${id ? 'alterado' : 'inserido'} com sucesso!`,
      });

      if (id) {
        carregarDados();
      } else {
        const novoId = response.dados;
        navigate(`${ROUTES.CADASTRO_DE_PROPOSTAS}/editar/${novoId}`, { replace: true });
      }
      return true;
    }

    return false;
  };

  const proximoPasso = async () => {
    const salvou = await salvar(form.getFieldsValue(), SituacaoRegistro.Rascunho);
    if (salvou) {
      setCurrentStep(currentStep + 1);
    }
  };

  const passoAnterior = async () => {
    // TODO
    currentStep >= StepPropostaEnum.Datas && setCurrentStep(currentStep - 1);
  };

  const salvarRascunho = () => {
    salvar(form.getFieldsValue(), SituacaoRegistro.Rascunho);
  };

  const onClickExcluir = () => {
    if (id) {
      confirmacao({
        content: DESEJA_EXCLUIR_REGISTRO,
        onOk() {
          deletarProposta(id).then((response) => {
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: REGISTRO_EXCLUIDO_SUCESSO,
              });
              navigate(ROUTES.PRINCIPAL);
            }
          });
        },
      });
    }
  };

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        async onOk() {
          await salvar(form.getFieldsValue(), SituacaoRegistro.Rascunho);
          navigate(ROUTES.PRINCIPAL);
        },
        onCancel() {
          navigate(ROUTES.PRINCIPAL);
        },
      });
    } else {
      navigate(ROUTES.PRINCIPAL);
    }
  };
  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
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
              <Col>
                <Button
                  block
                  onClick={passoAnterior}
                  id={CF_BUTTON_STEP_ANTERIOR}
                  style={{ fontWeight: 700 }}
                  disabled={currentStep < StepPropostaEnum.Datas}
                >
                  Passo anterior
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  onClick={proximoPasso}
                  id={CF_BUTTON_PROXIMO_STEP}
                  style={{ fontWeight: 700 }}
                  disabled={currentStep >= StepPropostaEnum.Certificacao}
                >
                  Próximo passo
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
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
            current={currentStep}
            items={stepsProposta}
            onChange={(value) => setCurrentStep(value)}
            style={{ marginBottom: 55 }}
          />
          {currentStep === StepPropostaEnum.InformacoesGerais ? (
            <>
              <FormInformacoesGerais form={form} />
              <Auditoria dados={formInitialValues?.auditoria} />
            </>
          ) : (
            'Seção em desenvolvimento!'
          )}
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormCadastroDePropostas;
