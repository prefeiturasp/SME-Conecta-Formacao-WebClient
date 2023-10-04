import { FormInstance } from 'antd';
import React from 'react';
import CollapsePanelSME from '~/components/lib/collapse';
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
    },
    {
      key: 'objetivos',
      header: 'Objetivos',
      defaultActiveKey: 'objetivos',
    },
    {
      key: 'conteudoProgramatico',
      header: 'Conteúdo Programático',
      defaultActiveKey: 'conteudoProgramatico',
    },
    {
      key: 'procedimentosMetodologicos',
      header: 'Procedimentos metodológicos',
      defaultActiveKey: 'procedimentosMetodologicos',
    },
    {
      key: 'referencias',
      header: 'Referências',
      defaultActiveKey: 'referencias',
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
              collapseProps={{ defaultActiveKey: item.defaultActiveKey }}
            >
              Editor de Texto Será Adicionado Aqui
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
