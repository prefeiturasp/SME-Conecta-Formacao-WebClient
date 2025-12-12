import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { cloneDeep, set } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputCPF from '~/components/main/input/cpf';
import InputRegistroFuncional from '~/components/main/input/input-registro-funcional';
import UploadArquivosConectaFormacao from '~/components/main/upload';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import { CF_SELECT_CARGO } from '~/core/constants/ids/select';
import { ENVIAR_INSCRICAO, INSCRICAO_NAO_ATENDE_CRITERIOS_VAGAS_REMANESCENTES, SUA_INSCRICAO_NAO_FOI_ENVIADA } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  DadosInscricaoCargoEolDTO,
  DadosInscricaoPropostaDto
} from '~/core/dto/dados-usuario-inscricao-dto';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { InscricaoDTO } from '~/core/dto/inscricao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { setDadosFormacao } from '~/core/redux/modules/area-publica-inscricao/actions';
import { inserirInscricao, obterDadosInscricaoProposta } from '~/core/services/inscricao-service';
import { onClickCancelar, onClickVoltar } from '~/core/utils/form';
import SelectFuncaoAtividade from './components/funcao-atividade';
import { ModalInscricao } from './components/modal';
import SelectTurma from './components/turmas';
import { openNotificationErrors } from '~/components/lib/notification';
import { env } from 'process';

export const Inscricao = () => {
  const paramsRoute = useParams();
  const propostaId = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const perfil = useAppSelector((state) => state.auth);
  const inscricao = useAppSelector((state) => state.inscricao);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [usuarioCargosQuantidade, setUsuarioCargosQuantidade] = useState<number>(0);
  const [formacaoState, setFormacaoState] = useState<FormacaoDTO>();
  const [initialValues, setFormInitialValues] = useState<DadosInscricaoPropostaDto>();
  const [vagaRemanescente, setVagaRemanescente] = useState<boolean>(false);
  const [abrirModalListaDeEspera, setAbrirModalListaDeEspera] = useState<boolean>(false);
  const [abrirModalInscricaoNaListaDeEspera, setAbrirModalInscricaoNaListaDeEspera] = useState<boolean>(false);

  const ehServidorTemRF = !!perfil.usuarioLogin;

  const formacaoNome = formacaoState?.titulo ? `- ${formacaoState?.titulo}` : '';

  const [confirmacaoInscricao, setConfirmacaoInscricao] = useState<string>('');

  const carregarPerfil = useCallback(async () => {
    const obterDados = await obterDadosInscricaoProposta(propostaId);
    const dados = obterDados.dados;

    if (obterDados.sucesso) {
      let usuarioCargos: DadosInscricaoCargoEolDTO[] = [];
      let usuarioCargoSelecionado: DadosInscricaoPropostaDto['usuarioCargoSelecionado'] = undefined;

      setUsuarioCargosQuantidade(dados.usuarioCargos?.length);
      setVagaRemanescente(dados.vagaRemanescente);
      if (ehServidorTemRF && Array.isArray(dados.usuarioCargos)) {
        usuarioCargos = cloneDeep(dados.usuarioCargos).map((item) => {
          let funcoes: DadosInscricaoCargoEolDTO[] = [];

          if (item?.funcoes?.length) {
            funcoes = item.funcoes.map((f) => ({
              ...f,
              label: f.descricao,
              value: f.codigo,
              tipoVinculo: f.tipoVinculo,
            }));
          }

          const valorValue =
            item.tipoVinculo && dados.usuarioCargos.length > 1
              ? `${item.codigo}-${item.tipoVinculo}`
              : item.codigo;

          return {
            ...item,
            value: valorValue,
            label: item.descricao,
            tipoVinculo: item.tipoVinculo,
            funcoes,
            codigo: item.codigo,
          };
        });

        if (usuarioCargos?.length === 1) {
          const cargoSelecionado = cloneDeep(usuarioCargos[0]);
          usuarioCargoSelecionado = cargoSelecionado?.codigo;
        }
      }

      const valoresIniciais = {
        usuarioNome: dados.usuarioNome,
        usuarioRf: ehServidorTemRF ? dados.usuarioRf : '',
        usuarioCpf: dados.usuarioCpf,
        usuarioCargos,
        usuarioCargoSelecionado,
        vagaRemanescente: dados.vagaRemanescente,
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

  const enviarInscricaoContinuar = async () => {
    setAbrirModalListaDeEspera(false);
    await enviarInscricao(true);
  }

  const enviarInscricao = async (forcarContinuacao = false) => {debugger;
    if (vagaRemanescente && !forcarContinuacao) {
      setAbrirModalListaDeEspera(true);
      return;
    }

    let response = null;

    const values: DadosInscricaoPropostaDto = form.getFieldsValue(true);
    const clonedValues: DadosInscricaoPropostaDto = cloneDeep(values);

    const valoresSalvar: InscricaoDTO = {
      propostaTurmaId: clonedValues.propostaTurmaId,
      cargoCodigo: undefined,
      cargoDreCodigo: undefined,
      cargoUeCodigo: undefined,
      funcaoCodigo: undefined,
      funcaoDreCodigo: undefined,
      funcaoUeCodigo: undefined,
      tipoVinculo: undefined,
      vagaRemanescente: clonedValues.vagaRemanescente,
    };

    if (Array.isArray(clonedValues?.arquivoId)) {
      valoresSalvar.arquivoId = clonedValues?.arquivoId?.[0]?.id;
    }

    if (clonedValues?.usuarioCargoSelecionado) {
      const itemCargos = clonedValues?.usuarioCargos?.find((item: any) =>
        usuarioCargosQuantidade == 1
          ? item?.codigo === clonedValues?.usuarioCargoSelecionado
          : item?.value === clonedValues?.usuarioCargoSelecionado,
      );
      valoresSalvar.cargoCodigo = itemCargos?.codigo;
      valoresSalvar.cargoDreCodigo = itemCargos?.dreCodigo;
      valoresSalvar.cargoUeCodigo = itemCargos?.ueCodigo;
      valoresSalvar.tipoVinculo = itemCargos?.tipoVinculo;

      if (clonedValues?.usuarioFuncaoSelecionado && itemCargos?.funcoes?.length) {
        const itemFuncoes = itemCargos?.funcoes?.find(
          (item) => item?.codigo === clonedValues.usuarioFuncaoSelecionado,
        );

        valoresSalvar.funcaoCodigo = itemFuncoes?.codigo;
        valoresSalvar.funcaoDreCodigo = itemFuncoes?.dreCodigo;
        valoresSalvar.funcaoUeCodigo = itemFuncoes?.ueCodigo;
        valoresSalvar.tipoVinculo = itemFuncoes?.tipoVinculo;
      }
    }

    response = await inserirInscricao(valoresSalvar);

    if (response.sucesso) {
      if (vagaRemanescente) {
        setAbrirModalInscricaoNaListaDeEspera(true);
      }
      else{
      setConfirmacaoInscricao(response.dados.mensagem);
      setOpenModal(true);
    }
      dispatch(setDadosFormacao({}));
    }
  };

  const cancelarInscricaoModal = () => {
    setAbrirModalListaDeEspera(false);
    openNotificationErrors([INSCRICAO_NAO_ATENDE_CRITERIOS_VAGAS_REMANESCENTES]);
  }

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={() => enviarInscricao(false)}
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <HeaderPage title={`Inscrição ${formacaoNome}`}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() =>
                    onClickVoltar({
                      form,
                      navigate,
                      route: ROUTES.AREA_PUBLICA,
                      mensagem: SUA_INSCRICAO_NAO_FOI_ENVIADA,
                    })
                  }
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      style={{ fontWeight: 700 }}
                      onClick={() => onClickCancelar({ form })}
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
                  <Input
                    disabled
                    type='text'
                    maxLength={50}
                    id={CF_INPUT_NOME}
                    placeholder='Nome'
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <InputRegistroFuncional
                  inputProps={{ disabled: true }}
                  formItemProps={{ name: 'usuarioRf' }}
                />
              </Col>

              <Col xs={24} sm={8}>
                <InputCPF inputProps={{ disabled: true }} formItemProps={{ name: 'usuarioCpf' }} />
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label='Cargo' name='usuarioCargoSelecionado'>
                  <Select
                    disabled={initialValues?.usuarioCargos?.length == 1}
                    allowClear
                    options={
                      initialValues?.usuarioCargos?.length ? initialValues.usuarioCargos : []
                    }
                    onChange={() => form.setFieldValue('usuarioFuncaoSelecionado', undefined)}
                    placeholder='Selecione um cargo'
                    id={CF_SELECT_CARGO}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                {ehServidorTemRF && <SelectFuncaoAtividade />}
              </Col>

              <Col xs={24} sm={8}>
                <SelectTurma propostaId={propostaId} />
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

              {abrirModalListaDeEspera && (
                <Modal
                  open
                  title='Esta formação possui lista de espera!'
                  centered
                  destroyOnClose
                  okText='Realizar inscrição'
                  cancelText='Cancelar'
                  onOk={() => { enviarInscricaoContinuar(); }}
                  onCancel={cancelarInscricaoModal}>
                  <Typography.Text style={{ fontSize: 16 }}>
                    Deseja realizar a inscrição mesmo assim?
                  </Typography.Text>
                </Modal>
              )}

              {abrirModalInscricaoNaListaDeEspera && (
                <Modal
                  open
                  title='Você está na lista de espera!'
                  centered
                  destroyOnClose
                  okText='Voltar à tela inicial'
                  cancelText='Conferir mais informações'
                  onOk={() => { navigate(ROUTES.PRINCIPAL); }}
                  // Ao cancelar ainda não há uma ação definida não fazer nada
                  onCancel={() => { }}
                  styles={{
                    header: {
                      fontSize: '20px'
                    }
                  }}>
                  <Typography.Text style={{ fontSize: 12 }}>
                    Olá {perfil.usuarioNome}!
                    <br /><br />
                    Sua inscrição na lista de espera da formação "<strong>{formacaoState?.titulo}</strong>" foi realizada com sucesso!
                    <br />
                     Você receberá um e-mail de confirmação da sua participação.
                    <br /><br />
                    Você pode acompanhar suas inscrições clicando no botão “voltar à tela inicial”
                  </Typography.Text>
                </Modal>
              )}
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
            mensagem={confirmacaoInscricao}
          />
        )}
      </Form>
    </Col>
  );
};
