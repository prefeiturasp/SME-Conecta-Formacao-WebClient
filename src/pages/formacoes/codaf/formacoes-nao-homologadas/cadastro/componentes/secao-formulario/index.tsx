import { Row, Col, Form, Select } from "antd";
import InputNumero from "~/components/main/numero";
import InputTexto from "~/components/main/text/input-text";
import { CF_INPUT_NUMERO_HOMOLOGACAO, CF_INPUT_NOME_FORMACAO, CF_INPUT_CODIGO_FORMACAO } from "~/core/constants/ids/input";
import { RetornoListagemDTO } from "~/core/dto/retorno-listagem-dto";

interface SecaoFormularioProps {
  onChangeCodigoFormacao: (value: string) => void;
  onBlurCodigoFormacao: (value: string) => void;
  turmasFiltradas: RetornoListagemDTO[];
  turmaDisabled: boolean;
  camposBloqueados: {
    numeroHomologacao: boolean;
    turma: boolean;
  };
}

export const SecaoFormulario: React.FC<SecaoFormularioProps> = ({
  onChangeCodigoFormacao,
  onBlurCodigoFormacao,
  turmasFiltradas,
  turmaDisabled,
  camposBloqueados
}) => {
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
                disabled: false,
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
                label: 'Número de homologação',
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
                }))}
                disabled={(camposBloqueados.turma ?? turmaDisabled)}
                allowClear
              />
            </Form.Item>
          </b>
        </Col>
      </Row>
    </div>
  );
};