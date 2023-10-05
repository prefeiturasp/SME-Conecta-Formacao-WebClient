import { FormInstance } from 'antd';
import React from 'react';
import CollapsePanelSME from '~/components/lib/collapse';
import EditorTexto from '~/components/main/input/editor-texto';
import SelectPalavrasChaves from '~/components/main/input/palacras-chave';
type FormDetalhamentoProps = {
  form: FormInstance;
};
const FormularioDetalhamento: React.FC<FormDetalhamentoProps> = () => {
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
        Carga horária
      </CollapsePanelSME>
      {collapsesComEditorDeTexto.map((item) => {
        return (
          <>
            <CollapsePanelSME
              panelProps={{ header: item.header, key: item.key }}
              exibirTooltip={true}
              titleToolTip={item.textoTooltip}
              collapseProps={{ defaultActiveKey: item.defaultActiveKey }}
            >
              <EditorTexto nome={item.key} />
            </CollapsePanelSME>
          </>
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
