import styled, { css } from 'styled-components';
import { RightCircleFilled } from '@ant-design/icons';

export const ALTURA_BARRA_ACOES = 72;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: calc(${ALTURA_BARRA_ACOES + 16}px + env(safe-area-inset-bottom));
`;

export const Breadcrumb = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  color: #ff9a52;
  font-size: 12px;
  cursor: pointer;
`;

export const Trilha = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #42474a;
  white-space: nowrap;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Separador = styled(RightCircleFilled)`
  color: #ff9a52;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #42474a;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

export const Capa = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
`;

export const Logo = styled.img`
  display: block;
  margin: 16px auto 0;
  width: 120px;
`;

export const Conteudo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Titulo = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.2;
  word-break: break-word;
`;

export const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  background: #ececee;
  color: #58616a;
  font-size: 12px;
  font-weight: 700;
`;

export const Info = styled.p`
  margin: 0;
  font-size: 14px;
  color: #42474a;
  line-height: 1.4;
`;

export const Divisor = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #dadada;
  margin: 8px 0;
`;

export const Secao = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TituloSecao = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #42474a;
`;

export const Texto = styled.p`
  margin: 0;
  font-size: 14px;
  color: #42474a;
  line-height: 1.5;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TagEscura = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  background: #42474a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  max-width: 100%;
  overflow-wrap: anywhere;
`;

export const ListaTurmas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ant-card-head {
    min-height: 44px;
    padding: 0 16px;
  }

  .ant-card-head-title {
    white-space: normal;
  }

  .ant-card-body {
    padding: 16px;
    overflow-wrap: anywhere;
    line-height: 1.4;
  }
`;

export const BarraAcoes = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: ${ALTURA_BARRA_ACOES}px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
`;

export const BotaoSeta = styled.button`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  background: #fff;
  color: #ff9a52;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    border-color: #dadada;
    background: #f5f5f5;
    color: #bfbfc2;
    cursor: not-allowed;
  }
`;

export const estiloBotaoInscricao = css`
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #ff9a52;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;

export const BotaoInscricao = styled.button`
  ${estiloBotaoInscricao}

  &:disabled {
    background: #f5f5f5;
    color: #bfbfc2;
    cursor: not-allowed;
  }
`;

export const LinkInscricao = styled.a`
  ${estiloBotaoInscricao}

  &:hover {
    color: #fff;
  }
`;

export const Espaco = styled.div<{ $altura?: number }>`
  height: ${({ $altura = 4 }) => $altura}px;
`;
