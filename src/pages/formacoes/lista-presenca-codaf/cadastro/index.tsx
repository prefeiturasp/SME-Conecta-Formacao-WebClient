import { Button, Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_CANCELAR, CF_BUTTON_SALVAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_CURSO_EOL,
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_CODIGO_NIVEL,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_COMUNICADO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
  CF_INPUT_PAGINA_COMUNICADO,
} from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';

const CadastroListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const turmas = [
    { label: 'DRE FB', value: 1 },
    { label: 'DRE CS', value: 2 },
    { label: 'DRE CL', value: 3 },
    { label: 'DRE BT', value: 4 },
    { label: 'DRE MP', value: 5 },
    { label: 'Turma 1', value: 6 },
  ];

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const onClickSalvar = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Formatar datas se necessário
      const dataPublicacao = values.dataPublicacao
        ? dayjs(values.dataPublicacao).format('YYYY-MM-DD')
        : null;
      const dataPublicacaoDiarioOficial = values.dataPublicacaoDiarioOficial
        ? dayjs(values.dataPublicacaoDiarioOficial).format('YYYY-MM-DD')
        : null;

      const dados = {
        ...values,
        dataPublicacao,
        dataPublicacaoDiarioOficial,
      };

      console.log('Dados a serem salvos:', dados);

      // TODO: Chamar serviço de criação quando estiver disponível
      // await criarListaPresencaCodaf(dados);

      notification.success({
        message: 'Sucesso',
        description: 'Registro salvo com sucesso!',
      });

      navigate(ROUTES.LISTA_PRESENCA_CODAF);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao salvar o registro',
      });
    } finally {
      setLoading(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF });
  };

  const onClickIrParaInscricoes = () => {
    setModalVisible(false);
    navigate(ROUTES.FORMACAOES_INSCRICOES);
  };

  const onClickContinuarRegistro = () => {
    setModalVisible(false);
  };

  return (
    <Col>
      <Modal
        title='Atenção'
        open={modalVisible}
        onCancel={onClickContinuarRegistro}
        footer={[
          <Button
            key='inscricoes'
            onClick={onClickIrParaInscricoes}
            style={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              fontWeight: 500,
            }}
          >
            Ir para tela de inscrições
          </Button>,
          <Button key='continuar' type='primary' onClick={onClickContinuarRegistro}>
            Continuar registro
          </Button>,
        ]}
      >
        <p>
          Antes de iniciar o registro CODAF, verifique se todos os cursistas estão inscritos na
          formação. Caso necessário, você pode realizar o cadastro pela tela de inscrições.
        </p>
      </Modal>
      <HeaderPage title='Cadastro - Lista Presença Codaf'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={onClickCancelar} id={CF_BUTTON_CANCELAR} />
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Número de homologação',
                    name: 'numeroHomologacao',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NUMERO_HOMOLOGACAO,
                    placeholder: 'Número de homologação',
                    maxLength: 20,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Código da formação',
                    name: 'codigoFormacao',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação',
                    maxLength: 20,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Número do comunicado',
                    name: 'numeroComunicado',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NUMERO_COMUNICADO,
                    placeholder: 'Número do comunicado',
                    maxLength: 20,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Nome da formação',
                    name: 'nomeFormacao',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome da formação',
                    maxLength: 200,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item
                  label='Turma'
                  name='turmaId'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Select placeholder='Selecione a turma' options={turmas} allowClear />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item
                  label='Data da publicação'
                  name='dataPublicacao'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <DatePicker
                    placeholder='Selecione a data'
                    format='DD/MM/YYYY'
                    style={{ width: '100%' }}
                    locale={locale}
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Página do comunicado no Diário Oficial',
                    name: 'paginaComunicado',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_PAGINA_COMUNICADO,
                    placeholder: 'Página do comunicado',
                    maxLength: 10,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item
                  label='Data de publicação do Diário Oficial'
                  name='dataPublicacaoDiarioOficial'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <DatePicker
                    placeholder='Selecione a data'
                    format='DD/MM/YYYY'
                    style={{ width: '100%' }}
                    locale={locale}
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Código do curso no EOL',
                    name: 'codigoCursoEol',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_CURSO_EOL,
                    placeholder: 'Código do curso no EOL',
                    maxLength: 50,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Código do nível',
                    name: 'codigoNivel',
                    rules: [{ required: true, message: 'Campo obrigatório' }],
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_NIVEL,
                    placeholder: 'Código do nível',
                    maxLength: 50,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 24 }} justify='end'>
            <Col>
              <Button
                type='default'
                onClick={onClickCancelar}
                style={{
                  fontWeight: 700,
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                }}
              >
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={onClickSalvar}
                loading={loading}
                id={CF_BUTTON_SALVAR}
                style={{ fontWeight: 700 }}
              >
                Salvar
              </Button>
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};

export default CadastroListaPresencaCodaf;
