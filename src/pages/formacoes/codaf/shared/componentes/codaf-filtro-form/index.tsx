import { AutoComplete, Button, Col, DatePicker, Form, FormInstance, Row, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import React from 'react';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

export interface SituacaoOpcao {
  id: number;
  descricao: string;
}

interface CodafFiltroFormProps {
  form: FormInstance;
  situacoes: SituacaoOpcao[];
  loading: boolean;
  opcoesFormacao: PropostaAutocompletarDTO[];
  loadingAutocomplete: boolean;
  turmasAPI: RetornoListagemDTO[];
  turmaDisabled: boolean;
  onSearchFormacao: (searchText: string) => void;
  onSelectFormacao: (value: string, option: any) => void;
  onClickFiltrar: () => void;
  onClickLimpar: () => void;
  /**
   * Rótulo e nome do campo de data. Exemplos:
   * - homologado: { label: 'Data de envio para DF', name: 'dataEnvio' }
   * - não homologado: { label: 'Data de envio para finalização', name: 'dataFinalizacao' }
   */
  campoData?: { label: string; name: string };
}

export const CodafFiltroForm: React.FC<CodafFiltroFormProps> = ({
  form,
  situacoes,
  loading,
  opcoesFormacao,
  loadingAutocomplete,
  turmasAPI,
  turmaDisabled,
  onSearchFormacao,
  onSelectFormacao,
  onClickFiltrar,
  onClickLimpar,
  campoData,
}) => {
  return (
    <Form form={form} layout='vertical' autoComplete='off'>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <InputTexto
            formItemProps={{
              label: 'Nome da formação',
              name: 'nomeFormacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_NOME_FORMACAO,
              placeholder: 'Nome da formação',
              maxLength: 100,
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <SelectAreaPromotora
            formItemProps={{ name: 'areaPromotoraId' }}
            selectProps={{ disabled: false }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <InputNumero
            formItemProps={{
              label: 'Código da formação',
              name: 'codigoFormacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_CODIGO_FORMACAO,
              placeholder: 'Código da formação',
              maxLength: 100,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item label='Número de homologação' name='numeroHomologacao'>
            <AutoComplete
              id={CF_INPUT_NUMERO_HOMOLOGACAO}
              placeholder='Digite para buscar formação'
              onSearch={onSearchFormacao}
              onSelect={onSelectFormacao}
              options={opcoesFormacao.map((opcao) => ({
                value: opcao.numeroHomologacao.toString(),
                label: opcao.numeroHomologacao.toString(),
                numeroHomologacao: opcao.numeroHomologacao,
              }))}
              filterOption={false}
              notFoundContent={loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada'}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
            <Select
              placeholder='Selecione a turma'
              options={turmasAPI.map((turma) => ({
                label: turma.descricao,
                value: turma.id,
              }))}
              disabled={turmaDisabled}
              allowClear
            />
          </Form.Item>
        </Col>
        {campoData && (
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Form.Item label={campoData.label} name={campoData.name}>
              <DatePicker
                placeholder='Selecione a data'
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                locale={locale}
              />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item label='Situação' name='situacao' rules={[{ required: false }]}>
            <Select
              placeholder='Selecione a situação'
              options={situacoes.map((s) => ({ label: s.descricao, value: s.id }))}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
        <Col>
          <Button
            type='default'
            onClick={onClickLimpar}
            style={{ fontWeight: 700, borderColor: '#ff6b35', color: '#ff6b35' }}
          >
            Limpar
          </Button>
        </Col>
        <Col>
          <Button
            type='primary'
            onClick={onClickFiltrar}
            loading={loading}
            style={{ fontWeight: 700 }}
          >
            Filtrar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
