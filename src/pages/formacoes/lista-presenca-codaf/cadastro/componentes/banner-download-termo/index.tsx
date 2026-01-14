import { Button, Col, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface BannerDownloadTermoProps {
  onBaixarModelo: () => void;
}

export const BannerDownloadTermo: React.FC<BannerDownloadTermoProps> = ({ onBaixarModelo }) => {
  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          height: '100%',
          borderRadius: '4px',
          backgroundColor: 'white',
          boxShadow: '0px 0px 12px 0px #0000001F',
          padding: '24px',
        }}
      >
        <Row gutter={[16, 8]} align='middle' justify='space-between'>
          <Col>
            <p style={{ margin: 0 }}>
              Você pode baixar o modelo de termo de responsabilidade clicando em &quot;termo
              de responsabilidade&quot;.
            </p>
          </Col>
          <Col>
            <Button
              type='default'
              icon={<DownloadOutlined />}
              style={{
                borderColor: '#ff6b35',
                color: '#ff6b35',
                fontWeight: 500,
                padding: '9px',
              }}
              onClick={onBaixarModelo}
            >
              Termo de responsabilidade
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
