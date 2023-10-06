import { InfoCircleFilled } from '@ant-design/icons';
import { Collapse, CollapsePanelProps, CollapseProps, Tooltip } from 'antd';
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
  exibirTooltip?: boolean;
  titleToolTip?: string;
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
  exibirTooltip = false,
  titleToolTip,
}) => {
  const tituloPanel = <span style={styleTituloPanel}>{panelProps.header}</span>;
  const iconTooltip = exibirTooltip ? (
    <InfoCircleFilled style={{ color: Colors.TOOLTIP, paddingLeft: '5px' }} />
  ) : (
    <></>
  );
  return (
    <>
      <Collapse expandIconPosition='right' {...collapseProps} style={styleCollapse}>
        <Panel
          header={
            <Tooltip title={titleToolTip}>
              {tituloPanel}
              {iconTooltip}
            </Tooltip>
          }
          key={panelProps.key}
          extra={genExtra()}
        >
          {children}
        </Panel>
      </Collapse>
      <br />
    </>
  );
};

export default CollapsePanelSME;
