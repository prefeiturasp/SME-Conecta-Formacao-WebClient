import { Button, Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';
import DatePickerPeriodo from '~/components/main/input/date-range';
import SelectAreaPromotoraPublico from '~/components/public/select/area-promotora';
import SelectFormatoPublico from '~/components/public/select/formato';
import SelectPalavrasChavesPublico from '~/components/public/select/palavra-chave';
import SelectPublicoAlvoPublico from '~/components/public/select/publico-alvo';

type FiltroAreaPublicaProps = {
  onChange: () => void;
};

const FiltroAreaPublica: FC<FiltroAreaPublicaProps> = ({ onChange }) => {
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
          //background: Colors.Neutral.LIGHT,
          marginLeft: '8%',
          marginRight: '3%',
          alignItems: 'center',
          border: 'none',
        }}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={7} lg={7} xl={9}>
            <SelectPublicoAlvoPublico
              selectProps={{ onChange: onChange }}
              required={false}
              exibirTooltip={false}
            />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Form.Item label='Título' name='titulo'>
              <Input onChange={onChange} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <SelectAreaPromotoraPublico selectProps={{ onChange: onChange }} />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <DatePickerPeriodo label='Data' name='data' changeFunction={onChange} />
          </Col>
        </Row>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <SelectPalavrasChavesPublico selectProps={{ onChange: onChange }} />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <SelectFormatoPublico selectProps={{ onChange: onChange }} />
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
