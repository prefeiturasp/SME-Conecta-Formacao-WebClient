import { Button, Col, DatePicker, Form, Row, Space, theme } from 'antd';
import React from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import localeDayjs from 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { CF_INPUT_DATA } from '~/core/constants/ids/input';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(localeDayjs);

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(localeDayjs);
const { useToken } = theme;

const DatePickerMultiplos: React.FC = () => {
  const { token } = useToken();
  const dateFormat = 'DD/MM/YYYY';
  const initialValue = [{ data: '' }];

  return (
    <Form.List name='datas' initialValue={initialValue}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            return (
              <Space key={key}>
                <Row wrap={false} align='top'>
                  <Form.Item
                    name={[name, 'dataInicial']}
                    label='Data Inicial'
                    rules={[{ required: true }]}
                    style={{
                      width: '100%',
                      marginRight: '8px',
                    }}
                    {...restField}
                  >
                    <DatePicker
                      id={`${CF_INPUT_DATA}_${name + 1}`}
                      locale={localeDatePicker}
                      format={dateFormat}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'dataFinal']}
                    label='Data Final'
                    rules={[{ required: false }]}
                    style={{
                      width: '100%',
                      marginRight: '8px',
                    }}
                    {...restField}
                  >
                    <DatePicker
                      id={`${CF_INPUT_DATA}_${name + 1}`}
                      locale={localeDatePicker}
                      format={dateFormat}
                    />
                  </Form.Item>

                  {name === 0 ? (
                    <Button
                      type='default'
                      block
                      icon={<FaPlus />}
                      onClick={() => add()}
                      style={{
                        fontSize: 16,
                        width: '43px',
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
                        fontSize: 16,
                        width: '43px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '34px',
                      }}
                    />
                  )}
                </Row>
              </Space>
            );
          })}
        </>
      )}
    </Form.List>
  );
};

export default DatePickerMultiplos;
