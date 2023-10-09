import { Col, FormInstance, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';
import CollapsePanelSME from '~/components/lib/collapse';
import InputTimer from '~/components/lib/inputs/timer';
import EditorTexto from '~/components/main/input/editor-texto';
import SelectPalavrasChaves from '~/components/main/input/palacras-chave';
import { Modalidade } from '~/core/enum/modalidade';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';
type FormDetalhamentoProps = {
  form: FormInstance;
};
const FormularioDetalhamento: React.FC<FormDetalhamentoProps> = ({ form }) => {
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
  const camposComTimer = [
    {
      nome: 'cargaHorariaPresencial',
      label: 'Carga horária presencial',
      textoTooltip:
        'No caso de cursos a distância com opções de aulas presenciais (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade.',
    },
    {
      nome: 'cargaHorariaSincrona',
      label: 'Carga horária aulas síncronas',
      textoTooltip:
        'No caso de cursos a distância com opções de aulas síncronas (mínimo de 20% e máximo de 40%). Os eventos híbridos devem respeitar a proporcionalidade entre mínimo e máximo de 40% e 60% de carga horária destinada para cada modalidade',
    },
    {
      nome: 'cargaHorariaDistancia',
      label: 'Carga horária a distância',
      textoTooltip:
        'Para os cursos presenciais, se houver atividades não presenciais (máximo de 10% da carga horária total), indicar neste campo. Para os cursos a distância indicar a carga horária relativa as aulas assíncronas',
    },
  ];

  const modalidade = form.getFieldValue('modalidade');
  console.log(modalidade);
  const setValorCargaHorariaTotal = (value: string, nome: string) => {
    form.setFieldValue(nome, formatarDuasCasasDecimais(value));
    gerarCargaHorariaTotal();
  };
  const gerarCargaHorariaTotal = useCallback(() => {
    const presencial = form.getFieldValue('cargaHorariaPresencial');
    const assicrona = form.getFieldValue('cargaHorariaSincrona');
    const distancia = form.getFieldValue('cargaHorariaDistancia');
    const minutosTotais =
      converterParaMinutos(presencial) +
      converterParaMinutos(assicrona) +
      converterParaMinutos(distancia);

    const horasFinais = Math.floor(minutosTotais / 60);
    const minutosFinais = minutosTotais % 60;
    setTimeout(() => {
      form.setFieldValue('cargaHorariaTotal', `${horasFinais}:${minutosFinais}`);
    }, 1000);
  }, []);

  const converterParaMinutos = (hora: string): number => {
    if (hora) {
      const partes = hora?.split(':');
      const horas = Number(partes[0] ?? 0);
      const minutos = Number(partes[1] ?? 0);
      return horas * 60 + minutos;
    }
    return 0;
  };
  const cargaHorariaPresencialObrigatoria = (campoHora: string): boolean => {
    const modalidade = form.getFieldValue('modalidade');
    const presencial = 'cargaHorariaPresencial';
    if (presencial == campoHora) return modalidade == Modalidade.Presencial;
    return true;
  };
  useEffect(() => {
    gerarCargaHorariaTotal();
  }, [gerarCargaHorariaTotal()]);

  return (
    <>
      <CollapsePanelSME
        panelProps={{ header: 'Carga horária', key: 'cargaHoraria' }}
        collapseProps={{ defaultActiveKey: 'cargaHoraria' }}
      >
        <Col span={24}>
          <Row>
            {camposComTimer.map((item) => {
              return (
                <InputTimer
                  label={item.label}
                  nome={item.nome}
                  textoToolTip={item.textoTooltip}
                  key={item.nome}
                  form={form}
                  requerido={cargaHorariaPresencialObrigatoria(item.nome)}
                  funcao={setValorCargaHorariaTotal}
                />
              );
            })}
            <InputTimer
              label='Carga horária total'
              nome='cargaHorariaTotal'
              exibirTooltip={false}
              requerido={false}
              form={form}
              somenteLeitura={true}
              funcao={setValorCargaHorariaTotal}
            />
          </Row>
        </Col>
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
