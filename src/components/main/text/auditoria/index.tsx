import { Col, Row, Typography } from 'antd';
import { FC } from 'react';
import { AuditoriaDTO } from '~/core/dto/auditoria-dto';
import { formatarDataHoraAuditoria } from '~/core/utils/functions';

interface InfoAuditoriaProps {
  rf: string;
  data: string;
  autor: string;
  label: string;
}

interface AuditoriaProps {
  dados: AuditoriaDTO | undefined;
}

const InfoAuditoria: FC<InfoAuditoriaProps> = ({ label, autor, rf, data }) => {
  return (
    <Typography.Text style={{ fontSize: 9, fontWeight: 700 }}>
      {`${label} por ${autor} ${rf ? `(${rf})` : ''}`} em {formatarDataHoraAuditoria(data)}
    </Typography.Text>
  );
};

const Auditoria: FC<AuditoriaProps> = ({ dados }) => {
  if (!dados?.criadoPor) return <></>;

  const { criadoPor, criadoEm, criadoLogin, alteradoLogin, alteradoPor, alteradoEm } = dados;

  return (
    <Row>
      {criadoPor && (
        <Col span={24}>
          <InfoAuditoria label='INSERIDO' autor={criadoPor} rf={criadoLogin} data={criadoEm} />
        </Col>
      )}
      {alteradoPor && (
        <Col span={24}>
          <InfoAuditoria
            label='ALTERADO'
            autor={alteradoPor}
            rf={alteradoLogin}
            data={alteradoEm}
          />
        </Col>
      )}
    </Row>
  );
};

export default Auditoria;
