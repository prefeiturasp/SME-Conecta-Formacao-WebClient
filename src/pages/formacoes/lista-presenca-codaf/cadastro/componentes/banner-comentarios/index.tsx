import { Button, Col, Row } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import React from 'react';
import { ComentarioCodafDTO } from '~/core/services/codaf-lista-presenca-service';

interface BannerComentariosProps {
  comentario: ComentarioCodafDTO | null;
  onConferirComentarios: () => void;
  loading: boolean;
}

export const BannerComentarios: React.FC<BannerComentariosProps> = ({
  comentario,
  onConferirComentarios,
  loading,
}) => {
  return (
    <Row gutter={[16, 8]} style={{ marginBottom: '16px' }}>
      <Col span={24}>
        <div
          style={{
            backgroundColor: '#ff9a52',
            borderRadius: '4px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flex: 1,
              width: '70%',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src='/balao.png'
                alt='Warning'
                style={{
                  width: '15px',
                  height: '15px',
                }}
              />
            </div>
            <span style={{ color: '#fff', fontSize: '14px' }}>
              <strong>{comentario?.criadoPor || 'Usuário'}</strong> inseriu comentários no CODAF.
              Clique no botão "conferir comentários" para acessar as informações
            </span>
          </div>
          <Button
            type='default'
            icon={
              <ReloadOutlined
                style={{
                  color: '#ff9a52',
                }}
              />
            }
            onClick={onConferirComentarios}
            loading={loading}
            style={{
              backgroundColor: '#fff',
              borderColor: '#fff',
              color: '#ff9a52',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              padding: '4px 16px',
              minWidth: '250px',
              height: '38px',
            }}
          >
            Conferir comentários
          </Button>
        </div>
      </Col>
    </Row>
  );
};
