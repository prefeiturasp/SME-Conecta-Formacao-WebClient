import React from 'react';
import { Col, Form, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

export interface CampoSelectTurmaCodafProps {
  turmas: RetornoListagemDTO[];
  desabilitado?: boolean;
  exibirAvisoCodafExistente?: boolean;
  tooltipAberto?: boolean;
  colunas?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const CampoSelectTurmaCodaf: React.FC<CampoSelectTurmaCodafProps> = ({
  turmas,
  desabilitado = false,
  exibirAvisoCodafExistente = false,
  tooltipAberto = false,
  colunas = { xs: 24, sm: 12, md: 8, lg: 8, xl: 8 },
}) => {
  const rotulo = (
    <span>
      Turma{' '}
      {exibirAvisoCodafExistente && (
        <Tooltip
          title='Não é possível selecionar uma turma já inserida em um CODAF'
          open={tooltipAberto || undefined}
        >
          <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help' }} />
        </Tooltip>
      )}
    </span>
  );

  return (
    <Col {...colunas}>
      <b>
        <Form.Item
          label={rotulo}
          name='turmaId'
          rules={[{ required: true, message: 'Campo obrigatório' }]}
        >
          <Select
            placeholder='Selecione a turma'
            options={turmas.map((turma) => ({
              label: turma.descricao,
              value: turma.id,
            }))}
            disabled={desabilitado}
            allowClear
          />
        </Form.Item>
      </b>
    </Col>
  );
};
