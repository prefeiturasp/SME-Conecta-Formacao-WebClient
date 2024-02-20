import { Button, Col, Row } from 'antd';
import { FC } from 'react';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
import SelectFormato from '~/components/main/input/formato';
import SelectPalavrasChaves from '~/components/main/input/palavras-chave';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import InputTexto from '~/components/main/text/input-text';

export const CardFiltroFormacao: FC = () => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={12} md={7} lg={7} xl={9}>
        <SelectPublicoAlvo
          required={false}
          exibirTooltip={false}
          areaPublica
          formItemProps={{ name: 'publicosAlvosIds', rules: [] }}
        />
      </Col>
      <Col xs={24} sm={12} md={7} lg={7} xl={5}>
        <InputTexto
          formItemProps={{
            label: 'Título',
            name: 'titulo',
            rules: [{ required: false }],
          }}
          inputProps={{
            placeholder: 'Título',
            maxLength: 100,
          }}
        />
      </Col>
      <Col xs={24} sm={12} md={7} lg={7} xl={5}>
        <SelectAreaPromotora
          areaPublica
          formItemProps={{ name: 'areasPromotorasIds' }}
          setAreaPromotoraCarregada={() => {
            ('');
          }}
          selectProps={{ mode: 'multiple' }}
        />
      </Col>
      <Col xs={24} sm={12} md={7} lg={7} xl={5}>
        <DatePickerPeriodo formItemProps={{ label: 'Data', name: 'data' }} />
      </Col>
      <Col xs={24} sm={12} md={7} lg={7} xl={5}>
        <SelectFormato
          formItemProps={{ name: 'formatosIds', label: 'Formato', rules: [{ required: false }] }}
          selectProps={{ placeholder: 'Formato' }}
          publico={true}
          exibirTooltip={false}
        />
      </Col>
      <Col xs={24} sm={12} md={7} lg={7} xl={5}>
        <SelectPalavrasChaves
          areaPublica
          required={false}
          exibirTooltip={false}
          formItemProps={{ name: 'palavrasChavesIds' }}
        />
      </Col>
      <Col xs={24} sm={12} md={14}>
        <Row justify='end' style={{ marginTop: 15 }}>
          <Button shape='round' type='primary' htmlType='submit'>
            Buscar formações
          </Button>
        </Row>
      </Col>
    </Row>
  );
};
