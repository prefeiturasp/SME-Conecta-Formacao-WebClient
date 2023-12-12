import { Button, Card, Col, Row } from 'antd';
import { FC } from 'react';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import DatePickerPeriodo from '~/components/main/input/date-range';
import SelectPalavrasChaves from '~/components/main/input/palavras-chave';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import InputTexto from '~/components/main/text/input-text';
import SelectFormatoPublico from '~/components/public/select/formato';

const FiltroAreaPublica: FC = () => {
  return (
    <Col
      style={{
        paddingTop: '55px',
        alignItems: 'center',
        width: '120%',
      }}
    >
      <Card
        style={{
          marginLeft: '8%',
          marginRight: '3%',
          alignItems: 'center',
          border: 'none',
        }}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={7} lg={7} xl={9}>
            <SelectPublicoAlvo required={false} exibirTooltip={false} areaPublica={true} />
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
            <SelectAreaPromotora areaPublica={true} />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <DatePickerPeriodo label='Data' name='data' />
          </Col>
        </Row>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <SelectPalavrasChaves areaPublica={true} required={false} exibirTooltip={false} />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <SelectFormatoPublico />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={9}></Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Row justify='end' style={{ marginTop: 15 }}>
              <Button shape='round' type='primary' htmlType='submit'>
                Buscar formações
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default FiltroAreaPublica;
