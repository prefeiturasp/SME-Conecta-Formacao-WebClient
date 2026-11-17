import React from 'react';
import styled from 'styled-components';
import { Input, Select, DatePicker } from 'antd';
import ptBR from 'antd/es/date-picker/locale/pt_BR';
import 'dayjs/locale/pt-br';
import type { Dayjs } from 'dayjs';
import MobileFilterPanel from '~/components/main/mobile-filter-panel';

export interface FiltrosMinhasInscricoesValues {
  CodigoFormacao?: string | number;
  NomeFormacao?: string;
  DataInscricao?: Dayjs | null;
  NomeTurma?: string;
  DataInicial?: Dayjs | null;
  DataFinal?: Dayjs | null;
  Situacao?: number;
  SituacaoInscricao?: number;
  SituacaoAprovacao?: number;
}

export interface MinhasInscricoesFiltrosMobileProps {
  open: boolean;
  abaAtiva: 'andamento' | 'finalizadas';
  filtros: FiltrosMinhasInscricoesValues;
  onClose: () => void;
  onApply: (filtros: FiltrosMinhasInscricoesValues) => void;
  onClear: () => void;
}

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.2;
`;

const DateRangeWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  .ant-picker {
    flex: 1;
    min-width: 0;
  }
`;

const StyledInput = styled(Input)`
  height: 40px;
  border-radius: 8px;
  border-color: #dadada;

  &::placeholder {
    color: #bfbfc2;
  }

  &:hover,
  &:focus {
    border-color: #ff9a52;
  }
`;

const StyledSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    height: 40px !important;
    padding: 4px 11px !important;
    border-radius: 8px !important;
    border-color: #dadada !important;
    display: flex !important;
    align-items: center !important;
  }

  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: #ff9a52 !important;
  }

  .ant-select-selection-placeholder {
    color: #bfbfc2 !important;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  height: 40px;
  width: 100%;
  border-radius: 8px;
  border-color: #dadada;

  input::placeholder {
    color: #bfbfc2;
  }

  &:hover,
  &:focus {
    border-color: #ff9a52;
  }
`;

export const situacoesOptions = [
  { label: 'Confirmada', value: 1 },
  { label: 'Enviada', value: 2 },
  { label: 'Aguardando a análise', value: 3 },
  { label: 'Cancelada', value: 4 },
  { label: 'Em espera', value: 5 },
  { label: 'Transferida', value: 6 },
];

export const situacaoAprovacaoOptions = [
  { label: 'Aprovado', value: 1 },
  { label: 'Reprovado', value: 2 },
  { label: 'Não inscrito', value: 3 },
];

export const contarFiltrosAplicados = (
  filtros: FiltrosMinhasInscricoesValues,
  abaAtiva: 'andamento' | 'finalizadas',
): number => {
  let count = 0;

  if (abaAtiva === 'andamento') {
    if (
      filtros.CodigoFormacao !== undefined &&
      filtros.CodigoFormacao !== null &&
      filtros.CodigoFormacao !== ''
    ) {
      count += 1;
    }
    if (
      filtros.NomeFormacao !== undefined &&
      filtros.NomeFormacao !== null &&
      filtros.NomeFormacao.trim?.() !== ''
    ) {
      count += 1;
    }
    if (filtros.DataInscricao) {
      count += 1;
    }
    if (
      filtros.NomeTurma !== undefined &&
      filtros.NomeTurma !== null &&
      filtros.NomeTurma.trim?.() !== ''
    ) {
      count += 1;
    }
    if (filtros.DataInicial || filtros.DataFinal) {
      count += 1;
    }
    if (filtros.Situacao !== undefined && filtros.Situacao !== null) {
      count += 1;
    }
  } else {
    if (
      filtros.NomeFormacao !== undefined &&
      filtros.NomeFormacao !== null &&
      filtros.NomeFormacao.trim?.() !== ''
    ) {
      count += 1;
    }
    if (filtros.SituacaoInscricao !== undefined && filtros.SituacaoInscricao !== null) {
      count += 1;
    }
    if (filtros.SituacaoAprovacao !== undefined && filtros.SituacaoAprovacao !== null) {
      count += 1;
    }
    if (filtros.DataInicial || filtros.DataFinal) {
      count += 1;
    }
  }

  return count;
};

export const MinhasInscricoesFiltrosMobile: React.FC<MinhasInscricoesFiltrosMobileProps> = ({
  open,
  abaAtiva,
  filtros,
  onClose,
  onApply,
  onClear,
}) => {
  const [draftFiltros, setDraftFiltros] = React.useState<FiltrosMinhasInscricoesValues>(filtros);

  React.useEffect(() => {
    setDraftFiltros(filtros);
  }, [filtros, open]);

  const handleChange = (field: keyof FiltrosMinhasInscricoesValues, value: any) => {
    setDraftFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApply(draftFiltros);
  };

  const handleClear = () => {
    setDraftFiltros({});
    onClear();
  };

  return (
    <MobileFilterPanel
      open={open}
      onClose={onClose}
      onApply={handleApply}
      onClear={handleClear}
      title='Filtros'
      clearText='Limpar filtros'
      applyText='Buscar formações'
    >
      {abaAtiva === 'andamento' && (
        <>
          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-codigo'>Código da formação</FormLabel>
            <StyledInput
              id='mobile-filtro-codigo'
              placeholder='Digite o código da formação'
              value={draftFiltros.CodigoFormacao ?? ''}
              onChange={(e) => handleChange('CodigoFormacao', e.target.value)}
              allowClear
              data-testid='filtro-codigo-formacao'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-nome'>Nome da formação</FormLabel>
            <StyledInput
              id='mobile-filtro-nome'
              placeholder='Digite o nome da formação'
              value={draftFiltros.NomeFormacao ?? ''}
              onChange={(e) => handleChange('NomeFormacao', e.target.value)}
              allowClear
              data-testid='filtro-nome-formacao'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-data-inscricao'>Data da inscrição</FormLabel>
            <StyledDatePicker
              id='mobile-filtro-data-inscricao'
              placeholder='00/00/0000'
              format='DD/MM/YYYY'
              locale={ptBR}
              value={draftFiltros.DataInscricao}
              onChange={(val) => handleChange('DataInscricao', val)}
              allowClear
              data-testid='filtro-data-inscricao'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-turma'>Turma</FormLabel>
            <StyledInput
              id='mobile-filtro-turma'
              placeholder='Digite a turma'
              value={draftFiltros.NomeTurma ?? ''}
              onChange={(e) => handleChange('NomeTurma', e.target.value)}
              allowClear
              data-testid='filtro-turma'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Período de realização da formação</FormLabel>
            <DateRangeWrapper>
              <StyledDatePicker
                placeholder='Data inicial'
                format='DD/MM/YYYY'
                locale={ptBR}
                value={draftFiltros.DataInicial}
                onChange={(val) => handleChange('DataInicial', val)}
                allowClear
                data-testid='filtro-data-inicial'
              />
              <StyledDatePicker
                placeholder='Data final'
                format='DD/MM/YYYY'
                locale={ptBR}
                value={draftFiltros.DataFinal}
                onChange={(val) => handleChange('DataFinal', val)}
                allowClear
                data-testid='filtro-data-final'
              />
            </DateRangeWrapper>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-situacao'>Situação</FormLabel>
            <StyledSelect
              id='mobile-filtro-situacao'
              placeholder='Selecione'
              options={situacoesOptions}
              value={draftFiltros.Situacao}
              onChange={(val) => handleChange('Situacao', val)}
              allowClear
              data-testid='filtro-situacao'
            />
          </FormGroup>
        </>
      )}

      {abaAtiva === 'finalizadas' && (
        <>
          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-nome-finalizadas'>Nome da formação</FormLabel>
            <StyledInput
              id='mobile-filtro-nome-finalizadas'
              placeholder='Digite o nome da formação'
              value={draftFiltros.NomeFormacao ?? ''}
              onChange={(e) => handleChange('NomeFormacao', e.target.value)}
              allowClear
              data-testid='filtro-nome-formacao-finalizadas'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-situacao-finalizadas'>
              Situação da inscrição
            </FormLabel>
            <StyledSelect
              id='mobile-filtro-situacao-finalizadas'
              placeholder='Selecione'
              options={situacoesOptions}
              value={draftFiltros.SituacaoInscricao}
              onChange={(val) => handleChange('SituacaoInscricao', val)}
              allowClear
              data-testid='filtro-situacao-finalizadas'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='mobile-filtro-situacao-aprovacao-finalizadas'>
              Situação de aprovação
            </FormLabel>
            <StyledSelect
              id='mobile-filtro-situacao-aprovacao-finalizadas'
              placeholder='Selecione'
              options={situacaoAprovacaoOptions}
              value={draftFiltros.SituacaoAprovacao}
              onChange={(val) => handleChange('SituacaoAprovacao', val)}
              allowClear
              data-testid='filtro-situacao-aprovacao-finalizadas'
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Período da formação</FormLabel>
            <DateRangeWrapper>
              <StyledDatePicker
                placeholder='Data inicial'
                format='DD/MM/YYYY'
                locale={ptBR}
                value={draftFiltros.DataInicial}
                onChange={(val) => handleChange('DataInicial', val)}
                allowClear
                data-testid='filtro-data-inicial-finalizadas'
              />
              <StyledDatePicker
                placeholder='Data final'
                format='DD/MM/YYYY'
                locale={ptBR}
                value={draftFiltros.DataFinal}
                onChange={(val) => handleChange('DataFinal', val)}
                allowClear
                data-testid='filtro-data-final-finalizadas'
              />
            </DateRangeWrapper>
          </FormGroup>
        </>
      )}
    </MobileFilterPanel>
  );
};

export default MinhasInscricoesFiltrosMobile;
