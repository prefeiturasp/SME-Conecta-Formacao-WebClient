import { Button, Col, Form, Row, theme } from 'antd';
import React from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import localeDayjs from 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { EncontroTurmaDatasDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { CF_INPUT_DATA } from '~/core/constants/ids/input';
import DatePickerPeriodo from '../date-range';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(localeDayjs);
const { useToken } = theme;
const DataLista: React.FC = () => {
  const { token } = useToken();

  const initialValue: EncontroTurmaDatasDto[] = [{ dataEncontro: new Date() }];

  return (
    <Form.List name='datas' initialValue={initialValue}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }) => {
            const idData = `${CF_INPUT_DATA}_${name + 1}`;
            const nameData = `dataEncontro_${name + 1}`;
            return (
              <Col xs={24} sm={24} key={key}>
                <Row wrap={false} align='top'>
                  <DatePickerPeriodo label='Data' name={nameData} id={idData} />
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
                        marginLeft: '14px',
                        marginTop: '24px',
                        marginBottom: '14px',
                      }}
                    />
                  ) : (
                    <FaTrashAlt
                      cursor='pointer'
                      onClick={() => remove(name)}
                      style={{
                        color: token.colorError,
                        marginLeft: '27px',
                        marginTop: '34px',
                        marginRight: '10px',
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

export default DataLista;
