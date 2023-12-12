import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import DatePickerPeriodo from '~/components/main/input/date-range';
import { Colors } from '~/core/styles/colors';

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
          //background: Colors.Neutral.LIGHT,
          marginLeft: '8%',
          marginRight: '3%',
          alignItems: 'center',
          border: 'none',
        }}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Form.Item label='Publico alvo' name='publico-alvo'>
              <Select />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Form.Item label='Título' name='titulo'>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Form.Item label='Área Promotora' name='area-promotora'>
              <Select />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <DatePickerPeriodo label='Data' name='data' />
          </Col>
        </Row>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Form.Item label='Formato' name='formato'>
              <Select />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}>
            <Form.Item label='Palavra chave' name='palavra-chave'>
              <Select />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={7} lg={7} xl={5}></Col>
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
