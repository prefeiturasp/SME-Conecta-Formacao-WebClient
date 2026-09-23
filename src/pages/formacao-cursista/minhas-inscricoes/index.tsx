import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardContent from '~/components/lib/card-content';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { MinhasInscricoesListaPaginada } from './listagem';
import MinhasInscricoesMobile from './components/minhas-inscricoes-mobile';

const DesktopContainer = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block !important;
  }
`;

export const MinhasInscricoes = () => {
  const navigate = useNavigate();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  useEffect(() => {
    if (!ehCursista) {
      navigate(ROUTES.PRINCIPAL);
    }
  }, [ehCursista, perfilSelecionado, navigate]);

  const novaInscricao = () => {
    if (ehCursista) {
      navigate(ROUTES.AREA_PUBLICA);
    }
  };

  return (
    <>
      <DesktopContainer data-testid='minhas-inscricoes-desktop'>
        <Col>
          <HeaderPage title='Minhas Inscrições'>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col>
                  <Button
                    block
                    type='primary'
                    id={CF_BUTTON_NOVO}
                    style={{ fontWeight: 700 }}
                    icon={<PlusOutlined />}
                    onClick={novaInscricao}
                  >
                    Explorar formações
                  </Button>
                </Col>
              </Row>
            </Col>
          </HeaderPage>

          <CardContent>
            <Col span={24}>
              <DataTableContextProvider>
                <MinhasInscricoesListaPaginada />
              </DataTableContextProvider>
            </Col>
          </CardContent>
        </Col>
      </DesktopContainer>

      <MobileContainer data-testid='minhas-inscricoes-mobile-wrapper'>
        <MinhasInscricoesMobile ehCursista={ehCursista} />
      </MobileContainer>
    </>
  );
};
