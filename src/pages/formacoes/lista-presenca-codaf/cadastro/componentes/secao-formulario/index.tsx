import { AutoComplete, Col, DatePicker, Form, Row, Select, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_CURSO_EOL,
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_CODIGO_NIVEL,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_COMUNICADO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
  CF_INPUT_PAGINA_COMUNICADO,
} from '~/core/constants/ids/input';
import { PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

interface SecaoFormularioProps {
  opcoesFormacao: PropostaAutocompletarDTO[];
  onSearchFormacao: (value: string) => void;
  onSelectFormacao: (value: string, option: any) => Promise<void>;
  loadingAutocomplete: boolean;
  turmasFiltradas: RetornoListagemDTO[];
  turmaDisabled: boolean;
  tooltipAberto: boolean;
  ehPerfilDF: boolean;
  ehPerfilEMFORPEF: boolean;
}

export const SecaoFormulario: React.FC<SecaoFormularioProps> = ({
  opcoesFormacao,
  onSearchFormacao,
  onSelectFormacao,
  loadingAutocomplete,
  turmasFiltradas,
  turmaDisabled,
  tooltipAberto,
  ehPerfilDF,
  ehPerfilEMFORPEF,
}) => {
  return (
    <div>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <b>
            <Form.Item
              label='Número de homologação'
              name='numeroHomologacao'
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
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
                notFoundContent={
                  loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada'
                }
              />
            </Form.Item>
          </b>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <b>
            <InputTexto
              formItemProps={{
                label: 'Nome da formação',
                name: 'nomeFormacao',
                rules: [{ required: true, message: 'Campo obrigatório' }],
              }}
              inputProps={{
                id: CF_INPUT_NOME_FORMACAO,
                placeholder: 'Nome da formação',
                maxLength: 200,
                disabled: true,
              }}
            />
          </b>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Código da formação',
                name: 'codigoFormacao',
                rules: [{ required: true, message: 'Campo obrigatório' }],
              }}
              inputProps={{
                id: CF_INPUT_CODIGO_FORMACAO,
                placeholder: 'Código da formação',
                maxLength: 20,
                disabled: true,
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <b>
            <Form.Item
              label={
                <span>
                  Turma{' '}
                  <Tooltip
                    title='Não é possível selecionar uma turma já inserida em um CODAF'
                    open={tooltipAberto || undefined}
                  >
                    <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help' }} />
                  </Tooltip>
                </span>
              }
              name='turmaId'
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Select
                placeholder='Selecione a turma'
                options={turmasFiltradas.map((turma) => ({
                  label: turma.descricao,
                  value: turma.id,
                }))}
                disabled={turmaDisabled}
                allowClear
              />
            </Form.Item>
          </b>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Número do comunicado',
                name: 'numeroComunicado',
              }}
              inputProps={{
                id: CF_INPUT_NUMERO_COMUNICADO,
                placeholder: 'Número do comunicado',
                maxLength: 20,
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <Form.Item label='Data da publicação' name='dataPublicacao'>
              <DatePicker
                placeholder='Selecione a data'
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                locale={locale}
              />
            </Form.Item>
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Página do comunicado no Diário Oficial',
                name: 'paginaComunicado',
              }}
              inputProps={{
                id: CF_INPUT_PAGINA_COMUNICADO,
                placeholder: 'Página do comunicado',
                maxLength: 10,
              }}
            />
          </b>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <Form.Item
              label='Data de publicação do Diário Oficial'
              name='dataPublicacaoDiarioOficial'
            >
              <DatePicker
                placeholder='Selecione a data'
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                locale={locale}
              />
            </Form.Item>
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputTexto
              formItemProps={{
                label: 'Código do curso no EOL',
                name: 'codigoCursoEol',
              }}
              inputProps={{
                id: CF_INPUT_CODIGO_CURSO_EOL,
                placeholder: 'Código do curso no EOL',
                maxLength: 50,
                disabled: ehPerfilDF || ehPerfilEMFORPEF,
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputTexto
              formItemProps={{
                label: 'Código do nível',
                name: 'codigoNivel',
              }}
              inputProps={{
                id: CF_INPUT_CODIGO_NIVEL,
                placeholder: 'Código do nível',
                maxLength: 50,
                disabled: ehPerfilDF || ehPerfilEMFORPEF,
              }}
            />
          </b>
        </Col>
      </Row>
    </div>
  );
};
