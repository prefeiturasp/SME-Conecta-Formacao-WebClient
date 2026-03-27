import { Button, Col, DatePicker, Form, Row, TimePicker, theme } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { CF_INPUT_DATA } from '~/core/constants/ids/input';

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
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        id={`${CF_INPUT_DATA}_${name + 1}`}
                        locale={localeDatePicker}
                        onChange={onchange}
                        format={dateFormat}
                        disabledDate={disabledDate}
                        getPopupContainer={(trigger: HTMLElement) => popupContainer(trigger)}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={13}>
                    <Row key={key} wrap={false} align='top'>
                      <Form.Item
                        {...restField}
                        name={[name, 'horarios']}
                        label='Hora de início e Fim'
                        rules={[{ required: true }]}
                        style={{ width: '100%', marginRight: '8px' }}
                      >
                        <TimePicker.RangePicker
                          format='HH:mm'
                          allowClear
                          style={{ width: '100%' }}
                          onChange={onchange}
                          locale={localeDatePicker}
                          needConfirm={false}
                        />
                      </Form.Item>

                      {name === 0 ? (
                        <Button
                          type='default'
                          block
                          icon={<FaPlus />}
                          onClick={() =>
                            add({ horarios: form.getFieldValue(['datas', name, 'horarios']) })
                          }
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
