import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormItemProps, Input, InputProps, Row } from 'antd';
import React from 'react';
import { Colors } from '~/core/styles/colors';

type InputTelefoneProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputTelefone: React.FC<InputTelefoneProps> = ({ inputProps, formItemProps }) => {
  // const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

  // const maskTelefone = (value: string | number | undefined) =>
  //   `${value}`.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');

  // const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = removerTudoQueNaoEhDigito(e?.target?.value);
  //   return value ? maskTelefone(value) : value;
  // };

  const rules = [
    { required: true },
    {
      message:
        'Telefone inválido, você deve digitar o DDD com dois dígitos e o telefone com 8 ou 9 dígitos',
      validator: (_: any, value: any) => {
        if (!value) return Promise.resolve();

        const regex = /(?=\s(9)).*/;
        const comecaComNove = regex.test(value);

        const ehCelular = comecaComNove && value?.length === 15;
        const ehTelefone = !comecaComNove && value?.length === 14;

        if (ehCelular || ehTelefone) return Promise.resolve();

        return Promise.reject();
      },
    },
  ];

  return (
    <Form.List name='telefones'>
      {(fields, { add, remove }) => (
        <>
          <Row align='middle'>
            <Col flex={2}>
              <Form.Item label='Telefone' name='telefone' rules={rules} {...formItemProps}>
                <Input placeholder='(XX) XXXXX-XXXX' maxLength={15} {...inputProps} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0  0 0 8px' }}
              >
                <Button onClick={() => add()} icon={<PlusOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          {fields.map((field, index) => (
            <Form.Item
              required={false}
              key={field.key}
              label={`Telefone ${index + 2}`}
              name={`telefone ${index + 2}`}
            >
              <Row align='middle'>
                <Col flex={2}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={rules}
                    noStyle
                    {...formItemProps}
                  >
                    <Input placeholder='(XX) XXXXX-XXXX' maxLength={15} {...inputProps} />
                  </Form.Item>
                </Col>
                <Col>
                  {fields.length > 0 ? (
                    <DeleteFilled
                      onClick={() => remove(field.name)}
                      style={{
                        color: Colors.ERROR,
                        margin: '0  0 0 8px',
                      }}
                    />
                  ) : null}
                </Col>
              </Row>
            </Form.Item>
          ))}
        </>
      )}
    </Form.List>
  );
};

export default InputTelefone;
