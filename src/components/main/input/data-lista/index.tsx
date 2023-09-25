import { Button, DatePicker, Form, Space, theme } from 'antd';
import React from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import localeDayjs from 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
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
  return (
    <>
      <Space>
        <Form.Item name='dataInicial' label='Data Inicial' rules={[{ required: true }]}>
          <DatePicker locale={localeDatePicker} format={dateFormat} />
        </Form.Item>
        <Form.Item name='dataFinal' label='Data Final' rules={[{ required: false }]}>
          <DatePicker locale={localeDatePicker} format={dateFormat} />
        </Form.Item>
      </Space>
      <Form.List name='datas'>
        {(fields, { add, remove }) => {
          return (
            <div>
              <Button
                type='default'
                block
                icon={<FaPlus />}
                onClick={() => add()}
                style={{
                  fontSize: 16,
                  marginBottom: '20px',
                  width: '35px',
                }}
              />
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Space>
                    <Form.Item
                      name={[index, 'dataInicial']}
                      label='Data Inicial'
                      rules={[{ required: true }]}
                    >
                      <DatePicker locale={localeDatePicker} format={dateFormat} />
                    </Form.Item>
                    <Form.Item
                      name={[index, 'dataFinal']}
                      label='Data Final'
                      rules={[{ required: false }]}
                    >
                      <DatePicker locale={localeDatePicker} format={dateFormat} />
                    </Form.Item>
                    {fields.length >= 1 ? (
                      <FaTrashAlt
                        cursor='pointer'
                        onClick={() => remove(index)}
                        style={{
                          color: token.colorError,
                          marginLeft: '5px',
                          marginBottom: '5px',
                          marginRight: '5px',
                        }}
                      />
                    ) : null}
                  </Space>
                </div>
              ))}
            </div>
          );
        }}
      </Form.List>
    </>
  );
};

export default DatePickerMultiplos;
