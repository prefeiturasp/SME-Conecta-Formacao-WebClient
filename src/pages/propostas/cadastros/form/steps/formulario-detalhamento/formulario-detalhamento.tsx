import { Col, Form, Row } from 'antd';
import React from 'react';
import CollapsePanelSME from '~/components/lib/collapse';
import InputTimer from '~/components/lib/inputs/timer';
import EditorTexto from '~/components/main/input/editor-texto';
import SelectPalavrasChaves from '~/components/main/input/palacras-chave';
import { Modalidade } from '~/core/enum/modalidade';
import InputTimerCargaHorariaTotal from './components/carga-horaria-total';

interface FormularioDetalhamentoProps {
  disabledForm: boolean;
}

const FormularioDetalhamento: React.FC<FormularioDetalhamentoProps> = ({ disabledForm }) => {
  const collapsesComEditorDeTexto = [
    {
      key: 'justificativa',
      header: 'Justificativa',
      defaultActiveKey: 'justificativa',
      textoTooltip:
        'Por que esta formação foi planejada? Por que ela é necessária? Qual o diagnóstico da realidade ou necessidade de aprofundamento no tema?',
    },
    {
      key: 'objetivos',
      header: 'Objetivos',
      defaultActiveKey: 'objetivos',
      textoTooltip:
        ' Quais objetivos serão atingidos considerando o público-alvo proposto? Para que serão desenvolvidos os conteúdos e as metodologias? O que se espera que os profissionais aprendam / modifiquem?',
    },
    {
      key: 'conteudoProgramatico',
      header: 'Conteúdo Programático',
      defaultActiveKey: 'conteudoProgramatico',
      textoTooltip:
        'O conteúdo programático deve estar alinhado a um ou mais princípios do Edital NTF 2023. Indique o que será desenvolvido como conteúdo da formação.',
    },
    {
      key: 'procedimentoMetadologico',
      header: 'Procedimentos metodológicos',
      defaultActiveKey: 'procedimentoMetadologico',
      textoTooltip:
        'Quais estratégias de formação serão utilizadas para abordar os conteúdos e alcançar os objetivos? Os procedimentos metodológicos devem favorecer a relação entre a teoria e a prática profissional.',
    },
    {
      key: 'referencia',
      header: 'Referências',
      defaultActiveKey: 'referencia',
      textoTooltip: `Quais são os referenciais indicados e de onde foi extraído o conteúdo? Quais publicações da SME subsidiam esta proposta de formação?
      Referências, que não serão abordadas diretamente na ação formativa, podem ser indicadas como “referências bibliográficas complementares” ou “sugestões bibliográficas” para estímulo a outras leituras dos cursistas.
      Referenciais bibliográficos em língua estrangeira, preferencialmente, devem ser disponibilizados com tradução para a Língua Portuguesa.`,
    },
  ];

  return (
    <>
      <CollapsePanelSME
        panelProps={{ header: 'Carga horária', key: 'cargaHoraria' }}
        collapseProps={{ defaultActiveKey: 'cargaHoraria' }}
      >
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item shouldUpdate style={{ margin: 0 }}>
                {(form) => {
                  const valor: Modalidade = form.getFieldValue('modalidade');
                  const requerido = valor === Modalidade.Presencial;

                  return (
                    <InputTimer
                      label='Carga horária presencial'
                      nome='cargaHorariaPresencial'
                      textToolTip='No caso de cursos a distância com opções de aulas presenciais (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade.'
                      key='cargaHorariaPresencial'
                      required={requerido}
                      disabled={disabledForm}
                    />
                  );
                }}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <InputTimer
                label='Carga horária aulas síncronas'
                nome='cargaHorariaSincrona'
                textToolTip='No caso de cursos a distância com opções de aulas síncronas (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade'
                key='cargaHorariaSincrona'
                disabled={disabledForm}
              />
            </Col>
            <Col xs={24} sm={12}>
              <InputTimer
                label='Carga horária a distância'
                nome='cargaHorariaDistancia'
                textToolTip='Para os cursos presenciais, se houver atividades não presenciais (máximo de 10% da carga horária total), indicar neste campo. Para os cursos a distância indicar a carga horária relativa as aulas assíncronas'
                key='cargaHorariaDistancia'
                disabled={disabledForm}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label='Carga horária total' shouldUpdate>
                {() => <InputTimerCargaHorariaTotal />}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </CollapsePanelSME>

      {collapsesComEditorDeTexto.map((item) => {
        return (
          <React.Fragment key={item.key}>
            <CollapsePanelSME
              panelProps={{ header: item.header, key: item.key }}
              exibirTooltip={true}
              titleToolTip={item.textoTooltip}
              collapseProps={{ defaultActiveKey: item.defaultActiveKey }}
            >
              <EditorTexto nome={item.key} disabeld={disabledForm} />
            </CollapsePanelSME>
          </React.Fragment>
        );
      })}

      <CollapsePanelSME
        panelProps={{ header: 'Palavras-chave', key: 'palavrasChave' }}
        collapseProps={{ defaultActiveKey: 'palavrasChave' }}
      >
        <SelectPalavrasChaves />
      </CollapsePanelSME>
    </>
  );
};

export default FormularioDetalhamento;