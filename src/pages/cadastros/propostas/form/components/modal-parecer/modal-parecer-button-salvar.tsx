import { Tooltip } from 'antd';
import React from 'react';
import { FaRegSave } from 'react-icons/fa';
import styled from 'styled-components';

interface ButtonSalvarParecerParams {
  descricaoTooltip: string;
  podeEditar?: boolean;
  onClickSalvar: () => void;
}

const ButtonSalvarParecerContainer = styled.div<ButtonSalvarParecerParams>`
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

export const ButtonSalvarParecer: React.FC<ButtonSalvarParecerParams> = ({ ...res }) => (
  <Tooltip placement='top' destroyTooltipOnHide title={res.descricaoTooltip}>
    <span>
      <ButtonSalvarParecerContainer
        onClick={() => {
          if (res.podeEditar) res.onClickSalvar();
        }}
        {...res}
      >
        <FaRegSave style={styleIcon} />
      </ButtonSalvarParecerContainer>
    </span>
  </Tooltip>
);
