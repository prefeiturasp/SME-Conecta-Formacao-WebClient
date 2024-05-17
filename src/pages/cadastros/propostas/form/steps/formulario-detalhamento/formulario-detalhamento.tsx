import { Col, Form, Row } from 'antd';
import React, { useContext } from 'react';
import CollapsePanelSME from '~/components/lib/collapse';
import InputTimer from '~/components/lib/inputs/timer';
import EditorTexto from '~/components/main/input/editor-texto';
import SelectPalavrasChaves from '~/components/main/input/palavras-chave';
import { getTooltipFormInfoCircleFilled } from '~/components/main/tooltip';
import {
  CARGA_HORARIA_NAO_INFORMADA,
  CONTEUDO_PROGRAMATICO_NAO_INFORMADO,
  JUSTIFICATIVA_NAO_INFORMADA,
  OBJETIVO_NAO_INFORMADO,
  PROCEDIMENTOS_METODOLOGICOS_NAO_INFORMADO,
  REFERENCIA_NAO_INFORMADA,
} from '~/core/constants/mensagens';
import {
  CampoConsideracaoEnum,
  CamposParecerNomeEnumDisplay,
} from '~/core/enum/campos-proposta-enum';
import { Formato } from '~/core/enum/formato';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonParecer } from '../../components/modal-parecer/modal-parecer-button';
import { SelectCargaHorariaTotal } from './components/select-carga-horaria-total/select-carga-horaria-total';
import { PropostaCargaHorariaTotalContextProvider } from './provider';

const FormularioDetalhamento: React.FC = () => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const collapsesComEditorDeTexto = [
    {
      key: CampoConsideracaoEnum.justificativa,
      header: 'Justificativa',
      messageError: JUSTIFICATIVA_NAO_INFORMADA,
      textoTooltip:
        'Por que esta formação foi planejada? Por que ela é necessária? Qual o diagnóstico da realidade ou necessidade de aprofundamento no tema?',
    },
    {
      key: CampoConsideracaoEnum.objetivos,
      header: 'Objetivos',
      messageError: OBJETIVO_NAO_INFORMADO,
      textoTooltip:
        ' Quais objetivos serão atingidos considerando o público-alvo proposto? Para que serão desenvolvidos os conteúdos e as metodologias? O que se espera que os profissionais aprendam / modifiquem?',
    },
    {
      key: CampoConsideracaoEnum.conteudoProgramatico,
      header: 'Conteúdo Programático',
      messageError: CONTEUDO_PROGRAMATICO_NAO_INFORMADO,
      textoTooltip:
        'O conteúdo programático deve estar alinhado a um ou mais princípios do Edital NTF 2023. Indique o que será desenvolvido como conteúdo da formação.',
    },
    {
      key: CampoConsideracaoEnum.procedimentoMetadologico,
      header: 'Procedimentos metodológicos',
      messageError: PROCEDIMENTOS_METODOLOGICOS_NAO_INFORMADO,
      textoTooltip:
        'Quais estratégias de formação serão utilizadas para abordar os conteúdos e alcançar os objetivos? Os procedimentos metodológicos devem favorecer a relação entre a teoria e a prática profissional.',
    },
    {
      key: CampoConsideracaoEnum.referencia,
      header: 'Referências',
      messageError: REFERENCIA_NAO_INFORMADA,
      textoTooltip: `Quais são os referenciais indicados e de onde foi extraído o conteúdo? Quais publicações da SME subsidiam esta proposta de formação?
      Referências, que não serão abordadas diretamente na ação formativa, podem ser indicadas como “referências bibliográficas complementares” ou “sugestões bibliográficas” para estímulo a outras leituras dos cursistas.
      Referenciais bibliográficos em língua estrangeira, preferencialmente, devem ser disponibilizados com tradução para a Língua Portuguesa.`,
    },
  ];

  return (
    <PropostaCargaHorariaTotalContextProvider>
      <CollapsePanelSME
        panelProps={{ header: 'Carga horária', key: 'cargaHoraria' }}
        collapseProps={{ defaultActiveKey: 'cargaHoraria' }}
      >
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item shouldUpdate style={{ margin: 0 }}>
                {(form) => {
                  const valor: Formato = form.getFieldValue('formato');
                  const requerido = valor === Formato.Presencial;

                  return (
                    <InputTimer
                      key='cargaHorariaPresencial'
                      mensagemErro={CARGA_HORARIA_NAO_INFORMADA}
                      formItemProps={{
                        required: requerido,
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
            <Col xs={24} sm={12}>
              <InputTimer
                key='cargaHorariaSincrona'
                formItemProps={{
                  label: 'Carga horária aulas síncronas',
                  name: 'cargaHorariaSincrona',
                  tooltip: getTooltipFormInfoCircleFilled(
                    'No caso de cursos a distância com opções de aulas síncronas (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade',
                  ),
                }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <InputTimer
                key='cargaHorariaDistancia'
                formItemProps={{
                  label: 'Carga horária a distância',
                  name: 'cargaHorariaDistancia',
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
        <ButtonParecer campo={CampoConsideracaoEnum.cargaHoraria} />
      </CollapsePanelSME>

      {collapsesComEditorDeTexto.map((item) => {
        const nome = CamposParecerNomeEnumDisplay[item.key];
        return (
          <React.Fragment key={item.key}>
            <CollapsePanelSME
              panelProps={{ header: item.header, key: nome }}
              exibirTooltip={true}
              titleToolTip={item.textoTooltip}
              collapseProps={{ defaultActiveKey: nome }}
            >
              <EditorTexto
                nome={nome}
                mensagemErro={item.messageError}
                disabled={desabilitarCampos}
                formItemProps={{ style: { marginBottom: 0 } }}
              />
              <ButtonParecer campo={item.key} />
            </CollapsePanelSME>
          </React.Fragment>
        );
      })}

      <CollapsePanelSME
        panelProps={{ header: 'Palavras-chave', key: 'palavrasChave' }}
        collapseProps={{ defaultActiveKey: 'palavrasChave' }}
      >
        <SelectPalavrasChaves />
        <ButtonParecer campo={CampoConsideracaoEnum.palavrasChaves} />
      </CollapsePanelSME>
    </PropostaCargaHorariaTotalContextProvider>
  );
};

export default FormularioDetalhamento;
