import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import React, { useEffect } from 'react';
import { RegrasAprovacaoCursistaCodafDto } from '~/core/dto/cursista-dto';
import { calcularAprovacao } from '~/core/utils/codaf-utils';

export interface DadosLoteCursistas {
  frequencia: number;
  atividade: string; // 'S' | 'N'
  conceitoFinal: string; // 'P' | 'S' | 'NS'
  aprovado: boolean;
}

interface DrawerEdicaoLoteCursistasProps {
  open: boolean;
  modo: 'registrar' | 'editar';
  quantidadeSelecionados: number;
  loading: boolean;
  onClose: () => void;
  onConfirmar: (dados: DadosLoteCursistas) => void | Promise<void>;
  regrasAprovacao?: RegrasAprovacaoCursistaCodafDto;
}

export const DrawerEdicaoLoteCursistas: React.FC<DrawerEdicaoLoteCursistasProps> = ({
  open,
  modo,
  quantidadeSelecionados,
  loading,
  onClose,
  onConfirmar,
  regrasAprovacao,
}) => {
  const [form] = Form.useForm();

  const frequencia = Form.useWatch('frequencia', form);
  const atividade = Form.useWatch('atividade', form);
  const conceitoFinal = Form.useWatch('conceitoFinal', form);
  const aprovado = Form.useWatch('aprovado', form);

  useEffect(() => {
    if (regrasAprovacao?.possuiRegraAvaliacao) {
      const freqNum = frequencia ? parseInt(String(frequencia).replace(/\D/g, ''), 10) : null;
      
      if (freqNum !== null || atividade || conceitoFinal) {
        const resultadoAprovacao = calcularAprovacao(freqNum, conceitoFinal, atividade, regrasAprovacao);
        if (resultadoAprovacao !== null) {
          form.setFieldValue('aprovado', resultadoAprovacao ? 'S' : 'N');
        }
      }
    }
  }, [frequencia, atividade, conceitoFinal, regrasAprovacao, form]);

  const todosCamposPreenchidos =
    frequencia !== undefined &&
    frequencia !== null &&
    frequencia !== '' &&
    !!atividade &&
    !!conceitoFinal &&
    !!aprovado;

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
    const frequenciaNumerica = Math.min(
      Number.parseInt(String(values.frequencia).replaceAll(/\D/g, ''), 10),
      100,
    );

    await onConfirmar({
      frequencia: frequenciaNumerica,
      atividade: values.atividade,
      conceitoFinal: values.conceitoFinal,
      aprovado: values.aprovado === 'S',
    });
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
          name='frequencia'
          label={<span style={{ fontWeight: 700 }}>Frequência (%)</span>}
          rules={[{ required: true, message: 'Informe a frequência' }]}
        >
          <Input placeholder='Digite a frequência...' maxLength={4} />
        </Form.Item>

        <Form.Item
          name='atividade'
          label={<span style={{ fontWeight: 700 }}>Atividade obrigatória</span>}
          rules={[{ required: true, message: 'Selecione a atividade' }]}
        >
          <Select
            placeholder='Selecione'
            options={[
              { label: 'Sim', value: 'S' },
              { label: 'Não', value: 'N' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name='conceitoFinal'
          label={<span style={{ fontWeight: 700 }}>Conceito final</span>}
          rules={[{ required: true, message: 'Selecione o conceito final' }]}
        >
          <Select
            placeholder='Selecione'
            options={[
              { label: 'Plenamente satisfatório', value: 'P' },
              { label: 'Satisfatório', value: 'S' },
              { label: 'Não satisfatório', value: 'NS' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name='aprovado'
          label={<span style={{ fontWeight: 700 }}>Aprovado</span>}
          rules={[{ required: true, message: 'Selecione se aprovado' }]}
        >
          <Select
            placeholder='Selecione'
            options={[
              { label: 'Sim', value: 'S' },
              { label: 'Não', value: 'N' },
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