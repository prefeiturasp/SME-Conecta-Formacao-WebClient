import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FC } from 'react';
import DatePickerPeriodo from '~/components/main/input/date-range';
import { Colors } from '~/core/styles/colors';

const FiltroAreaPublica: FC = () => {
  const [form] = useForm();
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
          background: Colors.Neutral.LIGHT,
          marginLeft: '3%',
          marginRight: '3%',
          alignItems: 'center',
        }}
      >
        <Form form={form} layout='vertical' autoComplete='off' style={{ width: '100%' }}>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <Form.Item label='Publico alvo'>
                <Select />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <Form.Item label='Título'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <Form.Item label='Área Promotora'>
                <Select />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <DatePickerPeriodo label='Data' name='data' />
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <Form.Item label='Formato'>
                <Select />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <Form.Item label='Palavra chave'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}></Col>
            <Col xs={24} sm={12} md={7} lg={7} xl={5}>
              <Row justify='end' style={{ marginTop: 15 }}>
                <Button shape='round' type='primary'>
                  Buscar formações
                </Button>
              </Row>
            </Col>
          </Row>
        </Form>
      </Card>
    </Col>
  );
};

export default FiltroAreaPublica;
