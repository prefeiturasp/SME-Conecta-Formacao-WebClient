import React from 'react';
import { Row, Col, Form, Select, DatePicker, Button, AutoComplete } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import InputTexto from '~/components/main/text/input-text';
import InputNumero from '~/components/main/numero';
import { SelectDRE } from '~/components/main/input/dre';
import {
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
  CF_INPUT_RF,
} from '~/core/constants/ids/input';
import { TipoDeclaracao, TipoDeclaracaoDescricao } from '~/core/enum/tipo-declaracao';
import { TipoCertificado, TipoCertificadoDescricao } from '~/core/enum/tipo-certificado';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { PropostaAutocompletarDTO } from '~/core/services/proposta-service';

export interface FiltrosPesquisaDocumentosProps {
  tipo: 'certificados' | 'declaracoes';
  rfCursistaDisabled: boolean;
  rfRegenteDisabled: boolean;
  turmaDisabled: boolean;
  turmas: RetornoListagemDTO[];
  loading: boolean;
  onClickFiltrar: () => void;
  onClickLimpar?: () => void;

  // Específico de Declarações
  aoMudarCodigoProposta?: () => void;
  aoSairDoCampoCodigoProposta?: (valor: string) => void;

  // Específico de Certificados
  onSearchFormacao?: (searchText: string) => void;
  onSelectFormacao?: (value: string, option: any) => void;
  opcoesFormacao?: PropostaAutocompletarDTO[];
  loadingAutocomplete?: boolean;
}

const FiltrosPesquisaDocumentos: React.FC<FiltrosPesquisaDocumentosProps> = ({
  tipo,
  rfCursistaDisabled,
  rfRegenteDisabled,
  turmaDisabled,
  turmas,
  loading,
  onClickFiltrar,
  onClickLimpar,
  aoMudarCodigoProposta,
  aoSairDoCampoCodigoProposta,
  onSearchFormacao,
  onSelectFormacao,
  opcoesFormacao = [],
  loadingAutocomplete,
}) => {
    const isDeclaracoes = tipo === 'declaracoes';
  const configuracao = isDeclaracoes
    ? {
        codigoDocumentoLabel: 'Código da declaração',
        codigoDocumentoName: 'codigoDeclaracao',
        dataEmissaoLabel: 'Data de emissão da declaração',
        dataPlaceholder: 'Selecione a data...',
        dreName: 'emissorId',
        nomeFormacaoPlaceholder: 'Nome da formação...',
        nomeCursistaPlaceholder: 'Ex: João da Silva',
        regenteLabel: 'RF ou CPF do regente',
        regentePlaceholder: '000.000.000-00',
        rfCursistaPlaceholder: '000.000.000-00',
        tamanhoCodigoFormacao: 19,
        tipoLabel: 'Tipo de declaração',
        tipoName: 'tipoDeclaracao',
        tipoOptions: Object.values(TipoDeclaracao)
          .filter((value): value is TipoDeclaracao => typeof value === 'number')
          .map((value) => ({ label: TipoDeclaracaoDescricao[value], value: Number(value) })),
        turmaPlaceholder: 'Selecione...',
        usuarioLogado: true,
      }
    : {
        codigoDocumentoLabel: 'Código do certificado',
        codigoDocumentoName: 'codigoCertificado',
        dataEmissaoLabel: 'Data de emissão do certificado',
        dataPlaceholder: 'Selecione a data',
        dreName: 'dreId',
        nomeFormacaoPlaceholder: 'Nome da formação',
        nomeCursistaPlaceholder: 'Nome do cursista',
        regenteLabel: 'RF do regente',
        regentePlaceholder: 'RF do regente',
        rfCursistaPlaceholder: 'RF ou CPF do cursista',
        tamanhoCodigoFormacao: 20,
        tipoLabel: 'Tipo de certificado',
        tipoName: 'tipoCertificado',
        tipoOptions: Object.values(TipoCertificado)
          .filter((value): value is TipoCertificado => typeof value === 'number')
          .map((value) => ({ label: TipoCertificadoDescricao[value], value: Number(value) })),
        turmaPlaceholder: 'Selecione a turma',
        usuarioLogado: false,
      };

  return (
    <>
      {/* Linha 1 */}
      <Row gutter={[16, 8]}>
        {!isDeclaracoes && (
          <p>
            Consulte os certificados emitidos para cursistas e regentes em formações já
            concluídas. Use os filtros para encontrar o que precisa com mais facilidade.
          </p>
        )}
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <InputTexto
            formItemProps={{
              label: 'Nome da formação',
              name: 'nomeFormacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_NOME_FORMACAO,
              placeholder: configuracao.nomeFormacaoPlaceholder,
              maxLength: 200,
              allowClear: true,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            label={configuracao.tipoLabel}
            name={configuracao.tipoName}
          >
            <Select
              placeholder='Selecione...'
              options={configuracao.tipoOptions}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Linha 2 */}
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <InputNumero
            formItemProps={{
              label: 'Código da formação',
              name: 'codigoFormacao',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_CODIGO_FORMACAO,
              placeholder: isDeclaracoes ? 'Código da formação...' : 'Código da formação',
              maxLength: configuracao.tamanhoCodigoFormacao,
              allowClear: true,
              onChange: isDeclaracoes ? aoMudarCodigoProposta : undefined,
              onBlur: isDeclaracoes
                ? (event: React.FocusEvent<HTMLInputElement>) =>
                    aoSairDoCampoCodigoProposta?.(event.target.value)
                : undefined,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          {isDeclaracoes ? (
            <InputTexto
              formItemProps={{
                label: 'Número de homologação da formação',
                name: 'numeroHomologacao',
                rules: [{ required: false }],
              }}
              inputProps={{
                id: CF_INPUT_NUMERO_HOMOLOGACAO,
                placeholder: 'Digite para buscar a formação...',
                maxLength: 100,
              }}
            />
          ) : (
            <Form.Item label='Número de homologação da formação' name='numeroHomologacao'>
              <AutoComplete
                id={CF_INPUT_NUMERO_HOMOLOGACAO}
                placeholder='Digite para buscar formação'
                allowClear
                onSearch={onSearchFormacao}
                onSelect={onSelectFormacao}
                options={opcoesFormacao.map((opcao) => ({
                  value: opcao.numeroHomologacao.toString(),
                  label: opcao.numeroHomologacao.toString(),
                  numeroHomologacao: opcao.numeroHomologacao,
                }))}
                filterOption={false}
                notFoundContent={
                  loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada'
                }
              />
            </Form.Item>
          )}
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
            <Select
              placeholder={configuracao.turmaPlaceholder}
              options={turmas.map((turma) => ({
                label: turma.descricao,
                value: turma.id,
              }))}
              disabled={turmaDisabled}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Linha 3 */}
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <InputNumero
            formItemProps={{
              label: configuracao.codigoDocumentoLabel,
              name: configuracao.codigoDocumentoName,
              rules: [{ required: false }],
            }}
            inputProps={{
              placeholder: `${configuracao.codigoDocumentoLabel}...`,
              maxLength: 100,
              allowClear: true,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <InputTexto
            formItemProps={{
              label: 'RF ou CPF do cursista',
              name: 'rfOuCpfCursista',
              rules: [{ required: false }],
            }}
            inputProps={{
              id: CF_INPUT_RF,
              placeholder: configuracao.rfCursistaPlaceholder,
              maxLength: 20,
              allowClear: true,
              disabled: rfCursistaDisabled,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <InputTexto
            formItemProps={{
              label: configuracao.regenteLabel,
              name: 'rfRegente',
              rules: [{ required: false }],
            }}
            inputProps={{
              placeholder: configuracao.regentePlaceholder,
              maxLength: 20,
              allowClear: true,
              disabled: rfRegenteDisabled,
            }}
          />
        </Col>
      </Row>

      {/* Linha 4 */}
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <InputTexto
            formItemProps={{
              label: 'Nome do cursista',
              name: 'nomeCursista',
              rules: [{ required: false }],
            }}
            inputProps={{
              placeholder: configuracao.nomeCursistaPlaceholder,
              maxLength: 200,
              allowClear: true,
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item
            label={configuracao.dataEmissaoLabel}
            name='dataEmissao'
          >
            <DatePicker
              placeholder={configuracao.dataPlaceholder}
              format='DD/MM/YYYY'
              style={{ width: '100%' }}
              locale={locale}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <SelectDRE
            formItemProps={{
              label: 'Diretoria Regional de Educação',
              name: configuracao.dreName,
              rules: [{ required: false }],
            }}
            exibirApenasDREsUsuarioLogado={configuracao.usuarioLogado}
            selectProps={{ mode: undefined, allowClear: true }}
            exibirOpcaoTodos
          />
        </Col>
      </Row>

      {/* Botões de ação */}
      <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
        {onClickLimpar && (
          <Col>
            <Button
              type='default'
              onClick={onClickLimpar}
              style={{
                fontWeight: 700,
                borderColor: '#FF9A52',
                color: '#FF9A52',
              }}
            >
              Limpar filtros
            </Button>
          </Col>
        )}
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
    </>
  );
};

export default FiltrosPesquisaDocumentos;
