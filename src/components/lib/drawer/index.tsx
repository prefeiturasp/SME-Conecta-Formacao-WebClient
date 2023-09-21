import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';

type DrawerFormularioEncontroTurmasProps = {
  openModal: boolean;
  onCloseModal: VoidFunction;
  salvarDados: VoidFunction;
};
// const stuleButtons: React.CSSProperties = {
//   float: 'right',
//   textAlign: 'center',
//   width: '180px',
//   marginTop: '2px',
//   //marginLeft: '5px',
// };
const DrawerFormularioEncontroTurmas: React.FC<DrawerFormularioEncontroTurmasProps> = ({
  openModal,
  onCloseModal,
  salvarDados,
}) => {
  const [formDrawer] = useForm();
  const [formInitialValues, setFormInitialValues] = useState<CronogramaEncontrosPaginadoDto[]>();
  const obterDadosForm = () => {
    salvarDados();
    console.log(formDrawer.getFieldsValue());
  };
  return (
    <>
      {openModal ? (
        <>
          {openModal ? (
            <>
              <Drawer
                title='Encontro de turmas'
                width={720}
                onClose={onCloseModal}
                open
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                  <Space>
                    <Button onClick={onCloseModal}>Cancelar</Button>
                    <Button onClick={obterDadosForm} type='primary'>
                      Salvar
                    </Button>
                  </Space>
                }
              >
                <Form
                  form={formDrawer}
                  layout='vertical'
                  autoComplete='off'
                  initialValues={formInitialValues}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name='turma'
                        label='Turma'
                        rules={[{ required: true, message: 'Informe a turma' }]}
                      >
                        <Select placeholder='Informe a turma' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name='data'
                        label='Data'
                        rules={[{ required: true, message: 'Informe a data' }]}
                      >
                        <Input placeholder='Informe a data' />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name='hora'
                        label='Hora'
                        rules={[{ required: true, message: 'Informe a Hora' }]}
                      >
                        <Input placeholder='Informe a Hora' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name='tipoEncontro'
                        label='Tipo de Encontro'
                        rules={[{ required: true, message: 'Informe o Tipo de encontro' }]}
                      >
                        <Select placeholder='Informe o Tipo de encontro' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Drawer>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DrawerFormularioEncontroTurmas;
