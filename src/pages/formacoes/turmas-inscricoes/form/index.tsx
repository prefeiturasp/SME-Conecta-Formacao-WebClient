import { Button, Col, Form, Row } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputCPF from '~/components/main/input/cpf';
import InputRegistroFuncional from '~/components/main/input/input-registro-funcional';
import RadioSimNao from '~/components/main/input/profissional-rede-municipal';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import { RF_NAO_INFORMADO } from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes-enum';
import { obterRfCpf } from '~/core/services/inscricao-service';
import { onClickCancelar, onClickVoltar } from '~/core/utils/form';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';

export const FormCadastrosInscricoesManuais: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const profissionalRedeMunicipalWatch = useWatch('profissionalRedeMunicipal', form);

  const id = paramsRoute?.id || 0;
  const inscriacaoState = location?.state;
  const formacaoNome = inscriacaoState?.nomeFormacao ? `- ${inscriacaoState?.nomeFormacao}` : '';

  const salvar = async () => {
    form.validateFields().then(() => {
      alert('salvar');
    });
  };

  const buscarRfCPF = (rfCpf?: string) => {
    if (!rfCpf) return;

    const rfCpfSemCaracteres = removerTudoQueNaoEhDigito(rfCpf);
    obterRfCpf(rfCpfSemCaracteres).then((resposta) => {
      if (resposta.sucesso) {
        const dados = resposta.dados;

        form.setFieldValue('cpf', dados.cpf);
        form.setFieldValue('nome', dados.nome);
      }
    });
  };

  useEffect(() => {
    form.resetFields(['nome', 'cpf', 'registroFuncional']);
  }, [profissionalRedeMunicipalWatch]);

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' onFinish={salvar}>
        <HeaderPage title={`Inscrição Manual ${formacaoNome}`}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() =>
                    onClickVoltar({
                      form,
                      navigate,
                      route: ROUTES.FORMACAOES_INSCRICOES,
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
                      htmlType='submit'
                      id={CF_BUTTON_CANCELAR}
                      onClick={() => onClickCancelar({ form })}
                      disabled={!form.isFieldsTouched()}
                      style={{ fontWeight: 700 }}
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
                  Salvar
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={8}>
                <SelectTurmaEncontros
                  idProposta={id}
                  exibirTooltip={false}
                  podeSelecionarVarios={false}
                />
              </Col>
              <Col xs={12} sm={6} md={8}>
                <RadioSimNao
                  formItemProps={{
                    name: 'profissionalRedeMunicipal',
                    label: 'Profissional da rede municipal',
                  }}
                />
              </Col>
              <Col xs={12} sm={6} md={8}>
                <InputRegistroFuncional
                  habilitarInputSearch
                  formItemProps={{
                    rules: [
                      { required: profissionalRedeMunicipalWatch, message: RF_NAO_INFORMADO },
                    ],
                  }}
                  inputPropsSearch={{
                    onSearch: buscarRfCPF,
                    disabled: !profissionalRedeMunicipalWatch,
                  }}
                />
              </Col>
              <Col xs={12} sm={6} md={8}>
                <InputCPF
                  habilitarInputSearch
                  formItemProps={{
                    required: !profissionalRedeMunicipalWatch,
                  }}
                  inputPropsSearch={{
                    onSearch: buscarRfCPF,
                    disabled:
                      profissionalRedeMunicipalWatch ||
                      profissionalRedeMunicipalWatch === undefined,
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <InputTexto
                  formItemProps={{
                    label: 'Nome',
                    name: 'nome',
                  }}
                  inputProps={{
                    disabled: true,
                    id: CF_INPUT_NOME,
                    placeholder: 'Informe o Nome',
                  }}
                />
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
