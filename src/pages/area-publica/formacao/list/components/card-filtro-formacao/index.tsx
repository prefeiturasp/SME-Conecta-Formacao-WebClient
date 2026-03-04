import { Button, Col, Row, Typography } from 'antd';
import { FC } from 'react';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
import SelectFormato from '~/components/main/input/formato';
import SelectPalavrasChaves from '~/components/main/input/palavras-chave';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import InputTexto from '~/components/main/text/input-text';

const { Title, Text } = Typography;

export const CardFiltroFormacao: FC = () => {
  return (
  <>
    <style>
      {`
        .ant-form-item-label > label {
          font-weight: 600;
        }
          
      `}
    </style>

    <div style={{ marginBottom: 24 }}>
      <Title level={3}  style={{ marginBottom: 12 }}>
        Nova inscrição
      </Title>
        <></>
      <Text type="secondary" style={{ color: "#2e2d2d" }}>
        Confira quais são as formações disponíveis e realize a inscrição.
      </Text>
    </div>

    <div
      style={{
        background: '#fff',
        padding: 24,
        borderRadius: 8,
      }}
    >
      <Row gutter={[16, 16]}>  
        <Col xs={24} sm={12} md={8}>
          <SelectPublicoAlvo
            required={false}
            exibirTooltip={false}
            areaPublica
            formItemProps={{ name: 'publicosAlvosIds', rules: [] }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
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
        <Col xs={24} sm={12} md={8}>
          <SelectAreaPromotora
            areaPublica
            formItemProps={{ name: 'areasPromotorasIds' }}
            selectProps={{ mode: 'multiple' }}
          />
        </Col>      
      </Row>

      <Row gutter={[16, 16]}>  
        <Col xs={24} sm={12} md={8}>
          <DatePickerPeriodo formItemProps={{ label: 'Data', name: 'data' }} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <SelectFormato
            formItemProps={{ name: 'formatosIds', label: 'Formato', rules: [{ required: false }] }}
            selectProps={{ placeholder: 'Formato' }}
            publico={true}
            exibirTooltip={false}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <SelectPalavrasChaves
            areaPublica
            required={false}
            exibirTooltip={false}
            formItemProps={{ name: 'palavrasChavesIds' }}
          />
        </Col>  
      </Row>

      <Row gutter={[16, 16]}>      
        <Col xs={24} sm={24} md={24}>
          <Row justify='end' style={{ marginTop: 15 }}>
            <Button type='primary' htmlType='submit'>
              Buscar formações
            </Button>
          </Row>
        </Col>    
      </Row>
    </div>
  </>
  );
};
