import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputCPF from '~/components/main/input/cpf';
import SelectFuncaoAtividade from '~/components/main/input/funcao-atividade';
import InputRegistroFuncional from '~/components/main/input/input-registro-funcional';
import SelectTurma from '~/components/main/input/turmas';
import UploadArquivosConectaFormacao from '~/components/main/upload';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import { CF_SELECT_CARGO } from '~/core/constants/ids/select';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  ENVIAR_INSCRICAO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  DadosInscricaoCargoEolDTO,
  DadosInscricaoDTO,
} from '~/core/dto/dados-usuario-inscricao-dto';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { InscricaoDTO } from '~/core/dto/inscricao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { setDadosFormacao } from '~/core/redux/modules/area-publica-inscricao/actions';
import { confirmacao } from '~/core/services/alerta-service';
import { inserirInscricao, obterDadosInscricao } from '~/core/services/inscricao-service';
import InputEmailInscricao from './components/input-email';
import { ModalInscricao } from './components/modal';

export const Inscricao = () => {
  const [form] = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const perfil = useAppSelector((state) => state.auth);
  const inscricao = useAppSelector((state) => state.inscricao);

  const [initialValues, setFormInitialValues] = useState<DadosInscricaoDTO>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [formacaoState, setFormacaoState] = useState<FormacaoDTO>();

  const ehServidorTemRF = !!perfil.usuarioLogin;

  const formacaoNome = formacaoState?.titulo ? `- ${formacaoState?.titulo}` : '';

  const carregarPerfil = useCallback(async () => {
    const obterDados = await obterDadosInscricao();

    const dados = obterDados.dados;

    if (obterDados.sucesso) {
      let usuarioCargos: DadosInscricaoCargoEolDTO[] = [];
      if (ehServidorTemRF && Array.isArray(dados.usuarioCargos)) {
        usuarioCargos = dados.usuarioCargos.map((item) => ({
          ...item,
          value: item.codigo,
          label: item.descricao,
        }));
      }

      const valoresIniciais = {
        usuarioNome: dados.usuarioNome,
        usuarioRf: ehServidorTemRF ? dados.usuarioRf : '',
        usuarioCpf: dados.usuarioCpf,
        usuarioEmail: dados.usuarioEmail,
        usuarioCargos,
      };

      setFormInitialValues(valoresIniciais);
    }
  }, [initialValues]);

  useEffect(() => {
    carregarPerfil();
  }, []);

  useEffect(() => {
    if (inscricao?.formacao?.id) {
      setFormacaoState({ ...inscricao.formacao });
      dispatch(setDadosFormacao({}));
    }
  }, [dispatch, inscricao]);

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          form.submit();
        },
        onCancel() {
          navigate(ROUTES.AREA_PUBLICA);
        },
      });
    } else {
      navigate(ROUTES.AREA_PUBLICA);
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

  const enviarInscricao = async () => {
    let response = null;
    const values: any = form.getFieldsValue(true);
    const clonedValues: any = cloneDeep(values);

    const valoresSalvar: InscricaoDTO = {
      propostaTurmaId: clonedValues.propostaTurmaId,
      email: clonedValues?.usuarioEmail,
      cargoCodigo: undefined,
      cargoDreCodigo: undefined,
      cargoUeCodigo: undefined,
      funcaoCodigo: undefined,
      funcaoDreCodigo: undefined,
      funcaoUeCodigo: undefined,
    };

    if (Array.isArray(clonedValues?.arquivoId)) {
      valoresSalvar.arquivoId = clonedValues?.arquivoId?.[0]?.id;
    }

    if (clonedValues?.usuarioCargos?.length) {
      const itemCargos = clonedValues.usuarioCargos.find((item: any) => item);
      valoresSalvar.cargoCodigo = itemCargos?.codigo;
      valoresSalvar.cargoDreCodigo = itemCargos?.dreCodigo;
      valoresSalvar.cargoUeCodigo = itemCargos?.ueCodigo;

      if (clonedValues?.usuarioFuncoes) {
        const itemFuncoes = clonedValues.usuarioCargos.find((item: any) => item.funcoes);
        valoresSalvar.funcaoCodigo = itemFuncoes?.codigo;
        valoresSalvar.funcaoDreCodigo = itemFuncoes?.dreCodigo;
        valoresSalvar.funcaoUeCodigo = itemFuncoes?.ueCodigo;
      }
    }

    response = await inserirInscricao(valoresSalvar);

    if (response.sucesso) {
      setOpenModal(true);
      dispatch(setDadosFormacao({}));
    }
  };

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={enviarInscricao}
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <HeaderPage title={`Inscrição ${formacaoNome}`}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      style={{ fontWeight: 700 }}
                      onClick={onClickCancelar}
                    >
                      Cancelar
                    </Button>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  style={{ fontWeight: 700 }}
                >
                  {ENVIAR_INSCRICAO}
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <Form.Item label='Nome' key='usuarioNome' name='usuarioNome'>
                  <Input type='text' maxLength={50} id={CF_INPUT_NOME} placeholder='Nome' />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <InputRegistroFuncional formItemProps={{ name: 'usuarioRf' }} />
              </Col>

              <Col xs={24} sm={8}>
                <InputCPF formItemProps={{ name: 'usuarioCpf' }} />
              </Col>

              <Col xs={24} sm={8}>
                <InputEmailInscricao formItemProps={{ name: 'usuarioEmail' }} />
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  label='Cargo'
                  name='usuarioCargos'
                  getValueFromEvent={(_, value) => value}
                >
                  <Select
                    allowClear
                    options={
                      initialValues?.usuarioCargos?.length ? initialValues.usuarioCargos : []
                    }
                    placeholder='Selecione um cargo'
                    id={CF_SELECT_CARGO}
                    labelInValue
                  />
                </Form.Item>

                {/* TODO: Quando houver usuarios externos, mudar habilitar o codigo abaixo */}
                {/* {ehServidorTemRF ? (
                     <Form.Item
                  label='Cargo'
                  name='usuarioCargos'
                  getValueFromEvent={(_, value) => value}
                >
                  <Select
                    allowClear
                    options={
                      initialValues?.usuarioCargos?.length ? initialValues.usuarioCargos : []
                    }
                    placeholder='Selecione um cargo'
                    id={CF_SELECT_CARGO}
                    labelInValue
                  />
                </Form.Item>
                ) : (
                  <InputTexto
                    formItemProps={{ name: 'usuarioCargos' }}
                    inputProps={{ maxLength: 50, placeholder: 'Cargo' }}
                  />
                )} */}
              </Col>

              <Col xs={24} sm={8}>
                {ehServidorTemRF && <SelectFuncaoAtividade />}
              </Col>

              <Col xs={24} sm={8}>
                <SelectTurma propostaId={formacaoState?.id} />
              </Col>

              <Col xs={24}>
                <UploadArquivosConectaFormacao
                  form={form}
                  formItemProps={{
                    name: 'arquivoId',
                    label: 'Upload',
                  }}
                  tipoArquivosPermitidos=',.pdf'
                  subTitulo='Permite apenas arquivos e imagens com no máximo 5MB cada'
                />
              </Col>
            </Row>
          </Col>
        </CardContent>

        {openModal && (
          <ModalInscricao
            labelConfirmButton='OK'
            onConfirmButton={() => {
              setOpenModal(false);
              navigate(ROUTES.PRINCIPAL);
            }}
            mensagem='Sua inscrição foi enviada com sucesso. Em breve você receberá a devolutiva por
                e-mail. Certifique-se que seu e-mail está atualizado no sistema em "Meus
                dados".'
          />
        )}
      </Form>
    </Col>
  );
};
