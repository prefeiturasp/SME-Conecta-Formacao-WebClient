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
      <Title
        level={3}
        style={{
          marginBottom: 12,
          fontFamily: "Roboto",
          fontWeight: 700,
          fontSize: 20,
          lineHeight: "100%",
          letterSpacing: 0
        }}
      >
        Nova inscrição
      </Title>
        <></>
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: 0,
          color: "#2E2D2D",
        }}
      >
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
            selectProps={{
              placeholder: 'Selecione'
            }}
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
              placeholder: 'Digite o título...',
              maxLength: 100,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <SelectAreaPromotora
            areaPublica
            formItemProps={{ name: 'areasPromotorasIds' }}
            selectProps={{ mode: 'multiple', placeholder: 'Selecione' }}
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
            publico={true}
            exibirTooltip={false}
            selectProps={{placeholder: 'Selecione', mode: 'multiple' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <SelectPalavrasChaves
            areaPublica
            required={false}
            exibirTooltip={false}
            formItemProps={{ name: 'palavrasChavesIds' }}
            selectProps={{ placeholder: 'Selecione' }}
          />
        </Col>  
      </Row>

      <Row gutter={[16, 16]}>      
        <Col xs={24} sm={24} md={24}>
          <Row justify='end' style={{ marginTop: 15 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              Buscar formações
            </Button>
          </Row>
        </Col>    
      </Row>
    </div>
  </>
  );
};
