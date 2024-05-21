import { Col, Form, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useContext } from 'react';
import InputTimer from '~/components/lib/inputs/timer';
import { getTooltipFormInfoCircleFilled } from '~/components/main/tooltip';
import { CARGA_HORARIA_PRESENCIAL_NAO_INFORMADA } from '~/core/constants/mensagens';
import { Formato } from '~/core/enum/formato';
import { SelectCargaHorariaTotal } from './components/select-carga-horaria-total/select-carga-horaria-total';
import { PropostaCargaHorariaTotalContext } from './provider';

export const CamposCargaHoraria = () => {
  const formInstance = useFormInstance();
  const modalidade: Formato = formInstance.getFieldValue('formato');

  const { naoPresencialEhMaiorQueDezPorcento } = useContext(PropostaCargaHorariaTotalContext);

  const dependencies = ['cargaHorariaTotal', 'cargaHorariaTotalOutros'];

  return (
    <Col xs={24}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item shouldUpdate style={{ margin: 0 }}>
            {() => {
              return (
                <InputTimer
                  key='cargaHorariaPresencial'
                  campo='cargaHorariaPresencial'
                  mensagemErro={CARGA_HORARIA_PRESENCIAL_NAO_INFORMADA}
                  formItemProps={{
                    dependencies,
                    name: 'cargaHorariaPresencial',
                    label: 'Carga horária presencial',
                    tooltip: getTooltipFormInfoCircleFilled(
                      'No caso de cursos a distância com opções de aulas presenciais (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade.',
                    ),
                  }}
                />
              );
            }}
          </Form.Item>
        </Col>
        {modalidade === Formato.Presencial && (
          <Col xs={24} sm={12}>
            <Form.Item shouldUpdate style={{ margin: 0 }}>
              <InputTimer
                key='cargaHorariaNaoPresencial'
                campo='cargaHorariaNaoPresencial'
                formItemProps={{
                  dependencies,
                  name: 'cargaHorariaNaoPresencial',
                  label: 'Carga horária não presencial',
                  tooltip: getTooltipFormInfoCircleFilled(
                    'Para os cursos presenciais, se houver atividades não presenciais pode ser informado no máximo 10% da carga horária total',
                  ),
                  rules: [
                    {
                      validator() {
                        if (naoPresencialEhMaiorQueDezPorcento) {
                          return Promise.reject('Só é permitido até 10% da carga horária total');
                        }

                        return Promise.resolve();
                      },
                    },
                  ],
                }}
              />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} sm={12}>
          <InputTimer
            key='cargaHorariaSincrona'
            campo='cargaHorariaSincrona'
            formItemProps={{
              dependencies,
              name: 'cargaHorariaSincrona',
              label: 'Carga horária aulas síncronas',
              tooltip: getTooltipFormInfoCircleFilled(
                'No caso de cursos a distância com opções de aulas síncronas (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade',
              ),
            }}
          />
        </Col>
        <Col xs={24} sm={12}>
          <InputTimer
            key='cargaHorariaDistancia'
            campo='cargaHorariaDistancia'
            formItemProps={{
              dependencies,
              name: 'cargaHorariaDistancia',
              label: 'Carga horária a distância',
              tooltip: getTooltipFormInfoCircleFilled(
                'Para os cursos presenciais, se houver atividades não presenciais (máximo de 10% da carga horária total), indicar neste campo. Para os cursos a distância indicar a carga horária relativa as aulas assíncronas',
              ),
            }}
          />
        </Col>
        <Col xs={24} sm={12}>
          <SelectCargaHorariaTotal />
        </Col>
      </Row>
    </Col>
  );
};
