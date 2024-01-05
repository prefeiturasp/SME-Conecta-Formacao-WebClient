import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Typography from 'antd/es/typography/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_CODIGO_FORMACAO, CF_INPUT_NUMERO_HOMOLOGACAO } from '~/core/constants/ids/input';
import { DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import SelectNomeFormacao from './components/input/nome-formacao';
import { MinhasInscricoesListaPaginada } from './listagem';

export interface FiltersProps {
  id: number | null;
  nomeFormacao: string | null;
  numeroHomologacao: number | null;
}

export const Inscricoes = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const permissao = obterPermissaoPorMenu(MenuEnum.Formacoes);

  const [filters, setFilters] = useState<FiltersProps>({
    id: null,
    nomeFormacao: null,
    numeroHomologacao: null,
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          form.submit();
        },
        onCancel() {
          navigate(ROUTES.AREA_PUBLICA);
        },
      });
    } else {
      navigate(ROUTES.AREA_PUBLICA);
    }
  };

  const obterFiltros = () => {
    setFilters({
      id: form.getFieldValue('codigoFormacao'),
      nomeFormacao: form.getFieldValue('nomeFormacao'),
      numeroHomologacao: form.getFieldValue('numeroHomologacao'),
    });
  };

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <HeaderPage title={`Inscrições`}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <InputNumero
                  formItemProps={{
                    label: 'Código',
                    name: 'codigoFormacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    maxLength: 100,
                    onChange: obterFiltros,
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação',
                  }}
                />
              </Col>

              <Col xs={24} sm={8}>
                <SelectNomeFormacao />
              </Col>

              <Col xs={24} sm={8}>
                <InputNumero
                  formItemProps={{
                    label: 'Número de homologação',
                    name: 'numeroHomologacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    maxLength: 100,
                    onChange: obterFiltros,
                    id: CF_INPUT_NUMERO_HOMOLOGACAO,
                    placeholder: 'Número de homologação',
                  }}
                />
              </Col>

              <Col xs={24}>
                <Typography style={{ marginBottom: 12, fontWeight: 'bold' }}>
                  Listagem de cursos/turmas
                </Typography>
                <MinhasInscricoesListaPaginada filters={filters} />
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
