import { Button, Drawer, Form, Select, Space } from 'antd';
import React, { useEffect } from 'react';

export interface DadosLoteCursistas {
  participou: boolean;
}

interface DrawerEdicaoLoteCursistasProps {
  open: boolean;
  modo: 'registrar' | 'editar';
  quantidadeSelecionados: number;
  loading: boolean;
  onClose: () => void;
  onConfirmar: (dados: DadosLoteCursistas) => void | Promise<void>;
}

export const DrawerEdicaoLoteCursistas: React.FC<DrawerEdicaoLoteCursistasProps> = ({
  open,
  modo,
  quantidadeSelecionados,
  loading,
  onClose,
  onConfirmar,
}) => {
  const [form] = Form.useForm();

  const participou = Form.useWatch('participou', form);

  const todosCamposPreenchidos =
    participou !== undefined && participou !== null;

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const titulo = modo === 'registrar' ? 'Registrar dados' : 'Editar dados';
  const textoBotao = modo === 'registrar' ? 'Registrar' : 'Salvar alterações';

  const textoAplicacaoValores =
    modo === 'editar'
      ? 'Os valores informados serão aplicados a todos os cursistas selecionados, independentemente de possuírem ou não informações já preenchidas. Campos existentes serão substituídos pelos novos valores.'
      : `Os valores informados serão aplicados a todos os ${quantidadeSelecionados} cursistas selecionados.`;

  const handleFinish = async (values: any) => {
    await onConfirmar({ participou: values.participou });
  };

  return (
    <Drawer
      title={titulo}
      open={open}
      onClose={onClose}
      width={609}
      extra={
        <Space>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type='primary'
            onClick={() => form.submit()}
            loading={loading}
            disabled={!todosCamposPreenchidos}
          >
            {textoBotao}
          </Button>
        </Space>
      }
    >
      <p style={{ marginBottom: 16 }}>{textoAplicacaoValores}</p>

      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item
          name='participou'
          label={<span style={{ fontWeight: 700 }}>Participou</span>}
          rules={[{ required: true, message: 'Selecione se participou' }]}
        >
          <Select
            placeholder='Selecione'
            options={[
              { label: 'Sim', value: true },
              { label: 'Não', value: false },
            ]}
          />
        </Form.Item>
      </Form>
      
      {modo === 'editar' && (
        <div
          style={{
            backgroundColor: '#ff9a52',
            color: '#fff',
            borderRadius: 4,
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          Atenção! Os valores informados substituirão as informações atuais dos cursistas
          selecionados.
        </div>
      )}
      
    </Drawer>
  );
};