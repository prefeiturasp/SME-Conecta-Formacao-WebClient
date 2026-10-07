import { Form, FormInstance } from 'antd';
import ptBR from 'antd/es/date-picker/locale/pt_BR';
import type { Dayjs } from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import MobileFilterPanel from '~/components/main/mobile-filter-panel';
import {
  obterAreaPromotoraPublico,
  obterFormatoPublico,
  obterPalavraChavePublico,
  obterPublicoAlvoPublico,
} from '~/core/services/area-publica-service';
import {
  DateRangeWrapper,
  FormGroup,
  FormLabel,
  StyledDatePicker,
  StyledInput,
  StyledSelect,
} from '../../styles';
import { filterOptionInsensitive } from '../../utils';

export interface FiltroFormacaoMobilePanelProps {
  open: boolean;
  form?: FormInstance;
  onClose: () => void;
  onLimpar?: () => void;
}

export const FiltroFormacaoMobilePanel: FC<FiltroFormacaoMobilePanelProps> = ({
  open,
  form,
  onClose,
  onLimpar,
}) => {
  const [dataInicial, setDataInicial] = useState<Dayjs | null>(null);
  const [dataFinal, setDataFinal] = useState<Dayjs | null>(null);

  const [opcoesPublicoAlvo, setOpcoesPublicoAlvo] = useState<{ label: string; value: number }[]>([]);
  const [opcoesAreaPromotora, setOpcoesAreaPromotora] = useState<{ label: string; value: number }[]>([]);
  const [opcoesFormato, setOpcoesFormato] = useState<{ label: string; value: number }[]>([]);
  const [opcoesPalavraChave, setOpcoesPalavraChave] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    obterPublicoAlvoPublico().then((resp) => {
      if (resp.sucesso) {
        setOpcoesPublicoAlvo(
          resp.dados.map((item) => ({
            label: item.nome ?? '',
            value: item.id,
          })),
        );
      }
    });

    obterAreaPromotoraPublico().then((resp) => {
      if (resp.sucesso) {
        setOpcoesAreaPromotora(
          resp.dados.map((item) => ({
            label: item.descricao ?? (item as any).nome ?? '',
            value: item.id,
          })),
        );
      }
    });

    obterFormatoPublico().then((resp) => {
      if (resp.sucesso) {
        setOpcoesFormato(
          resp.dados.map((item) => ({
            label: item.descricao ?? (item as any).nome ?? '',
            value: item.id,
          })),
        );
      }
    });

    obterPalavraChavePublico().then((resp) => {
      if (resp.sucesso) {
        setOpcoesPalavraChave(
          resp.dados.map((item) => ({
            label: item.descricao ?? (item as any).nome ?? '',
            value: item.id,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (open) {
      const dataForm = form?.getFieldValue('data');
      if (Array.isArray(dataForm) && dataForm.length === 2) {
        setDataInicial(dataForm[0]);
        setDataFinal(dataForm[1]);
      }
    }
  }, [open, form]);

  const handleLimparFiltros = () => {
    setDataInicial(null);
    setDataFinal(null);
    if (form) {
      form.resetFields();
    }
    if (onLimpar) {
      onLimpar();
    }
    onClose();
  };

  const handleBuscarDrawer = () => {
    if (form) {
      const dataArr = dataInicial && dataFinal ? [dataInicial, dataFinal] : undefined;
      form.setFieldsValue({ data: dataArr });
      form.submit();
    }
    onClose();
  };

  const onChangeDataInicial = (val: Dayjs | null) => {
    setDataInicial(val);
    if (form) {
      form.setFieldsValue({ data: val && dataFinal ? [val, dataFinal] : undefined });
    }
  };

  const onChangeDataFinal = (val: Dayjs | null) => {
    setDataFinal(val);
    if (form) {
      form.setFieldsValue({ data: dataInicial && val ? [dataInicial, val] : undefined });
    }
  };

  return (
    <MobileFilterPanel
      open={open}
      onClose={onClose}
      onClear={handleLimparFiltros}
      onApply={handleBuscarDrawer}
      title='Filtros'
      clearText='Limpar filtros'
      applyText='Buscar formações'
    >
      {/* 1. Público alvo */}
      <FormGroup>
        <FormLabel>Público alvo</FormLabel>
        <Form.Item name='publicosAlvosIds' noStyle>
          <StyledSelect
            mode='multiple'
            maxTagCount='responsive'
            placeholder='Selecione'
            options={opcoesPublicoAlvo}
            allowClear
            showSearch
            filterOption={filterOptionInsensitive}
          />
        </Form.Item>
      </FormGroup>

      {/* 2. Título */}
      <FormGroup>
        <FormLabel>Título</FormLabel>
        <Form.Item name='titulo' noStyle>
          <StyledInput
            placeholder='Digite o título...'
            maxLength={100}
            allowClear
          />
        </Form.Item>
      </FormGroup>

      {/* 3. Código da formação */}
      <FormGroup>
        <FormLabel>Código da formação</FormLabel>
        <Form.Item name='codigoFormacao' noStyle>
          <StyledInput
            placeholder='Exemplo: 1234567'
            maxLength={50}
            allowClear
          />
        </Form.Item>
      </FormGroup>

      {/* 4. Código da homologação */}
      <FormGroup>
        <FormLabel>Código da homologação</FormLabel>
        <Form.Item name='codigoHomologacao' noStyle>
          <StyledInput
            placeholder='Exemplo: 1234567'
            maxLength={50}
            allowClear
          />
        </Form.Item>
      </FormGroup>

      {/* 5. Área promotora */}
      <FormGroup>
        <FormLabel>Área promotora</FormLabel>
        <Form.Item name='areasPromotorasIds' noStyle>
          <StyledSelect
            mode='multiple'
            maxTagCount='responsive'
            placeholder='Selecione'
            options={opcoesAreaPromotora}
            allowClear
            showSearch
            filterOption={filterOptionInsensitive}
          />
        </Form.Item>
      </FormGroup>

      {/* 6. Data */}
      <FormGroup>
        <FormLabel>Data</FormLabel>
        <DateRangeWrapper>
          <StyledDatePicker
            placeholder='00/00/0000'
            format='DD/MM/YYYY'
            locale={ptBR}
            value={dataInicial}
            onChange={onChangeDataInicial}
          />
          <StyledDatePicker
            placeholder='00/00/0000'
            format='DD/MM/YYYY'
            locale={ptBR}
            value={dataFinal}
            onChange={onChangeDataFinal}
          />
        </DateRangeWrapper>
      </FormGroup>

      {/* 7. Formato (Traz as labels com item.descricao) */}
      <FormGroup>
        <FormLabel>Formato</FormLabel>
        <Form.Item name='formatosIds' noStyle>
          <StyledSelect
            mode='multiple'
            maxTagCount='responsive'
            placeholder='Selecione'
            options={opcoesFormato}
            allowClear
            showSearch
            filterOption={filterOptionInsensitive}
          />
        </Form.Item>
      </FormGroup>

      {/* 8. Palavras-chave */}
      <FormGroup>
        <FormLabel>Palavras-chave</FormLabel>
        <Form.Item name='palavrasChavesIds' noStyle>
          <StyledSelect
            mode='multiple'
            maxTagCount='responsive'
            placeholder='Selecione'
            options={opcoesPalavraChave}
            allowClear
            showSearch
            filterOption={filterOptionInsensitive}
          />
        </Form.Item>
      </FormGroup>
    </MobileFilterPanel>
  );
};

export default FiltroFormacaoMobilePanel;
