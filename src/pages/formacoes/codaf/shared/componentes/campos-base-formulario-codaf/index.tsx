import { Col, Row } from 'antd';
import React from 'react';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';

export interface CamposBaseFormularioCodafProps {
  onChangeCodigoFormacao: (value: string) => void;
  onBlurCodigoFormacao: (value: string) => void;
  codigoFormacaoDisabled: boolean;
  labelNumeroHomologacao?: string;
  children?: React.ReactNode;
}

export const CamposBaseFormularioCodaf: React.FC<CamposBaseFormularioCodafProps> = ({
  onChangeCodigoFormacao,
  onBlurCodigoFormacao,
  codigoFormacaoDisabled,
  labelNumeroHomologacao = 'Número de homologação',
  children,
}) => (
  <>
    <Row gutter={[16, 8]}>
      <Col xs={24}>
        <b>
          <InputTexto
            formItemProps={{
              label: 'Nome da formação',
              name: 'nomeFormacao',
              rules: [{ required: true, message: 'Campo obrigatório' }],
            }}
            inputProps={{
              id: CF_INPUT_NOME_FORMACAO,
              placeholder: 'Nome da formação',
              maxLength: 200,
              disabled: true,
            }}
          />
        </b>
      </Col>
    </Row>
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <b>
          <InputNumero
            formItemProps={{
              label: 'Código da formação',
              name: 'codigoFormacao',
              rules: [{ required: true, message: 'Campo obrigatório' }],
            }}
            inputProps={{
              id: CF_INPUT_CODIGO_FORMACAO,
              placeholder: 'Código da formação',
              maxLength: 19,
              disabled: codigoFormacaoDisabled,
              onChange: (e) => onChangeCodigoFormacao(e.target.value),
              onBlur: (e) => onBlurCodigoFormacao(e.target.value),
            }}
          />
        </b>
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <b>
          <InputNumero
            formItemProps={{
              label: labelNumeroHomologacao,
              name: 'numeroHomologacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_NUMERO_HOMOLOGACAO,
              placeholder: '00000',
              maxLength: 20,
              disabled: true,
            }}
          />
        </b>
      </Col>
      {children}
    </Row>
  </>
);
