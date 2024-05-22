import React, { useContext } from 'react';
import CollapsePanelSME from '~/components/lib/collapse';
import EditorTexto from '~/components/main/input/editor-texto';
import SelectPalavrasChaves from '~/components/main/input/palavras-chave';
import {
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
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonParecer } from '../../components/modal-parecer/modal-parecer-button';
import CamposCargaHorariaProvider from './components/campos-carga-horaria/cargas-horaria-provider';

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
    <>
      <CollapsePanelSME
        panelProps={{ header: 'Carga horária', key: 'cargaHoraria' }}
        collapseProps={{ defaultActiveKey: 'cargaHoraria' }}
      >
        <CamposCargaHorariaProvider />
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
    </>
  );
};

export default FormularioDetalhamento;
