import { Col, Row } from 'antd';
import styled from 'styled-components';
import conectaFormacaoFundoLogin from '~/assets/conecta-formacao-fundo-login.svg';

export const BackgroundHome = styled.div`
  background: url(${conectaFormacaoFundoLogin});
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const HomeContainer = styled(Row)`
  height: 100vh;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
    background: url(${conectaFormacaoFundoLogin}) no-repeat top center;
    background-size: 100% auto;
  }
`;

export const BackgroundCol = styled(Col)`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ConteudoCol = styled(Col)`
  max-height: 100vh;
  overflow: auto;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    max-width: 100%;
    max-height: none;
    overflow: visible;
    min-height: calc(100vh - 200px);
    margin-top: 200px;
    padding: 24px 16px 32px;
    background: #fff;
    border-radius: 16px 16px 0 0;

    .home-logo {
      margin: 0 0 24px !important;
      justify-content: flex-start;
    }

    .home-logo > .ant-col {
      flex: 0 0 auto;
      max-width: 240px;
    }

    .home-conteudo > .ant-col {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .home-conteudo .ant-form-item {
      margin-bottom: 8px;
    }

    .home-conteudo .ant-btn-text {
      font-size: 14px !important;
    }

    .home-conteudo input,
    .home-conteudo .ant-select {
      font-size: 16px;
    }

    .home-navegadores {
      text-align: center;
    }
  }
`;
