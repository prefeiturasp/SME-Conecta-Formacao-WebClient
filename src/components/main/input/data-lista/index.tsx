import { Button, Col, DatePicker, Form, Row, theme } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { CF_INPUT_DATA } from '~/core/constants/ids/input';
import { Dayjs } from '~/core/date/dayjs';
import { DataEncontro } from '~/core/dto/formulario-drawer-encontro-dto';

const { useToken } = theme;

type DatePickerMultiplosProps = {
  disabledDate: any;
  onchange: VoidFunction;
};
const DatePickerMultiplos: React.FC<DatePickerMultiplosProps> = ({ disabledDate, onchange }) => {
  const { token } = useToken();
  const form = useFormInstance();
  const dateFormat = 'DD/MM/YYYY';
  const datasWatch = Form.useWatch('datas');

  const validarDataInicioFim = (mensagem: string, dataInicio?: Dayjs, dataFim?: Dayjs) => {
    let dataInicioMaiorQueFim = false;

    if (dataInicio && dataFim && dataInicio.isValid() && dataFim.isValid()) {
      dataInicioMaiorQueFim = dataInicio.isAfter(dataFim, 'day');
    }

    return dataInicioMaiorQueFim ? Promise.reject(mensagem) : Promise.resolve();
  };

  const popupContainer = (trigger: HTMLElement) => {
    return trigger.parentNode as HTMLElement;
  };

  useEffect(() => {
    if (form.isFieldTouched('datas')) {
      form.validateFields({ dirty: true });
    }
  }, [datasWatch]);

  return (
    <Form.List name='datas'>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            return (
              <Col xs={24} key={key}>
                <Row key={key} wrap={false} align='top' gutter={[16, 8]}>
                  <Col xs={11}>
                    <Form.Item
                      {...restField}
                      name={[name, 'dataInicio']}
                      label='Data Inicial'
                      rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                          validator() {
                            const datas: DataEncontro[] = getFieldValue('datas');
                            const dataInicio = datas[name]?.dataInicio;
                            const dataFim = datas[name]?.dataFim;

                            return validarDataInicioFim(
                              'Data inicial não pode ser maior que data final',
                              dataInicio,
                              dataFim,
                            );
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        id={`${CF_INPUT_DATA}_${name + 1}`}
                        locale={localeDatePicker}
                        onChange={onchange}
                        format={dateFormat}
                        disabledDate={disabledDate}
                        getPopupContainer={(trigger: HTMLElement) => popupContainer(trigger)}
                        style={{
                          width: '100%',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={13}>
                    <Row key={key} wrap={false} align='top'>
                      <Form.Item
                        {...restField}
                        name={[name, 'dataFim']}
                        label='Data Final'
                        style={{
                          width: '100%',
                          marginRight: '8px',
                        }}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator() {
                              const datas: DataEncontro[] = getFieldValue('datas');
                              const dataInicio = datas[name]?.dataInicio;
                              const dataFim = datas[name]?.dataFim;

                              return validarDataInicioFim(
                                'Data final não pode ser menor que data inicial',
                                dataInicio,
                                dataFim,
                              );
                            },
                          }),
                        ]}
                      >
                        <DatePicker
                          id={`${CF_INPUT_DATA}_${name + 1}`}
                          locale={localeDatePicker}
                          format={dateFormat}
                          disabledDate={disabledDate}
                          getPopupContainer={(trigger: HTMLElement) => popupContainer(trigger)}
                          style={{
                            width: '100%',
                          }}
                        />
                      </Form.Item>

                      {name === 0 ? (
                        <Button
                          type='default'
                          block
                          icon={<FaPlus />}
                          onClick={() => add()}
                          style={{
                            fontSize: 18,
                            width: '83px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '24px',
                          }}
                        />
                      ) : (
                        <FaTrashAlt
                          cursor='pointer'
                          onClick={() => remove(name)}
                          style={{
                            color: token.colorError,
                            fontSize: 18,
                            width: '83px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '24px',
                          }}
                        />
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </>
      )}
    </Form.List>
  );
};

export default DatePickerMultiplos;
