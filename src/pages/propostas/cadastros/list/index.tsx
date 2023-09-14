import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import DatePickerPeriodo from '~/components/main/input/date-range';
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
import { PropostaPaginadaDTO } from '~/core/dto/proposta-paginada-dto';
import { FormacaoHomologada } from '~/core/enum/formacao-homologada';
import { ROUTES } from '~/core/enum/routes-enum';
const ListCadastroDePropostas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [formInitialValues, setFormInitialValues] = useState<PropostaFormListDTO>();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);
  const onClickNovo = () => navigate(ROUTES.CADASTRO_DE_PROPOSTAS_NOVO);
  const url = 'v1/Proposta';
  const [filters, setFilters] = useState({
    areaPromotoraId: null,
    modalidade: null,
    nomeFormacao: null,
    id: null,
    publicoAlvoIds: null,
    numeroHomologacao: null,
    periodoRealizacaoInicio: null,
    periodoRealizacaoFim: null,
    situacao: null,
  });
  const columns: ColumnsType<PropostaPaginadaDTO> = [
    {
      key: 'tipoFormacao',
      title: 'Tipo Formação',
      dataIndex: 'tipoFormacao',
    },
    {
      key: 'areaPromotora',
      title: 'Área promotora',
      dataIndex: 'areaPromotora',
    },
    {
      key: 'modalidade',
      title: 'Modalidade',
      dataIndex: 'modalidade',
    },
    {
      key: 'id',
      title: 'Código da formação',
      dataIndex: 'id',
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
    },
    {
      key: 'numeroHomologacao',
      title: 'Número de homologação',
      dataIndex: 'numeroHomologacao',
    },
    {
      key: 'periodoRealizacaoInicio',
      title: 'Início',
      dataIndex: 'periodoRealizacaoInicio',
    },
    {
      key: 'periodoRealizacaoFim',
      title: 'Fim',
      dataIndex: 'periodoRealizacaoFim',
    },
    {
      key: 'situacao',
      title: 'Situação',
      dataIndex: 'situacao',
    },
  ];
  const obterFiltros = () => {
    const dataInicio =
      form?.getFieldValue('periodoRealizacao') != undefined
        ? form?.getFieldValue('periodoRealizacao')[0]
        : null;
    const dataFim =
      form?.getFieldValue('periodoRealizacao') != undefined
        ? form?.getFieldValue('periodoRealizacao')[1]
        : null;

    setFilters({
      numeroHomologacao: form.getFieldValue('numeroHomologacao'),
      areaPromotoraId: form.getFieldValue('areaPromotora'),
      modalidade: form.getFieldValue('modalidade'),
      nomeFormacao: form.getFieldValue('nomeFormacao'),
      id: form.getFieldValue('codigoFormacao'),
      periodoRealizacaoInicio: dataInicio,
      publicoAlvoIds: form.getFieldValue('publicosAlvo'),
      periodoRealizacaoFim: dataFim,
      situacao: form.getFieldValue('situacaoProposta'),
    });
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
                onClick={() => onClickNovo()}
                style={{ fontWeight: 700 }}
              >
                {'Novo'}
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off' initialValues={formInitialValues}>
        <CardContent>
          <Form.Item shouldUpdate>
            {() => (
              <>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={10} md={7} lg={7} xl={12}>
                    <b>
                      <SelectAreaPromotora selectProps={{ onChange: obterFiltros }} />
                    </b>
                  </Col>
                  <Col xs={24} sm={10} md={7} lg={7} xl={12}>
                    <b>
                      <SelectModalidades
                        selectProps={{ onChange: obterFiltros }}
                        required={false}
                        form={form}
                        exibirTooltip={false}
                      />
                    </b>
                  </Col>
                  <Col span={8}>
                    <b>
                      <SelectPublicoAlvo
                        selectProps={{ onChange: obterFiltros }}
                        required={false}
                        exibirTooltip={false}
                      />
                    </b>
                  </Col>
                  <Col span={8}>
                    <b>
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
                          onChange: obterFiltros,
                        }}
                      />
                    </b>
                  </Col>
                  <Col span={8}>
                    <b>
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
                          onChange: obterFiltros,
                        }}
                      />
                    </b>
                  </Col>
                </Row>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={10} md={7} lg={7} xl={5}>
                    <b>
                      <DatePickerPeriodo changeFunction={obterFiltros} />
                    </b>
                  </Col>

                  <Col xs={24} sm={10} md={7} lg={7} xl={9}>
                    <b>
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
                          onChange: obterFiltros,
                        }}
                      />
                    </b>
                  </Col>
                  <Col xs={24} sm={10} md={7} lg={7} xl={10}>
                    <b>
                      <SelectSituacaoProposta selectProps={{ onChange: obterFiltros }} />
                    </b>
                  </Col>
                  <Col span={24}>
                    <DataTable filters={filters} url={url} columns={columns} />
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
