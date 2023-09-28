import { Button, DatePicker, Form, Row, Space, theme } from 'antd';
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

const { useToken } = theme;

type Thiago = {
  disabledDate: any;
};
const DatePickerMultiplos: React.FC<Thiago> = ({ disabledDate }) => {
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
                      disabledDate={disabledDate}
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
                      disabledDate={disabledDate}
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
                        marginTop: '37px',
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
                        marginTop: '47px',
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
