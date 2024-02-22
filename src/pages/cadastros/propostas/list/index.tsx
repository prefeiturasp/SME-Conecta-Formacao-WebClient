import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
import SelectFormato from '~/components/main/input/formato';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import SelectSituacaoProposta from '~/components/main/input/situacao-proposta';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { PropostaFiltrosDTO } from '~/core/dto/proposta-filtro-dto';
import { PropostaFormListDTO } from '~/core/dto/proposta-from-list-dto';
import { PropostaPaginadaDTO } from '~/core/dto/proposta-paginada-dto';
import { FormacaoHomologada } from '~/core/enum/formacao-homologada';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';

type FilterStateProps = {
  filters: PropostaFiltrosDTO;
};

const ListCadastroDePropostas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const permissao = obterPermissaoPorMenu(MenuEnum.CadastroProposta);

  const [formInitialValues, setFormInitialValues] = useState<PropostaFormListDTO>();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);
  const onClickNovo = () => navigate(ROUTES.CADASTRO_DE_PROPOSTAS_NOVO);

  const url = 'v1/Proposta';
  const filtersLocationState: FilterStateProps = location.state;
  const filtroDaURL = filtersLocationState?.filters;

  const [filters, setFilters] = useState<PropostaFiltrosDTO>(
    filtroDaURL ?? {
      areaPromotoraId: null,
      formato: null,
      nomeFormacao: null,
      id: null,
      publicoAlvoIds: null,
      numeroHomologacao: null,
      periodoRealizacaoInicio: null,
      periodoRealizacaoFim: null,
      situacao: null,
    },
  );

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
      key: 'formato',
      title: 'Formato',
      dataIndex: 'formato',
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
      key: 'dataRealizacaoInicio',
      title: 'Início',
      dataIndex: 'dataRealizacaoInicio',
    },
    {
      key: 'dataRealizacaoFim',
      title: 'Fim',
      dataIndex: 'dataRealizacaoFim',
    },
    {
      key: 'situacao',
      title: 'Situação',
      dataIndex: 'situacao',
    },
  ];

  const onClickEditar = (id: number) =>
    navigate(`${ROUTES.CADASTRO_DE_PROPOSTAS}/editar/${id}`, { replace: true });

  const obterFiltros = useCallback(() => {
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
      areaPromotoraId: form.getFieldValue('areaPromotoraId'),
      formato: form.getFieldValue('formato'),
      nomeFormacao: form.getFieldValue('nomeFormacao'),
      id: form.getFieldValue('codigoFormacao'),
      periodoRealizacaoInicio: dataInicio,
      publicoAlvoIds: form.getFieldValue('publicosAlvo'),
      periodoRealizacaoFim: dataFim,
      situacao: form.getFieldValue('situacao'),
    });
  }, [filters]);

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

  useEffect(() => {
    if (filtroDaURL) {
      let periodoRealizacao: Dayjs[] | null;
      const {
        areaPromotoraId,
        formato,
        id,
        nomeFormacao,
        numeroHomologacao,
        publicoAlvoIds,
        situacao,
        periodoRealizacaoFim,
        periodoRealizacaoInicio,
      } = filtroDaURL;

      if (periodoRealizacaoInicio && periodoRealizacaoFim) {
        periodoRealizacao = [dayjs(periodoRealizacaoInicio), dayjs(periodoRealizacaoFim)];
      } else {
        periodoRealizacao = null;
      }

      form.setFieldsValue({
        formato,
        areaPromotoraId,
        nomeFormacao,
        numeroHomologacao,
        codigoFormacao: id,
        situacao,
        publicoAlvoIds,
        periodoRealizacao,
      });
    }
  }, [filtersLocationState]);

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
                disabled={!permissao.podeIncluir}
                onClick={() => onClickNovo()}
                style={{ fontWeight: 700 }}
              >
                Novo
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
                      <SelectAreaPromotora
                        formItemProps={{ name: 'areaPromotoraId' }}
                        selectProps={{ onChange: obterFiltros }}
                      />
                    </b>
                  </Col>
                  <Col xs={24} sm={10} md={7} lg={7} xl={12}>
                    <b>
                      <SelectFormato
                        formItemProps={{ rules: [{ required: false }] }}
                        selectProps={{ onChange: obterFiltros }}
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
                      <DatePickerPeriodo
                        formItemProps={{
                          label: 'Período de realização',
                          name: 'periodoRealizacao',
                        }}
                        rangerPickerProps={{ onChange: obterFiltros }}
                      />
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
                    <DataTable
                      url={url}
                      filters={filters}
                      columns={columns}
                      onRow={(row) => ({
                        onClick: () => {
                          onClickEditar(row.id);
                        },
                      })}
                    />
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
