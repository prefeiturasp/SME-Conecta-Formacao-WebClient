// src/components/lib/drawer/atualizacao-inscritos/drawer-atualizacao-inscritos.tsx
import { Button, Drawer, Form, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { confirmacao } from '~/core/services/alerta-service';
import { FormularioAtualizacaoInscritos, InscritoAtualizacaoDTO } from '~/core/dto/atualizacao-inscritos-dto';
import CardInscrito from './card-inscrito';

const { Text } = Typography;

type DrawerAtualizacaoInscritosProps = {
  openModal: boolean;
  onCloseModal: () => void;
  onSave: (inscritosAtualizados: InscritoAtualizacaoDTO[]) => void;
  inscritos: InscritoAtualizacaoDTO[];
};

const DrawerAtualizacaoInscritos: React.FC<DrawerAtualizacaoInscritosProps> = ({
  openModal,
  onCloseModal,
  onSave,
  inscritos,
}) => {
  const [formDrawer] = Form.useForm<FormularioAtualizacaoInscritos>();
  const [desativarBotaoCancelar, setDesativarBotaoCancelar] = useState(true);

  useEffect(() => {
    if (openModal && inscritos?.length > 0) {
      formDrawer.setFieldsValue({ inscritos });
      setDesativarBotaoCancelar(true);
    }
  }, [openModal, inscritos, formDrawer]);

  const validarAlteracaoEmCampos = () => {
    const isTouched = formDrawer.isFieldsTouched();
    setDesativarBotaoCancelar(!isTouched);
  };

  const salvarDadosForm = (values: FormularioAtualizacaoInscritos) => {
    // Delega o processamento e a chamada da API para o componente pai
    onSave(values.inscritos);
    formDrawer.resetFields();
  };

  const fecharModal = () => {
    if (!desativarBotaoCancelar) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          onCloseModal();
          formDrawer.resetFields();
        },
      });
    } else {
      onCloseModal();
      formDrawer.resetFields();
    }
  };

  return (
    <>
      {openModal && (
        <Drawer
          title="Atualização de inscritos"
          size="large"
          width={700}
          onClose={fecharModal}
          open
          extra={
            <Space>
              <Button onClick={fecharModal}>
                Cancelar
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: '#f4803b', borderColor: '#f4803b' }}
                onClick={() => {
                  formDrawer.validateFields().then(salvarDadosForm);
                }}
              >
                Atualizar inscritos
              </Button>
            </Space>
          }
        >
          <div style={{ marginBottom: 24 }}>
            <Text type="secondary">
              Atualize as informações dos novos inscritos. É necessário inserir os dados de frequência, 
              atividade obrigatória, conceito final e aprovação antes de enviar à Divisão de Formação (DF).
            </Text>
          </div>

          <Form
            form={formDrawer}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Form.List name="inscritos">
              {(fields) => (
                <>
                  {fields.map(({ key, name }) => {
                    const inscritoData = formDrawer.getFieldValue(['inscritos', name]);

                    return (
                      <CardInscrito
                        key={key}
                        name={name}
                        nome={inscritoData?.nome ?? ''}
                        documento={inscritoData?.documento ?? ''}
                        onChangeForm={validarAlteracaoEmCampos}
                      />
                    );
                  })}
                </>
              )}
            </Form.List>
          </Form>
        </Drawer>
      )}
    </>
  );
};

export default DrawerAtualizacaoInscritos;