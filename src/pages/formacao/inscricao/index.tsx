import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectCargo from '~/components/main/input/cargo';
import InputCPF from '~/components/main/input/cpf';
import SelectFuncaoAtividade from '~/components/main/input/funcao-atividade';
import InputRegistroFuncional from '~/components/main/input/input-registro-funcional';
import SelectTurma from '~/components/main/input/turmas';
import InputTexto from '~/components/main/text/input-text';
import UploadArquivosConectaFormacao from '~/components/main/upload';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  ENVIAR_INSCRICAO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { DadosUsuarioInscricaoDTO } from '~/core/dto/dados-usuario-inscricao-dto';
import { InscricaoDTO } from '~/core/dto/inscricao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { inserirInscricao } from '~/core/services/inscricao-service';
import usuarioService from '~/core/services/usuario-service';
import InputEmailInscricao from './components/input-email';
import { ModalInscricao } from './components/modal';

export const Inscricao = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const perfil = useAppSelector((state) => state.auth);
  const inscricao = useAppSelector((state) => state.inscricao);

  const [initialValues, setFormInitialValues] = useState({});
  const [openModal, setOpenModal] = useState<boolean>(false);

  // TODO - POR ENQUANTO VERIFICANDO SE TEM RF É SERVIDOR, DEPOIS TERA A INFORMACAO NO LOGIN DE USUARIO EXTERNO E INTERNO
  const ehServidorTemRF = !!perfil.usuarioLogin;

  const formacaoNome = inscricao && inscricao.titulo ? `- ${inscricao.titulo}` : '';

  const carregarPerfil = useCallback(async () => {
    usuarioService.obterMeusDados(perfil.usuarioLogin).then((resposta) => {
      if (resposta?.status === HttpStatusCode.Ok) {
        const valores = resposta.data;

        const valoresIniciais: DadosUsuarioInscricaoDTO = {
          usuarioNome: valores.nome,
          usuarioRf: ehServidorTemRF ? valores.login : '',
          usuarioCpf: valores.cpf,
          usuarioEmail: valores.email,
          usuarioCargos: ehServidorTemRF ? [] : '',
          usuarioFuncoes: ehServidorTemRF ? [] : [],
        };

        setFormInitialValues(valoresIniciais);
      }
    });
  }, [initialValues]);

  useEffect(() => {
    carregarPerfil();
  }, []);

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
          navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
        },
      });
    } else {
      navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
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
    const values: DadosUsuarioInscricaoDTO = form.getFieldsValue(true);
    const clonedValues: DadosUsuarioInscricaoDTO = cloneDeep(values);

    const valoresSalvar: InscricaoDTO = {
      propostaTurmaId: [],
      email: clonedValues?.usuarioEmail,
      cargoId: [] || '',
      funcaoId: [],
      arquivoId: [],
    };

    if (clonedValues?.propostaTurmaId?.length) {
      valoresSalvar.propostaTurmaId = clonedValues.propostaTurmaId.map((propostaTurmaId) => ({
        propostaTurmaId,
      }));
    }

    if (clonedValues?.usuarioCargos) {
      if (Array.isArray(clonedValues.usuarioCargos)) {
        valoresSalvar.cargoId = clonedValues.usuarioCargos.map((cargoId) => ({
          cargoId,
        }));
      } else {
        valoresSalvar.cargoId = clonedValues.usuarioCargos;
      }
    }

    if (clonedValues?.usuarioFuncoes?.length) {
      valoresSalvar.funcaoId = clonedValues.usuarioFuncoes.map((funcaoId) => ({
        funcaoId,
      }));
    }

    if (clonedValues?.arquivoId?.length) {
      valoresSalvar.arquivoId = clonedValues.arquivoId.map((arquivoId) => ({
        arquivoId,
      }));
    }

    {
      /*
    Critério 4 - Validação do cargo
    se for servidor
    Quando eu clicar em enviar
    Então caso meu cargo (base ou sobreposto) ou função atividade não esteja dentro do
    público alvo então deverá ser apresentada uma mensagem de erro
    "Você não possui o cargo definido no público alvo, sendo assim, não será possível inserir a sua inscrição."
    */
    }

    {
      /*
    Critério 5 - Validação da DRE
    Quando eu clicar em enviar
    Então caso a minha DRE seja diferente da DRE da turma deverá ser apresentada
    uma mensagem de erro "Sua lotação/local de trabalho não corresponde com a DRE
    desta turma, sendo assim, não será possível inserir sua inscrição."
    */
    }

    {
      /*
    Critério 6 - Inscrição duplicada
    Quando eu clicar em enviar
    Então caso eu já esteja inscrito na formação deverá apresentar uma mensagem
    de erro "Você já está matriculado nesta formação. Confira mais detalhes em "Minhas inscrições"."
    */
    }

    {
      /*
    Critério 9 - Inscrições encerradas
    Dado que sou cursista
    Quando eu estiver na lista de formações para formações não homologadas
    Caso as vagas de todas as turmas estejam completas então deverá ser apresentada
    a mensagem de inscrições encerradas e não deverá mais ser possível enviar inscrições
    Caso as vagas de apenas uma turma estejam encerradas então ao clicar no enviar
    inscrição deverá ser apresentada a mensagem "Esta turma já está com todas as vagas ocupadas."
    */
    }

    response = await inserirInscricao(valoresSalvar);

    if (response.sucesso) {
      setOpenModal(true);
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
                {ehServidorTemRF ? (
                  <SelectCargo formItemProps={{ name: 'usuarioCargos' }} />
                ) : (
                  <InputTexto
                    formItemProps={{ name: 'usuarioCargos' }}
                    inputProps={{ maxLength: 50, placeholder: 'Cargo' }}
                  />
                )}
              </Col>

              <Col xs={24} sm={8}>
                {ehServidorTemRF && (
                  <SelectFuncaoAtividade formItemProps={{ name: 'usuarioFuncoes' }} />
                )}
              </Col>

              <Col xs={24} sm={8}>
                <SelectTurma />
              </Col>

              <Col xs={24}>
                <UploadArquivosConectaFormacao
                  form={form}
                  formItemProps={{
                    name: 'arquivos',
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
            modalProps={{
              onCancel: () => setOpenModal(false),
            }}
            onConfirmButton={() => setOpenModal(false)}
            mensagem='Sua inscrição foi enviada com sucesso. Em breve você receberá a devolutiva por
                e-mail. Certifique-se que seu e-mail está atualizado no sistema em "Meus
                dados".'
          />
        )}
      </Form>
    </Col>
  );
};
