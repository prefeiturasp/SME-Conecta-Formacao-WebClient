import { Button, Col, DatePicker, Form, Modal, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React from 'react';
import InputNumero from '~/components/main/numero';
import { notification } from '~/components/lib/notification';
import { deletarRetificacao } from '~/core/services/codaf-lista-presenca-service';

interface SecaoRetificacoesProps {
  retificacoes: number[];
  setRetificacoes: React.Dispatch<React.SetStateAction<number[]>>;
  contadorRetificacoes: number;
  setContadorRetificacoes: React.Dispatch<React.SetStateAction<number>>;
  retificacoesOriginais: Map<
    number,
    { id: number; dataRetificacao: string | null; paginaRetificacaoDom: number }
  >;
  setRetificacoesOriginais: React.Dispatch<
    React.SetStateAction<
      Map<number, { id: number; dataRetificacao: string | null; paginaRetificacaoDom: number }>
    >
  >;
  form: any;
}

const SecaoRetificacoes: React.FC<SecaoRetificacoesProps> = ({
  retificacoes,
  setRetificacoes,
  contadorRetificacoes,
  setContadorRetificacoes,
  retificacoesOriginais,
  setRetificacoesOriginais,
  form,
}) => {
  const adicionarNovaRetificacao = () => {
    const novoContador = contadorRetificacoes + 1;
    setContadorRetificacoes(novoContador);
    setRetificacoes([...retificacoes, novoContador]);
  };

  const excluirRetificacao = (numero: number) => {
    if (retificacoes.length === 1) {
      form.setFieldValue(`dataRetificacao${numero.toString().padStart(2, '0')}`, undefined);
      form.setFieldValue(`paginaRetificacao${numero.toString().padStart(2, '0')}`, undefined);
      return;
    }

    Modal.confirm({
      title: 'Excluir retificação',
      content: (
        <div>
          <p style={{ marginBottom: 8 }}>
            Deseja realmente excluir a{' '}
            <strong>Retificação {numero.toString().padStart(2, '0')}</strong>?
          </p>
          <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: 0 }}>
            Esta ação não poderá ser desfeita.
          </p>
        </div>
      ),
      okText: 'Excluir',
      cancelText: 'Cancelar',
      okButtonProps: {
        danger: true,
      },
      centered: true,
      onOk: async () => {
        try {
          const retificacaoOriginal = retificacoesOriginais.get(numero);

          if (retificacaoOriginal && retificacaoOriginal.id > 0) {
            const response = await deletarRetificacao(retificacaoOriginal.id);
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: 'Retificação excluída com sucesso',
              });
            } else {
              notification.error({
                message: 'Erro',
                description: response.mensagens?.[0] || 'Erro ao excluir retificação',
              });
              return;
            }
          }

          setRetificacoes(retificacoes.filter((r) => r !== numero));
          retificacoesOriginais.delete(numero);
          setRetificacoesOriginais(new Map(retificacoesOriginais));
          form.setFieldValue(`dataRetificacao${numero.toString().padStart(2, '0')}`, undefined);
          form.setFieldValue(`paginaRetificacao${numero.toString().padStart(2, '0')}`, undefined);
        } catch (error) {
          console.error('Erro ao excluir retificação:', error);
          notification.error({
            message: 'Erro',
            description: 'Erro ao excluir retificação',
          });
        }
      },
    });
  };

  return (
    <>
      <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '100%',
              color: '#42474A',
              marginBottom: 8,
            }}
          >
            Retificações
          </div>
          <p style={{ marginBottom: 16 }}>
            Caso haja retificações realizadas, insira nos campos abaixo. Caso seja necessário o
            registro de mais de uma, clique em &quot;Nova retificação&quot;.
          </p>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {retificacoes.map((numero) => (
          <Col
            key={numero}
            xs={24}
            sm={24}
            md={retificacoes.length === 1 ? 24 : 12}
            lg={retificacoes.length === 1 ? 24 : 12}
            xl={retificacoes.length === 1 ? 24 : 12}
          >
            <div
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ff9a52',
                  color: '#fff',
                  padding: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Retificação {numero.toString().padStart(2, '0')}</span>
                <Button
                  type='text'
                  icon={<DeleteOutlined />}
                  onClick={() => excluirRetificacao(numero)}
                  style={{
                    color: '#fff',
                    border: '1px solid #fff',
                    backgroundColor: '#ff9a52',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px',
                    height: 'auto',
                  }}
                >
                  Excluir
                </Button>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#fff' }}>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ fontWeight: 700 }}>Data da retificação</span>}
                      name={`dataRetificacao${numero.toString().padStart(2, '0')}`}
                    >
                      <DatePicker
                        format='DD/MM/YYYY'
                        placeholder='Selecione a data'
                        locale={locale}
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <InputNumero
                      formItemProps={{
                        label: 'Página da retificação',
                        name: `paginaRetificacao${numero.toString().padStart(2, '0')}`,
                      }}
                      inputProps={{
                        placeholder: 'Número da página',
                        maxLength: 10,
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
        <Col>
          <Button
            type='default'
            icon={<PlusOutlined />}
            onClick={adicionarNovaRetificacao}
            style={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              fontWeight: 500,
            }}
          >
            Nova retificação
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default SecaoRetificacoes;
