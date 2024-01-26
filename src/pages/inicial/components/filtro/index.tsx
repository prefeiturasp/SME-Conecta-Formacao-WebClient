import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
import SelectFormato from '~/components/main/input/formato';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import SelectSituacaoProposta from '~/components/main/input/situacao-proposta';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { useAppSelector } from '~/core/hooks/use-redux';
import { obterAreaPromotoraLista } from '~/core/services/area-promotora-service';
import { ListaCardsPropostas } from '../lista-cards/inde';

export type FilterStateLocationProps = {
  areaPromotoraId: number | null;
  formato: number | null;
  nomeFormacao: string | null;
  id: number | null;
  publicoAlvoIds: number[] | null;
  numeroHomologacao: number | null;
  periodoRealizacaoInicio: string | null;
  periodoRealizacaoFim: string | null;
  situacao: number | null;
};

export const FiltroPaginaInicial: React.FC = () => {
  const [form] = useForm();

  const areaPromotora = useAppSelector((state) => state.perfil.perfilSelecionado?.perfilNome);

  const [filters, setFilters] = useState<FilterStateLocationProps>({
    areaPromotoraId: null,
    formato: null,
    nomeFormacao: null,
    id: null,
    publicoAlvoIds: null,
    numeroHomologacao: null,
    periodoRealizacaoInicio: null,
    periodoRealizacaoFim: null,
    situacao: null,
  });

  const obterFiltros = useCallback(() => {
    setFilters({
      numeroHomologacao: form.getFieldValue('numeroHomologacao'),
      areaPromotoraId: form.getFieldValue('areaPromotoraId'),
      formato: form.getFieldValue('formato'),
      nomeFormacao: form.getFieldValue('nomeFormacao'),
      id: form.getFieldValue('codigoFormacao'),
      periodoRealizacaoInicio: dayjs(form?.getFieldValue('periodoRealizacao')?.[0]).format(
        'YYYY/MM/DD',
      ),
      publicoAlvoIds: form.getFieldValue('publicosAlvo'),
      periodoRealizacaoFim: dayjs(form?.getFieldValue('periodoRealizacao')?.[1]).format(
        'YYYY/MM/DD',
      ),
      situacao: form.getFieldValue('situacaoProposta'),
    });
  }, [form]);

  const camposFiltroJSX = () => {
    const styleFormLabel = { fontWeight: 'bold' };
    return (
      <>
        <Col xs={24} md={12} lg={8}>
          <SelectAreaPromotora
            formItemProps={{ name: 'areaPromotoraId', style: styleFormLabel }}
            selectProps={{ onChange: obterFiltros, disabled: !!areaPromotora }}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <SelectFormato
            formItemProps={{ rules: [{ required: false }], style: styleFormLabel }}
            selectProps={{ onChange: obterFiltros }}
            exibirTooltip={false}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <SelectPublicoAlvo
            selectProps={{ onChange: obterFiltros }}
            formItemProps={{ required: false, style: styleFormLabel }}
            exibirTooltip={false}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <InputTexto
            formItemProps={{
              label: 'Nome da formação',
              name: 'nomeFormacao',
              rules: [{ required: false }],
              style: styleFormLabel,
            }}
            inputProps={{
              id: CF_INPUT_NOME_FORMACAO,
              placeholder: 'Nome da formação',
              maxLength: 100,
              onChange: obterFiltros,
            }}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <InputNumero
            formItemProps={{
              label: 'Código da formação',
              name: 'codigoFormacao',
              rules: [{ required: false }],
              style: styleFormLabel,
            }}
            inputProps={{
              id: CF_INPUT_CODIGO_FORMACAO,
              placeholder: 'Código da formação',
              maxLength: 100,
              onChange: obterFiltros,
            }}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <InputNumero
            formItemProps={{
              label: 'Número de homologação',
              name: 'numeroHomologacao',
              rules: [{ required: false }],
              style: styleFormLabel,
            }}
            inputProps={{
              id: CF_INPUT_NUMERO_HOMOLOGACAO,
              placeholder: 'Número de homologação',
              maxLength: 100,
              onChange: obterFiltros,
            }}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <DatePickerPeriodo
            formItemProps={{
              style: styleFormLabel,
              label: 'Período de realização',
              name: 'periodoRealizacao',
            }}
            rangerPickerProps={{ onChange: obterFiltros }}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <SelectSituacaoProposta
            selectProps={{ onChange: obterFiltros }}
            formItemProps={{ style: styleFormLabel }}
          />
        </Col>
      </>
    );
  };

  useEffect(() => {
    if (areaPromotora) {
      obterAreaPromotoraLista().then((resposta) => {
        if (resposta.sucesso) {
          const areaPromotoraId = resposta.dados.filter((item) => item.descricao === areaPromotora);
          const descricaoAreaPromotora = areaPromotoraId.find((item) => item.descricao);

          form.setFieldValue('areaPromotoraId', descricaoAreaPromotora?.id);

          setFilters({
            ...filters,
            areaPromotoraId: form.getFieldValue('areaPromotoraId'),
          });
        }
      });
    }
  }, []);

  return (
    <Col>
      <HeaderPage title='Acompanhamento de propostas formativas' />
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Form.Item shouldUpdate>
            {() => (
              <Row gutter={[16, 8]}>
                {camposFiltroJSX()}
                <ListaCardsPropostas filters={filters} />
              </Row>
            )}
          </Form.Item>
        </CardContent>
      </Form>
    </Col>
  );
};
