import { Button, Col, Row, Tooltip } from 'antd';
import React from 'react';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';

type CabecalhoPesquisaDocumentosProps = {
  actionLabel: string;
  emptySelectionMessage: string;
  navigate: ReturnType<typeof import('react-router-dom').useNavigate>;
  onDownload: VoidFunction;
  selectedCount: number;
  title: string;
};

const CabecalhoPesquisaDocumentos: React.FC<CabecalhoPesquisaDocumentosProps> = ({
  actionLabel,
  emptySelectionMessage,
  navigate,
  onDownload,
  selectedCount,
  title,
}) => (
  <HeaderPage title={title}>
    <Col span={24}>
      <Row gutter={[8, 8]}>
        <Col>
          <ButtonVoltar
            onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
            id={CF_BUTTON_VOLTAR}
          />
        </Col>
        <Col>
          <Tooltip title={selectedCount === 0 ? emptySelectionMessage : undefined}>
            <Button
              block
              type='primary'
              onClick={onDownload}
              disabled={selectedCount === 0}
              style={{ fontWeight: 700 }}
            >
              {actionLabel}
            </Button>
          </Tooltip>
        </Col>
      </Row>
    </Col>
  </HeaderPage>
);

export default CabecalhoPesquisaDocumentos;
