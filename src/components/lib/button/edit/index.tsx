import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';

interface ButtonEditParams {
  descricaoTooltip: string;
  podeEditar?: boolean;
  onClickEditar: () => void;
}

const ButtonEditContainer = styled.div<ButtonEditParams>`
  border: none;
  border-radius: 4px;
  cursor: ${(props) => props?.podeEditar ? 'pointer' : 'not-allowed'} pointer;
  height: 32px;
  width: 32px;
  color: ${(props) => props?.podeEditar ? props.theme?.token?.colorPrimary : '#f0f0f0'};
`;

const styleIcon: React.CSSProperties = {
  margin: '6.5px',
  cursor: 'pointer',
  fontSize: '16px'
}

export const ButtonEdit: React.FC<ButtonEditParams> = ({ ...res }) =>(
  <Tooltip placement='top' destroyTooltipOnHide title={ res.descricaoTooltip }>
    <span>
      <ButtonEditContainer
        onClick={ () => {
          if (res.podeEditar)
            res.onClickEditar();
        }}
        {...res}>
          <FaEdit style={styleIcon} />
      </ButtonEditContainer>
    </span>
  </Tooltip>
);
