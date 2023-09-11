import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import DatePickerPeriodo from '~/components/main/input/date-range';
import RadioFormacaoHomologada from '~/components/main/input/formacao-homologada';
import SelectModalidades from '~/components/main/input/modalidades';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import SelectSituacaoProposta from '~/components/main/input/situacao-proposta';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { PropostaFormListDTO } from '~/core/dto/proposta-from-list-dto';
import { FormacaoHomologada } from '~/core/enum/formacao-homologada';
import { ROUTES } from '~/core/enum/routes-enum';
const ListCadastroDePropostas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [formInitialValues, setFormInitialValues] = useState<PropostaFormListDTO>();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);
  //const onClickNovo = () => navigate(ROUTES.CADASTRO_DE_PROPOSTAS_NOVO);

  const buscar = () => {
    console.log(form.getFieldsValue());
  };
  const carregarValoresDefault = () => {
    const valoreIniciais: PropostaFormListDTO = {
      areaPromotora: 0,
      codigoFormacao: 0,
      formacaoHomologada: FormacaoHomologada.Nao,
      nomeFormacao: '',
      pubicoAlvo: [],
    };
    setFormInitialValues(valoreIniciais);
  };
  useEffect(() => {
    carregarValoresDefault();
  }, [form]);
  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' initialValues={formInitialValues}>
        <HeaderPage title='Cadastro de Propostas'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  onClick={() => buscar()}
                  style={{ fontWeight: 700 }}
                >
                  {'Novo'}
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Form.Item shouldUpdate>
            {() => (
              <>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={10} md={7} lg={7} xl={5}>
                    <RadioFormacaoHomologada />
                  </Col>
                  <Col xs={24} sm={10} md={7} lg={7} xl={9}>
                    <SelectAreaPromotora />
                  </Col>
                  <Col xs={24} sm={10} md={7} lg={7} xl={10}>
                    <SelectModalidades required={false} />
                  </Col>
                  <Col span={8}>
                    <SelectPublicoAlvo required={false} />
                  </Col>
                  <Col span={8}>
                    <InputTexto
                      formItemProps={{
                        label: 'Nome da formação',
                        name: 'nomeFormacao',
                        rules: [{ required: false }],
                      }}
                      inputProps={{
                        id: CF_INPUT_NOME_FORMACAO,
                        placeholder: 'Nome da formação',
                        maxLength: 100,
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <InputNumero
                      formItemProps={{
                        label: 'Código da formação',
                        name: 'codigoFormacao',
                        rules: [{ required: false }],
                      }}
                      inputProps={{
                        id: CF_INPUT_CODIGO_FORMACAO,
                        placeholder: 'Código da formação',
                        maxLength: 100,
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={10} md={7} lg={7} xl={5}>
                    <DatePickerPeriodo />
                  </Col>

                  <Col xs={24} sm={10} md={7} lg={7} xl={9}>
                    <InputNumero
                      formItemProps={{
                        label: 'Número de homologação',
                        name: 'numeroHomologacao',
                        rules: [{ required: false }],
                      }}
                      inputProps={{
                        id: CF_INPUT_NUMERO_HOMOLOGACAO,
                        placeholder: 'Número de homologação',
                        maxLength: 100,
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={10} md={7} lg={7} xl={10}>
                    <SelectSituacaoProposta />
                  </Col>
                </Row>
              </>
            )}
          </Form.Item>
        </CardContent>
      </Form>
    </Col>
  );
};

export default ListCadastroDePropostas;
