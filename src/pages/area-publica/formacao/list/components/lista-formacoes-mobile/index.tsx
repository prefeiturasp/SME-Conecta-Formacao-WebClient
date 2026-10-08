import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiltroFormacaoDTO } from '~/core/dto/filtro-formacao-dto';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { obterFormacaoPaginada } from '~/core/services/area-publica-service';
import { CardFormacao } from '../card-formacao';
import { EmptyCard } from '../empty-card';

export interface ListaFormacoesMobileProps {
  filtroFormacao: FiltroFormacaoDTO;
}

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PaginationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  margin-bottom: 24px;
  width: 100%;
`;

const ExibirMaisButton = styled.button`
  width: 100%;
  height: 44px;
  background-color: #ff9a52;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: #f28a3e;
    border-color: #f28a3e;
  }

  &:disabled {
    background-color: #f5f5f5;
    border: 1px solid #ff9a52;
    color: #bfbfc2;
    cursor: not-allowed;

    .anticon,
    svg {
      color: #bfbfc2;
    }
  }
`;

const ContadorInscricoes = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  color: #929494;
  font-weight: 500;
  text-align: center;
`;

const EmptyStateText = styled.div`
  font-family: 'Roboto', sans-serif;
  text-align: center;
  padding: 40px 16px;
  color: #929494;
  font-size: 14px;
`;

const formatarNumero = (valor: number): string => (valor < 10 ? `0${valor}` : `${valor}`);

export const mesclarFormacoes = (anteriores: FormacaoDTO[], novas: FormacaoDTO[]): FormacaoDTO[] => {
  const existingIds = new Set(anteriores.map((item) => item.id));
  const filtrados = novas.filter((item) => !existingIds.has(item.id));
  return [...anteriores, ...filtrados];
};

export const ListaFormacoesMobile: React.FC<ListaFormacoesMobileProps> = ({ filtroFormacao }) => {
  const [formacoes, setFormacoes] = useState<FormacaoDTO[]>([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMais, setLoadingMais] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setPaginaAtual(1);

    obterFormacaoPaginada(filtroFormacao, 1, 10)
      .then((response) => {
        if (response?.sucesso && response?.dados) {
          setFormacoes(response.dados.items || []);
          setTotalRegistros(response.dados.totalRegistros || 0);
        } else {
          setFormacoes([]);
          setTotalRegistros(0);
        }
      })
      .catch(() => {
        setFormacoes([]);
        setTotalRegistros(0);
      })
      .finally(() => setLoading(false));
  }, [filtroFormacao]);

  const temMaisPaginas = formacoes.length < totalRegistros;

  const handleExibirMais = async () => {
    if (loadingMais || loading || !temMaisPaginas) return;

    const proximaPagina = paginaAtual + 1;
    setLoadingMais(true);

    try {
      const response = await obterFormacaoPaginada(filtroFormacao, proximaPagina, 10);
      if (response?.sucesso && response?.dados) {
        const novosItens = response.dados.items || [];
        setPaginaAtual(proximaPagina);
        setTotalRegistros(response.dados.totalRegistros || 0);
        setFormacoes((prev) => mesclarFormacoes(prev, novosItens));
      }
    } finally {
      setLoadingMais(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}
        data-testid='loading-formacoes-mobile'
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#ff9a52' }} spin />} />
      </div>
    );
  }

  if (formacoes.length === 0) {
    return <EmptyCard />;
  }

  return (
    <MobileContainer data-testid='lista-formacoes-mobile'>
      {formacoes.map((item) => (
        <CardFormacao key={item.id} formacao={item} />
      ))}

      <PaginationSection>
        <ExibirMaisButton
          type='button'
          disabled={loadingMais || !temMaisPaginas}
          onClick={handleExibirMais}
          data-testid='btn-exibir-mais'
        >
          {loadingMais ? (
            <LoadingOutlined />
          ) : (
            <>
              <span>Exibir mais</span>
              <DownOutlined style={{ fontSize: 12 }} />
            </>
          )}
        </ExibirMaisButton>

        <ContadorInscricoes data-testid='contador-inscricoes'>
          Exibindo {formatarNumero(formacoes.length)} de {formatarNumero(totalRegistros)} inscrições
        </ContadorInscricoes>
      </PaginationSection>
    </MobileContainer>
  );
};

export default ListaFormacoesMobile;
