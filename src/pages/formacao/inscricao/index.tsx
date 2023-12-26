import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
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
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
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
  // TODO - AJUSTAR VARIAVEL QUANDO FOR USUARIO DA REDE PARCEIRA
  const ehRedeParceira = true;
  const nomeFormacao = inscricao && inscricao.titulo ? `- ${inscricao.titulo}` : '';

  const carregarPerfil = useCallback(async () => {
    usuarioService.obterMeusDados(perfil.usuarioLogin).then((resposta) => {
      if (resposta?.status === HttpStatusCode.Ok) {
        const valores = resposta.data;
        const registroFuncional = ehServidorTemRF ? resposta.data.login : '';
        const publicosAlvo = ehServidorTemRF ? undefined : '';

        const valoresIniciais = {
          nome: valores.nome,
          registroFuncional,
          cpf: valores.cpf,
          email: valores.email,
          publicosAlvo,
          funcoesEspecificas: undefined,
          turma: undefined,
          upload: undefined,
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
    // const response = null;

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

    // if (id) {
    //   response = await alterarAreaPromotora(id, valoresSalvar, true);
    // } else {
    //   response = await inserirAreaPromotora(valoresSalvar);
    // }

    // if (response.sucesso) {
    //   setOpenModal(true);
    // }
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
        <HeaderPage title={`Inscrição ${nomeFormacao}`}>
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
                <Form.Item label='Nome' key='nome' name='nome'>
                  <Input type='text' maxLength={50} id={CF_INPUT_NOME} placeholder='Nome' />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <InputRegistroFuncional />
              </Col>

              <Col xs={24} sm={8}>
                <InputCPF />
              </Col>

              <Col xs={24} sm={8}>
                E-mail: Carregar do CoreSSO, permitindo alteração e se estiver vazio ou com conteúdo
                inválido deve ser obrigatório. Deve atualizar no CoreSSO quando alterado ou
                preenchido. Para os usuários da rede parceira deve validar o domínio @edu
                <InputEmailInscricao validacaoEmail={ehRedeParceira} />
              </Col>

              <Col xs={24} sm={8}>
                Cargo: Para servidores deve vir preenchido e pode ser que tenha mais de um. Para
                parceiros permitir a digitação obrigatória de até 50 caractares. Considerar cargo
                sobreposto, caso houver.
                {ehServidorTemRF ? (
                  <SelectCargo />
                ) : (
                  <InputTexto
                    formItemProps={{ name: 'publicosAlvo' }}
                    inputProps={{ maxLength: 50, placeholder: 'Público Alvo' }}
                  />
                )}
              </Col>

              <Col xs={24} sm={8}>
                {ehServidorTemRF && <SelectFuncaoAtividade />}
              </Col>

              <Col xs={24} sm={8}>
                Turma: Apresentar a lista de turmas com as datas sendo que a seleção de uma é
                obrigatória.
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
