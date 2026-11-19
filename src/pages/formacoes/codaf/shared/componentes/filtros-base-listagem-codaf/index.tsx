import { Col, Row } from 'antd';
import React from 'react';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';

export interface FiltrosBaseListagemCodafProps {
  onChangeCodigoFormacao: () => void;
  onBlurCodigoFormacao: (value: string) => void;
  placeholderNomeFormacao?: string;
  placeholderCodigoFormacao?: string;
  placeholderNumeroHomologacao?: string;
  cabecalho?: React.ReactNode;
}

export const FiltrosBaseListagemCodaf: React.FC<FiltrosBaseListagemCodafProps> = ({
  onChangeCodigoFormacao,
  onBlurCodigoFormacao,
  placeholderNomeFormacao = 'Nome da formação',
  placeholderCodigoFormacao = 'Código da formação',
  placeholderNumeroHomologacao = 'Número de homologação',
  cabecalho,
}) => (
  <>
    <Row gutter={[16, 8]}>
      {cabecalho}
      <Col span={24}>
        <b>
          <InputTexto
            formItemProps={{
              label: 'Nome da formação',
              name: 'nomeFormacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_NOME_FORMACAO,
              placeholder: placeholderNomeFormacao,
              maxLength: 200,
            }}
          />
        </b>
      </Col>
    </Row>
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <b>
          <SelectAreaPromotora
            formItemProps={{ name: 'areaPromotoraId' }}
            selectProps={{ disabled: false }}
            placeholder='Selecione'
          />
        </b>
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <b>
          <InputNumero
            formItemProps={{
              label: 'Código da formação',
              name: 'codigoFormacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_CODIGO_FORMACAO,
              placeholder: placeholderCodigoFormacao,
              maxLength: 19,
              onChange: onChangeCodigoFormacao,
              onBlur: (e) => onBlurCodigoFormacao(e.target.value),
            }}
          />
        </b>
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <b>
          <InputNumero
            formItemProps={{
              label: 'Número de homologação',
              name: 'numeroHomologacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_NUMERO_HOMOLOGACAO,
              placeholder: placeholderNumeroHomologacao,
              maxLength: 20,
              disabled: false,
            }}
          />
        </b>
      </Col>
    </Row>
  </>
);
