import { Collapse, CollapsePanelProps, CollapseProps } from 'antd';
import React from 'react';
import { Colors } from '~/core/styles/colors';

const { Panel } = Collapse;
const genExtra = () => (
  <>
    <span style={{ color: 'red' }}>* </span>
    <span style={{ fontSize: '12px' }}>Campos de Preenchimento Obrigatório</span>
  </>
);

type CollapsePanelSMEProps = {
  children: React.ReactNode;
  panelProps: CollapsePanelProps;
  collapseProps?: CollapseProps;
};
const styleTituloPanel: React.CSSProperties = {
  fontSize: 14,
  color: Colors.ORANGE_CONECTA_FORMACAO,
  fontWeight: 'bold',
};
const styleCollapse: React.CSSProperties = {
  borderLeft: `10px solid ${Colors.ORANGE_CONECTA_FORMACAO}`,
};
const CollapsePanelSME: React.FC<CollapsePanelSMEProps> = ({
  children,
  panelProps,
  collapseProps,
}) => {
  const tituloPanel = <span style={styleTituloPanel}>{panelProps.header}</span>;
  return (
    <>
      <Collapse expandIconPosition='right' {...collapseProps} style={styleCollapse}>
        <Panel header={tituloPanel} key={panelProps.key} extra={genExtra()}>
          {children}
        </Panel>
      </Collapse>
      <br />
    </>
  );
};

export default CollapsePanelSME;
