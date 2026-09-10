import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import Modal from '~/components/lib/modal';
import { notification, openNotificationErrors } from '~/components/lib/notification';
import { salvarNumeroHomologacao } from '~/core/services/proposta-service';

export interface ModalEditarNumeroHomologacaoProps {
  open: boolean;
  onClose: () => void;
  propostaId: number;
  numeroHomologacaoAtual?: number | null;
  possuiCodaf?: boolean;
  onSucesso: (novoNumero: number | null) => void;
}

export const ModalEditarNumeroHomologacao: React.FC<ModalEditarNumeroHomologacaoProps> = ({
  open,
  onClose,
  propostaId,
  numeroHomologacaoAtual,
  possuiCodaf = false,
  onSucesso,
}) => {
  const valorInicial = numeroHomologacaoAtual != null ? String(numeroHomologacaoAtual) : '';
  const [novoNumero, setNovoNumero] = useState<string>(valorInicial);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setNovoNumero(valorInicial);
    }
  }, [open, valorInicial]);

  const hasChanged = novoNumero !== valorInicial;

  const handleSalvar = async () => {
    if (!hasChanged || loading) return;

    setLoading(true);
    try {
      const valorParaSalvar = novoNumero ? parseInt(novoNumero, 10) : null;
      const resposta = await salvarNumeroHomologacao(propostaId, valorParaSalvar);

      if (resposta?.sucesso) {
        notification.success({
          message: 'Sucesso!',
          description: 'O número de homologação foi alterado.',
        });
        onSucesso(valorParaSalvar);
        onClose();
      }
    } catch (error: any) {
      if (error?.response?.data?.mensagens?.length) {
        openNotificationErrors(error.response.data.mensagens);
      }
    } finally {
      setLoading(false);
    }
  };

  const footer = possuiCodaf ? (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <button
        type='button'
        id='btn-fechar-modal-numero-homologacao'
        onClick={onClose}
        style={{
          height: 40,
          padding: '0 16px',
          background: 'white',
          borderRadius: 4,
          border: '1px solid #FF9A52',
          color: '#FF9A52',
          fontSize: 14,
          fontFamily: 'Roboto',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Fechar
      </button>
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
      <button
        type='button'
        id='btn-cancelar-modal-numero-homologacao'
        onClick={onClose}
        disabled={loading}
        style={{
          height: 40,
          padding: '0 16px',
          background: 'white',
          borderRadius: 4,
          border: 'none',
          color: '#FF9A52',
          fontSize: 14,
          fontFamily: 'Roboto',
          fontWeight: 400,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        Cancelar
      </button>
      <button
        type='button'
        id='btn-salvar-modal-numero-homologacao'
        onClick={handleSalvar}
        disabled={!hasChanged || loading}
        style={{
          height: 40,
          padding: '0 16px',
          background: hasChanged ? '#FF9A52' : '#F5F5F5',
          borderRadius: 4,
          border: hasChanged ? 'none' : '1px solid #FF9A52',
          color: hasChanged ? 'white' : '#B8B8B8',
          fontSize: 14,
          fontFamily: 'Roboto',
          fontWeight: 700,
          cursor: hasChanged && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      title={
        <span
          style={{
            color: '#42474A',
            fontSize: 14,
            fontFamily: 'Roboto',
            fontWeight: 700,
          }}
        >
          Editar número de homologação
        </span>
      }
      onCancel={onClose}
      centered
      destroyOnClose
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      footer={footer}
    >
      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 0' }}>
          <label
            htmlFor='input-modal-numero-homologacao'
            style={{
              color: '#42474A',
              fontSize: 14,
              fontFamily: 'Roboto',
              fontWeight: 400,
            }}
          >
            Número de homologação
          </label>
          {possuiCodaf ? (
            <>
              <input
                id='input-modal-numero-homologacao'
                type='text'
                disabled
                value={numeroHomologacaoAtual != null ? String(numeroHomologacaoAtual) : ''}
                style={{
                  height: 40,
                  padding: '0 8px',
                  background: '#F5F5F5',
                  borderRadius: 4,
                  border: '1px solid #DADADA',
                  color: '#BFBFC2',
                  fontSize: 14,
                  fontFamily: 'Roboto',
                  fontWeight: 400,
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
              <div
                id='banner-aviso-codaf-modal'
                style={{
                  padding: 8,
                  background: '#FF9A52',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                  }}
                >
                  O número de homologação não pode ser alterado porque a proposta possui vínculo com um registro CODAF.
                </span>
              </div>
            </>
          ) : (
            <input
              id='input-modal-numero-homologacao'
              type='text'
              maxLength={15}
              value={novoNumero}
              onChange={(e) => setNovoNumero(e.target.value.replace(/\D/g, ''))}
              placeholder='Número de homologação'
              style={{
                height: 40,
                padding: '0 8px',
                background: 'white',
                borderRadius: 4,
                border: '1px solid #DADADA',
                color: '#42474A',
                fontSize: 14,
                fontFamily: 'Roboto',
                fontWeight: 400,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          )}
        </div>
      </Spin>
    </Modal>
  );
};
