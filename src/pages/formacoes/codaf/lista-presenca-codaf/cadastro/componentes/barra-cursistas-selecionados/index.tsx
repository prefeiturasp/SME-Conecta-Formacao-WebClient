import { Button, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react';

interface BarraCursistasSelecionadosProps {
  quantidadeSelecionados: number;
  onClickRegistrarDados: () => void;
  onClickEditarDados: () => void;
  registrarDadosDesabilitado: boolean;
  editarDadosDesabilitado: boolean;
}

export const BarraCursistasSelecionados: React.FC<BarraCursistasSelecionadosProps> = ({
  quantidadeSelecionados,
  onClickRegistrarDados,
  onClickEditarDados,
  registrarDadosDesabilitado,
  editarDadosDesabilitado,
}) => {
  return (
    <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
      <Col span={24}>
        <div
          style={{
            backgroundColor: '#ff9a52',
            borderRadius: '4px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
            {quantidadeSelecionados} cursistas selecionados
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type='text'
              icon={<PlusOutlined style={{ color: '#fff' }} />}
              onClick={onClickRegistrarDados}
              disabled={registrarDadosDesabilitado}
              style={{
                color: '#fff',
                fontWeight: 600,
                opacity: registrarDadosDesabilitado ? 0.5 : 1,
              }}
            >
              Registrar dados
            </Button>

            <div style={{ width: 1, height: 20, backgroundColor: '#fff', opacity: 0.5 }} />

            <Button
              type='text'
              icon={<EditOutlined style={{ color: '#fff' }} />}
              onClick={onClickEditarDados}
              disabled={editarDadosDesabilitado}
              style={{
                color: '#fff',
                fontWeight: 600,
                opacity: editarDadosDesabilitado ? 0.5 : 1,
              }}
            >
              Editar dados
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};