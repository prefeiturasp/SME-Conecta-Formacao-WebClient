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
import { ENVIAR_INSCRICAO, SUA_INSCRICAO_NAO_FOI_ENVIADA } from '~/core/constants/mensagens';
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
import { inserirInscricao, obterDadosInscricao } from '~/core/services/inscricao-service';
import { onClickCancelar, onClickVoltar } from '~/core/utils/form';
import InputEmailInscricao from './components/input-email';
import { ModalInscricao } from './components/modal';

export const Inscricao = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const perfil = useAppSelector((state) => state.auth);
  const inscricao = useAppSelector((state) => state.inscricao);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [usuarioCargosQuantidade, setUsuarioCargosQuantidade] = useState<number>(0);
  const [formacaoState, setFormacaoState] = useState<FormacaoDTO>();
  const [initialValues, setFormInitialValues] = useState<DadosInscricaoDTO>();

  const ehServidorTemRF = !!perfil.usuarioLogin;

  const formacaoNome = formacaoState?.titulo ? `- ${formacaoState?.titulo}` : '';

  const [confirmacaoInscricao, setConfirmacaoInscricao] = useState<string>('');

  const carregarPerfil = useCallback(async () => {
    const obterDados = await obterDadosInscricao();
    const dados = obterDados.dados;

    if (obterDados.sucesso) {
      let usuarioCargos: DadosInscricaoCargoEolDTO[] = [];

      let usuarioCargoSelecionado: DadosInscricaoDTO['usuarioCargoSelecionado'] = undefined;
      setUsuarioCargosQuantidade(dados.usuarioCargos?.length);
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
        usuarioEmail: dados.usuarioEmail,
        usuarioCargos,
        usuarioCargoSelecionado,
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

  const enviarInscricao = async () => {
    let response = null;
    const values: DadosInscricaoDTO = form.getFieldsValue(true);
    const clonedValues: DadosInscricaoDTO = cloneDeep(values);

    const valoresSalvar: InscricaoDTO = {
      propostaTurmaId: clonedValues.propostaTurmaId,
      email: clonedValues?.usuarioEmail,
      cargoCodigo: undefined,
      cargoDreCodigo: undefined,
      cargoUeCodigo: undefined,
      funcaoCodigo: undefined,
      funcaoDreCodigo: undefined,
      funcaoUeCodigo: undefined,
      tipoVinculo: undefined,
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
      setConfirmacaoInscricao(response.dados.mensagem);
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
                <InputEmailInscricao formItemProps={{ name: 'usuarioEmail' }} />
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

                {/* TODO: Quando houver usuarios externos, mudar habilitar o codigo abaixo */}
                {/* {ehServidorTemRF ? (
                  <Form.Item label='Cargo' name='usuarioCargoSelecionado'>
                  <Select
                    allowClear
                    options={
                      initialValues?.usuarioCargos?.length ? initialValues.usuarioCargos : []
                    }
                    onChange={() => form.setFieldValue('usuarioFuncaoSelecionado', undefined)}
                    placeholder='Selecione um cargo'
                    id={CF_SELECT_CARGO}
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

              <Col xs={24} sm={24}>
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
            mensagem={confirmacaoInscricao}
          />
        )}
      </Form>
    </Col>
  );
};
