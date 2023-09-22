import { Button, Col, Drawer, Form, Input, Row, TimePicker, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import SelectTipoEncontro from '~/components/main/input/tipo-encontro';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import DataLista from '~/components/main/input/data-lista';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import locale from 'dayjs/locale/pt-br';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
type DrawerFormularioEncontroTurmasProps = {
  openModal: boolean;
  onCloseModal: VoidFunction;
  salvarDados: VoidFunction;
  idProposta: number;
};
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(locale);
const format = 'HH:mm';
const DrawerFormularioEncontroTurmas: React.FC<DrawerFormularioEncontroTurmasProps> = ({
  openModal,
  onCloseModal,
  salvarDados,
  idProposta,
}) => {
  const { RangePicker } = TimePicker;
  const [formDrawer] = useForm();
  const { TextArea } = Input;
  //  const [formInitialValues, setFormInitialValues] = useState<CronogramaEncontrosPaginadoDto>();
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
                      <DataLista />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name='horaInicio'
                        label='Hora de início e Fim'
                        rules={[{ required: true, message: 'Informe a Hora de início e Fim' }]}
                      >
                        <RangePicker
                          format={format}
                          allowClear
                          style={{ width: '328px' }}
                          locale={localeDatePicker}
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
