import { Button, Col, Drawer, Form, Input, Row, TimePicker, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import SelectTipoEncontro from '~/components/main/input/tipo-encontro';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import locale from 'antd/es/date-picker/locale/pt_BR';
type DrawerFormularioEncontroTurmasProps = {
  openModal: boolean;
  onCloseModal: VoidFunction;
  salvarDados: VoidFunction;
  idProposta: number;
};
const format = 'HH:mm';
const DrawerFormularioEncontroTurmas: React.FC<DrawerFormularioEncontroTurmasProps> = ({
  openModal,
  onCloseModal,
  salvarDados,
  idProposta,
}) => {
  const [formDrawer] = useForm();
  const { TextArea } = Input;
  const [formInitialValues, setFormInitialValues] = useState<CronogramaEncontrosPaginadoDto>();
  const obterDadosForm = () => {
    formDrawer.submit();
    console.log(formDrawer.getFieldsValue());
    // salvarDados();
    // console.log(formDrawer.getFieldsValue());
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
                <Form form={formDrawer} layout='vertical' autoComplete='off'>
                  <Row gutter={16}>
                    <Col span={12}>
                      <SelectTurmaEncontros idProposta={idProposta} />
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
                        <TimePicker
                          format={format}
                          placeholder='Informe a Hora'
                          allowClear
                          style={{ width: '328px' }}
                          locale={{
                            ...locale,
                            lang: {
                              ...locale.lang,
                              now: 'Hora Atual',
                              ok: 'OK',
                            },
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <SelectTipoEncontro />
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label='Local'
                        name='local'
                        rules={[{ required: true, message: 'Informe o local' }]}
                      >
                        <TextArea
                          maxLength={200}
                          minLength={1}
                          showCount
                          placeholder='Informe o Local'
                        />
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
