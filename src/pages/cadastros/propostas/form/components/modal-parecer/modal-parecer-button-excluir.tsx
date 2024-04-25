import { Tooltip } from 'antd';
import React from 'react';
import { MdDelete } from 'react-icons/md';
import styled from 'styled-components';

interface ButtonExcluirParecerParams {
  descricaoTooltip: string;
  podeEditar?: boolean;
  onClickRemover: () => void;
}

const ButtonExcluirParecerContainer = styled.div<ButtonExcluirParecerParams>`
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props?.podeEditar ? 'pointer' : 'not-allowed')} pointer;
  height: 32px;
  width: 32px;
  color: ${(props) => (props?.podeEditar ? props.theme?.token?.colorPrimary : '#f0f0f0')};
`;

const styleIcon: React.CSSProperties = {
  margin: '6.5px',
  cursor: 'pointer',
  fontSize: '18px',
};

export const ButtonExcluirParecer: React.FC<ButtonExcluirParecerParams> = ({ ...res }) => (
  <Tooltip placement='top' destroyTooltipOnHide title={res.descricaoTooltip}>
    <span>
      <ButtonExcluirParecerContainer
        onClick={() => {
          if (res.podeEditar) res.onClickRemover();
        }}
        {...res}
      >
        <MdDelete style={styleIcon} />
      </ButtonExcluirParecerContainer>
    </span>
  </Tooltip>
);
