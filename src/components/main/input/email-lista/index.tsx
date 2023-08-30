import { Button, Col, Form, Row, theme } from 'antd';
import React from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { CF_INPUT_EMAIL } from '~/core/constants/ids/input';
import { EmailAreaPromotora } from '~/core/dto/area-promotora-dto';
import InputEmail from '../email';

const { useToken } = theme;

const EmailLista: React.FC = () => {
  const { token } = useToken();

  const initialValue: EmailAreaPromotora[] = [{ email: '' }];

  return (
    <Form.List name='emails' initialValue={initialValue}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            return (
              <Col xs={24} sm={12} key={key}>
                <Row wrap={false} align='top'>
                  <InputEmail
                    inputProps={{
                      id: `${CF_INPUT_EMAIL}_${name + 1}`,
                    }}
                    formItemProps={{
                      ...restField,
                      name: [name, 'email'],
                      style: { width: '100%', marginRight: '8px' },
                      required: false,
                    }}
                  />
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
                        margin: '34px 20px 0px 3px',
                      }}
                    />
                  )}
                </Row>
              </Col>
            );
          })}
        </>
      )}
    </Form.List>
  );
};

export default EmailLista;
