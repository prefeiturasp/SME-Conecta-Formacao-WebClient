import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PlusOutlined, SearchOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { ROUTES } from '~/core/enum/routes-enum';
import { notification } from '~/components/lib/notification';
import { confirmacao } from '~/core/services/alerta-service';
import { URL_INSCRICAO, cancelarInscricao } from '~/core/services/inscricao-service';
import {
  CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA,
  DESEJA_CANCELAR_INSCRICAO_CURSISTA,
} from '~/core/constants/mensagens';
import api from '~/core/services/api';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';

import { InscricaoProps } from '../../listagem';
import CardInscricaoMobile from '../card-inscricao-mobile';
import MinhasInscricoesFiltrosMobile, {
  FiltrosMinhasInscricoesValues,
  contarFiltrosAplicados,
} from '../filtros-mobile';
import ModalDetalhesInscricao from '../modal-detalhes-inscricao';

export interface MinhasInscricoesMobileProps {
  ehCursista?: boolean;
}

type AbaType = 'andamento' | 'finalizadas';

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.2;
`;

const ExplorarButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #ff9a52;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: #f28a3e;
  }
`;

const TabsWrapper = styled.div`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
  display: flex;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.$active ? '#ffffff' : 'transparent')};
  color: ${(props) => (props.$active ? '#ff9a52' : '#929494')};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ContextDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #42474a;
  line-height: 1.4;
`;

const SearchFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #dadada;
  border-radius: 8px;
  padding: 0 36px 0 12px;
  font-size: 14px;
  color: #42474a;
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;

  &::placeholder {
    color: #bfbfc2;
  }

  &:focus {
    border-color: #ff9a52;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  color: #bfbfc2;
  font-size: 16px;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const FilterButtonWrapper = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ff9a52;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 154, 82, 0.08);
  }
`;

const FilterBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ff9a52;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 16px;
  gap: 20px;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #42474a;
  line-height: 1.5;
  max-width: 320px;
`;

const EmptyStateButton = styled.button`
  height: 40px;
  background-color: #ff9a52;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  padding: 0 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: #f28a3e;
  }
`;

const PaginationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
`;

const ExibirMaisButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #ff9a52;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: #f28a3e;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContadorInscricoes = styled.span`
  font-size: 13px;
  color: #929494;
  font-weight: 500;
`;

const SlidersIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M2 4h5m3 0h4M7 2v4M2 8h2m3 0h7M4 6v4M2 12h8m3 0h1M10 10v4'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
    />
  </svg>
);

export const MinhasInscricoesMobile: React.FC<MinhasInscricoesMobileProps> = ({
  ehCursista = true,
}) => {
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState<AbaType>('andamento');
  const [buscaRapida, setBuscaRapida] = useState('');
  const [painelFiltrosAberto, setPainelFiltrosAberto] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<FiltrosMinhasInscricoesValues>({});

  const [inscricoes, setInscricoes] = useState<InscricaoProps[]>([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMais, setLoadingMais] = useState(false);

  const [detalhesRecord, setDetalhesRecord] = useState<InscricaoProps | null>(null);

  const quantidadeFiltros = useMemo(
    () => contarFiltrosAplicados(filtrosAvancados, abaAtiva),
    [filtrosAvancados, abaAtiva],
  );

  const buscarInscricoes = useCallback(
    async (
      pagina: number,
      aba: AbaType,
      busca: string,
      filtros: FiltrosMinhasInscricoesValues,
      concatenar = false,
    ) => {
      if (pagina === 1) {
        setLoading(true);
      } else {
        setLoadingMais(true);
      }

      try {
        const base =
          aba === 'andamento' ? `${URL_INSCRICAO}/proximas` : `${URL_INSCRICAO}/finalizadas`;

        const params = new URLSearchParams();

        if (busca.trim()) {
          params.append('NomeFormacao', busca.trim());
        } else if (filtros.NomeFormacao?.trim()) {
          params.append('NomeFormacao', filtros.NomeFormacao.trim());
        }

        if (aba === 'andamento') {
          if (filtros.CodigoFormacao) {
            params.append('CodigoFormacao', String(filtros.CodigoFormacao));
          }
          if (filtros.DataInscricao) {
            params.append('DataInscricao', dayjs(filtros.DataInscricao).format('YYYY-MM-DD'));
          }
          if (filtros.NomeTurma?.trim()) {
            params.append('NomeTurma', filtros.NomeTurma.trim());
          }
          if (filtros.Situacao) {
            params.append('Situacao', String(filtros.Situacao));
          }
        } else {
          if (filtros.SituacaoInscricao) {
            params.append('SituacaoInscricao', String(filtros.SituacaoInscricao));
          }
        }

        if (filtros.DataInicial) {
          params.append('DataInicial', dayjs(filtros.DataInicial).format('YYYY-MM-DD'));
        }
        if (filtros.DataFinal) {
          params.append('DataFinal', dayjs(filtros.DataFinal).format('YYYY-MM-DD'));
        }

        const queryString = params.toString();
        const url = queryString ? `${base}?${queryString}` : base;

        const response = await api.get<PaginacaoResultadoDTO<InscricaoProps[]>>(url, {
          headers: {
            numeroPagina: pagina,
            numeroRegistros: 10,
          },
        });

        if (response?.data) {
          const novosItens = response.data.items || [];
          const total = response.data.totalRegistros || 0;

          setTotalRegistros(total);

          if (concatenar) {
            setInscricoes((prev) => {
              const existingIds = new Set(prev.map((item) => item.id));
              const filtrados = novosItens.filter((item) => !existingIds.has(item.id));
              return [...prev, ...filtrados];
            });
          } else {
            setInscricoes(novosItens);
          }
        }
      } catch (error) {
        setInscricoes([]);
        setTotalRegistros(0);
      } finally {
        setLoading(false);
        setLoadingMais(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPaginaAtual(1);
    buscarInscricoes(1, abaAtiva, buscaRapida, filtrosAvancados, false);
  }, [abaAtiva, buscaRapida, filtrosAvancados, buscarInscricoes]);

  const handleExibirMais = () => {
    if (loadingMais || loading) return;
    const proximaPagina = paginaAtual + 1;
    setPaginaAtual(proximaPagina);
    buscarInscricoes(proximaPagina, abaAtiva, buscaRapida, filtrosAvancados, true);
  };

  const handleTrocaAba = (novaAba: AbaType) => {
    if (novaAba === abaAtiva) return;
    setAbaAtiva(novaAba);
    setFiltrosAvancados({});
    setBuscaRapida('');
  };

  const handleApplyFiltros = (novosFiltros: FiltrosMinhasInscricoesValues) => {
    setFiltrosAvancados(novosFiltros);
    setPainelFiltrosAberto(false);
  };

  const handleClearFiltros = () => {
    setFiltrosAvancados({});
    setPainelFiltrosAberto(false);
  };

  const mensagemConfirmacao = (record: InscricaoProps) => {
    if (record.integrarNoSga && record.iniciado && ehCursista) {
      return DESEJA_CANCELAR_INSCRICAO_CURSISTA;
    }
    if (record.integrarNoSga && record.iniciado && !ehCursista) {
      return DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA;
    }
    if (!record.integrarNoSga && !record.iniciado && !ehCursista) {
      return CANCELAR_INSCRICAO;
    }
    return DESEJA_CANCELAR_INSCRICAO;
  };

  const handleCancelarInscricao = (record: InscricaoProps) => {
    confirmacao({
      content: mensagemConfirmacao(record),
      onOk: async () => {
        try {
          const response = await cancelarInscricao(record.id);
          if (response?.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: 'Inscrição cancelada com sucesso!',
            });
            setDetalhesRecord(null);
            setPaginaAtual(1);
            buscarInscricoes(1, abaAtiva, buscaRapida, filtrosAvancados, false);
          }
        } catch {
          notification.error({
            message: 'Erro',
            description: 'Não foi possível cancelar a inscrição.',
          });
        }
      },
    });
  };

  return (
    <Container data-testid='minhas-inscricoes-mobile'>
      <HeaderSection>
        <PageTitle>Minhas inscrições</PageTitle>
        <ExplorarButton
          type='button'
          onClick={() => navigate(ROUTES.AREA_PUBLICA)}
          data-testid='btn-explorar-formacoes-mobile'
        >
          <PlusOutlined />
          <span>Explorar formações</span>
        </ExplorarButton>
      </HeaderSection>

      <TabsWrapper role='tablist'>
        <TabButton
          type='button'
          role='tab'
          aria-selected={abaAtiva === 'andamento'}
          $active={abaAtiva === 'andamento'}
          onClick={() => handleTrocaAba('andamento')}
          data-testid='tab-proximas'
        >
          Próximas
        </TabButton>
        <TabButton
          type='button'
          role='tab'
          aria-selected={abaAtiva === 'finalizadas'}
          $active={abaAtiva === 'finalizadas'}
          onClick={() => handleTrocaAba('finalizadas')}
          data-testid='tab-finalizadas'
        >
          Finalizadas
        </TabButton>
      </TabsWrapper>

      <ContextDescription data-testid='context-description'>
        {abaAtiva === 'andamento'
          ? 'Formações em que você se inscreveu e que ainda vão acontecer.'
          : 'Confira aqui todas as formações em que você se inscreveu. Use as abas para acessar os cursos que ainda vão acontecer e aqueles que já foram concluídos.'}
      </ContextDescription>

      <SearchFilterRow>
        <SearchInputWrapper>
          <SearchInput
            type='text'
            placeholder='Buscar formação'
            value={buscaRapida}
            onChange={(e) => setBuscaRapida(e.target.value)}
            data-testid='input-busca-rapida'
          />
          <SearchIconWrapper>
            <SearchOutlined />
          </SearchIconWrapper>
        </SearchInputWrapper>

        <FilterButtonWrapper>
          <FilterButton
            type='button'
            onClick={() => setPainelFiltrosAberto(true)}
            data-testid='btn-abrir-filtros'
          >
            <SlidersIcon />
            <span>Filtros</span>
          </FilterButton>
          {quantidadeFiltros > 0 && (
            <FilterBadge data-testid='badge-filtros'>{quantidadeFiltros}</FilterBadge>
          )}
        </FilterButtonWrapper>
      </SearchFilterRow>

      {loading ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}
          data-testid='loading-spinner'
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      ) : inscricoes.length === 0 ? (
        <EmptyStateContainer data-testid='empty-state'>
          <EmptyStateText>
            Você não está inscrito em nenhuma formação no momento. Explore as formações disponíveis
            clicando no botão abaixo.
          </EmptyStateText>
          <EmptyStateButton
            type='button'
            onClick={() => navigate(ROUTES.AREA_PUBLICA)}
            data-testid='btn-empty-explorar'
          >
            Explorar formações disponíveis
          </EmptyStateButton>
        </EmptyStateContainer>
      ) : (
        <>
          <CardsList data-testid='cards-list'>
            {inscricoes.map((item) => (
              <CardInscricaoMobile
                key={item.id}
                record={item}
                onExibirDetalhes={(rec) => setDetalhesRecord(rec)}
                onCancelarInscricao={handleCancelarInscricao}
                mostrarCancelar={abaAtiva === 'andamento'}
              />
            ))}
          </CardsList>

          <PaginationSection>
            {inscricoes.length < totalRegistros && (
              <ExibirMaisButton
                type='button'
                disabled={loadingMais}
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
            )}

            <ContadorInscricoes data-testid='contador-inscricoes'>
              Exibindo {inscricoes.length} de {totalRegistros} inscrições
            </ContadorInscricoes>
          </PaginationSection>
        </>
      )}

      <MinhasInscricoesFiltrosMobile
        open={painelFiltrosAberto}
        abaAtiva={abaAtiva}
        filtros={filtrosAvancados}
        onClose={() => setPainelFiltrosAberto(false)}
        onApply={handleApplyFiltros}
        onClear={handleClearFiltros}
      />

      <ModalDetalhesInscricao
        open={Boolean(detalhesRecord)}
        record={detalhesRecord}
        onClose={() => setDetalhesRecord(null)}
        onCancelar={handleCancelarInscricao}
        mostrarCancelar={abaAtiva === 'andamento'}
      />
    </Container>
  );
};

export default MinhasInscricoesMobile;
