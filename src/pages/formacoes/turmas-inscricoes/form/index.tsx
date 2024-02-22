import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
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
import {
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  NOME_NAO_INFORMADO,
} from '~/core/constants/mensagens';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { obterTiposInscricao } from '~/core/services/inscricao-service';

const FormCadastrosInscricoes: React.FC = () => {
  const paramsRoute = useParams();
  const [form] = useForm();
  const [cpfRequerido, setCpfRequerido] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const id = paramsRoute?.id || 0;
  const nomeFormacao = location?.state?.form?.location?.state?.nomeFormacao;
  const [listaTipos, setListaTipos] = useState<RetornoListagemDTO[]>();
  const { Option } = Select;
  const salvar = async () => {
    console.log(form.getFieldsValue());
  };
  const obterDadosPofissional = async () => {
    console.log('Buscou por profissional');
  };
  const obterTipos = useCallback(async () => {
    const resposta = await obterTiposInscricao();
    if (resposta.sucesso) {
      setListaTipos(resposta.dados);
    }
  }, []);
  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          form.submit();
        },
        onCancel() {
          navigate(`${ROUTES.FORMACAOES_INSCRICOES}`);
        },
      });
    } else {
      navigate(ROUTES.FORMACAOES_INSCRICOES);
    }
  };
  useEffect(() => {
    obterTipos();
  }, [obterTipos]);
  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' onFinish={salvar}>
        <HeaderPage title={nomeFormacao}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
              <Col>
                <Button
                  block
                  type='default'
                  htmlType='submit'
                  id={CF_BUTTON_CANCELAR}
                  style={{ fontWeight: 700 }}
                >
                  Cancelar
                </Button>
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
              <Col xs={24} sm={12}>
                <SelectTurmaEncontros
                  idProposta={id}
                  exibirTooltip={false}
                  podeSelecionarVarios={false}
                />
              </Col>
              <Col xs={12} sm={6}>
                <RadioSimNao
                  formItemProps={{
                    name: 'profissionalRedeMunicipal',
                    label: 'Profissional da rede municipal',
                  }}
                  radioGroupProps={{
                    onChange: (e) => {
                      if (e.target.value) {
                        setCpfRequerido(true);
                      } else {
                        setCpfRequerido(false);
                      }
                    },
                  }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item label='RF' name='registroFuncional' required={cpfRequerido}>
                  <Input.Search
                    id='INPUT_RF'
                    maxLength={7}
                    placeholder='Registro Funcional (RF)'
                    onSearch={obterDadosPofissional}
                    onBlur={obterDadosPofissional}
                  />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} xl={6}>
                <Row>
                  <Col span={20}>
                    <InputCPF inputProps={{ disabled: cpfRequerido }} />
                  </Col>
                  <Col span={4}>
                    <Form.Item label='  '>
                      <Button
                        block
                        disabled={cpfRequerido}
                        onClick={obterDadosPofissional}
                        type='default'
                        id={CF_BUTTON_CANCELAR}
                        style={{ fontWeight: 900 }}
                      >
                        <SearchOutlined />
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <InputTexto
                  formItemProps={{
                    label: 'Nome',
                    name: 'nome',
                    rules: [{ required: true, message: NOME_NAO_INFORMADO }],
                  }}
                  inputProps={{
                    placeholder: 'Informe o Nome',
                    disabled: cpfRequerido,
                    id: CF_INPUT_NOME,
                  }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item label='Situação da inscrição' name='situacaoIncricao' required={true}>
                  <Select>
                    {listaTipos?.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.descricao}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormCadastrosInscricoes;
