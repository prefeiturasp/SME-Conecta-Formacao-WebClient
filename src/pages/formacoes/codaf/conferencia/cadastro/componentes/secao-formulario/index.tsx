import { Col, DatePicker, Form, Row, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/pt_BR';
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
import { StatusCodafConferencia } from '~/core/enum/status-codaf-conferencia';

export interface TurmaConferenciaOptionDTO {
  id: number;
  descricao: string;
  possuiCodafConferencia?: boolean;
}

export interface SecaoFormularioConferenciaProps {
  onChangeCodigoFormacao: (value: string) => void;
  onBlurCodigoFormacao: (value: string) => void;
  onSelectTurma?: (turmaId: number) => void;
  turmasFiltradas: TurmaConferenciaOptionDTO[];
  turmaDisabled: boolean;
  camposBloqueados: {
    codigoFormacao: boolean;
    turma: boolean;
    camposPublicacao?: boolean;
  };
}

export const calcularSituacaoCodafConferencia = (
  codigoFormacao?: number | string | null,
  turmaId?: number | null,
  codigoCursoEol?: number | string | null,
  cursistas: { participou: boolean | null }[] = [],
  statusAtual?: number | null,
): StatusCodafConferencia => {
  if (statusAtual === StatusCodafConferencia.FINALIZADO) {
    return StatusCodafConferencia.FINALIZADO;
  }

  const possuiFormacao = Number(codigoFormacao) > 0;
  const possuiTurma = Number(turmaId) > 0;
  const possuiCodigoEol =
    codigoCursoEol !== null &&
    codigoCursoEol !== undefined &&
    String(codigoCursoEol).trim() !== '' &&
    Number(codigoCursoEol) > 0;
  const possuiInscritosPreenchidos =
    cursistas.length > 0 &&
    cursistas.every((c) => c.participou === true || c.participou === false);

  if (possuiFormacao && possuiTurma && possuiCodigoEol && possuiInscritosPreenchidos) {
    return StatusCodafConferencia.AGUARDANDO_FINALIZACAO;
  }

  return StatusCodafConferencia.INICIADO;
};

export const SecaoFormularioConferencia: React.FC<SecaoFormularioConferenciaProps> = ({
  onChangeCodigoFormacao,
  onBlurCodigoFormacao,
  onSelectTurma,
  turmasFiltradas,
  turmaDisabled,
  camposBloqueados,
}) => {
  const desabilitarPublicacao = camposBloqueados.camposPublicacao ?? false;

  return (
    <div>
      <Row gutter={[16, 8]}>
        <Col xs={24}>
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
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
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
                maxLength: 19,
                disabled: camposBloqueados.codigoFormacao,
                onChange: (e) => onChangeCodigoFormacao(e.target.value),
                onBlur: (e) => onBlurCodigoFormacao(e.target.value),
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Código de homologação',
                name: 'numeroHomologacao',
                rules: [{ required: false }],
              }}
              inputProps={{
                id: CF_INPUT_NUMERO_HOMOLOGACAO,
                placeholder: '00000',
                maxLength: 20,
                disabled: true,
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <Form.Item
              label='Turma'
              name='turmaId'
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Select
                placeholder='Selecione a turma'
                options={turmasFiltradas.map((turma) => ({
                  label: turma.descricao,
                  value: turma.id,
                  disabled: !!turma.possuiCodafConferencia,
                }))}
                disabled={camposBloqueados.turma || turmaDisabled}
                onChange={(val) => onSelectTurma?.(val)}
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
                maxLength: 4,
                disabled: desabilitarPublicacao,
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <Form.Item label='Data do comunicado' name='dataComunicado'>
              <DatePicker
                placeholder='Selecione a data'
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                locale={locale}
                disabled={desabilitarPublicacao}
              />
            </Form.Item>
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Página do comunicado do diário oficial',
                name: 'paginaComunicadoDom',
              }}
              inputProps={{
                id: CF_INPUT_PAGINA_COMUNICADO,
                placeholder: 'Página do comunicado',
                maxLength: 4,
                disabled: desabilitarPublicacao,
              }}
            />
          </b>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <Form.Item label='Data de publicação do diário oficial' name='dataPublicacaoDom'>
              <DatePicker
                placeholder='Selecione a data'
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                locale={locale}
                disabled={desabilitarPublicacao}
              />
            </Form.Item>
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Código Curso EOL',
                name: 'codigoCursoEol',
              }}
              inputProps={{
                id: CF_INPUT_CODIGO_CURSO_EOL,
                placeholder: 'Código Curso EOL',
                maxLength: 9,
                disabled: desabilitarPublicacao,
              }}
            />
          </b>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: 'Código do nível',
                name: 'codigoNivel',
              }}
              inputProps={{
                id: CF_INPUT_CODIGO_NIVEL,
                placeholder: 'Código do nível',
                maxLength: 9,
                disabled: desabilitarPublicacao,
              }}
            />
          </b>
        </Col>
      </Row>
    </div>
  );
};
