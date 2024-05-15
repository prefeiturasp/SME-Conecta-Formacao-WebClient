import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary } from '~/components/lib/button/primary';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputCPF from '~/components/main/input/cpf';
import { SelectSituacaoRedeParceriaUsuario } from '~/components/main/input/situacao-rede-parceria-usuario';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME_FORMACAO } from '~/core/constants/ids/input';
import { validateMessages } from '~/core/constants/validate-messages';
import { AreaPromotoraTipoEnum } from '~/core/enum/area-promotora-tipo';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';
import { UsuarioRedeParceriaListaPaginada } from './listagem';

export interface FiltroUsuarioRedeParceriaProps {
  areaPromotora: AreaPromotoraTipoEnum | null;
  nome: number | null;
  cpf: string | null;
  situacao: string | null;
}

export const UsuarioRedeParceria = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FiltroUsuarioRedeParceriaProps>({
    areaPromotora: null,
    nome: null,
    cpf: null,
    situacao: null,
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const obterFiltros = () => {
    const areaPromotora = form.getFieldValue('areaPromotora');
    const nome = form.getFieldValue('nome');
    const cpf = form.getFieldValue('cpf');
    const situacao = form.getFieldValue('situacao');

    setFilters({
      areaPromotora,
      nome,
      cpf,
      situacao,
    });
  };

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <HeaderPage title='Listagem de usuários'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              <Col>
                <ButtonPrimary
                  id={CF_BUTTON_NOVO}
                  onClick={() =>
                    onClickVoltar({ navigate, route: ROUTES.USUARIO_REDE_PARCERIA_NOVO })
                  }
                >
                  Novo
                </ButtonPrimary>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8} md={6}>
                <SelectAreaPromotora />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <InputTexto
                  formItemProps={{
                    label: 'Nome do usuário',
                    name: 'nome',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome do usuário',
                    maxLength: 100,
                    onChange: obterFiltros,
                  }}
                />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <InputCPF />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <SelectSituacaoRedeParceriaUsuario />
              </Col>

              <Col xs={24}>
                <UsuarioRedeParceriaListaPaginada filters={filters} />
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
