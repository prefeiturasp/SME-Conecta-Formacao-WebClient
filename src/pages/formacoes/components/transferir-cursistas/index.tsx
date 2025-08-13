import { Select, Alert, Spin, Typography, Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useFormacoesSimples } from '~/core/hooks/useFormacoes';
import SelecionarCursistas from '../selecionar-cursistas';
import { useTransferirCursistas } from '~/core/hooks/useTransferirCursistas';
import { CursistaInscricaoDTO } from '~/core/hooks/useCursistasPorFormacao';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { ColumnsType } from 'antd/es/table';
import DataTable from '~/components/lib/card-table';
import { Colors } from '~/core/styles/colors';

const { Text } = Typography;

function FormTransferir() {
  const confirmarTransferencia = () => {
    const columns: ColumnsType<CursistaInscricaoDTO> = [
      { title: 'Cursista', dataIndex: 'nomeCursista' },
      {
        title: 'Origem',
        render: (c) => `${formacaoOrigem?.nomeFormacao} - ${c.nomeTurma} `,
      },
      {
        title: 'Destino',
        render: () =>
          `${formacaoDestino?.nomeFormacao} - ${
            turmasDestino.find((t) => t.propostaTurmaId === idTurmaDestino)?.nomeTurma
          }`,
      },
    ];

    Modal.confirm({
      title: 'Confirmação de transferência',
      icon: null,
      centered: true,
      width: 700,
      content: (
        <>
          <p>Deseja concluir a transferência dos seguintes cursistas?</p>
          <DataTable<CursistaInscricaoDTO>
            columns={columns}
            dataSource={selectedCursistas}
            pagination={false} // sem paginação no modal
            bordered
            size='small'
          />
        </>
      ),
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      okButtonProps: {
        style: {
          backgroundColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
          borderColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: Colors.Neutral.WHITE,
          borderColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
          color: Colors.SystemSME.ConectaFormacao.PRIMARY,
        },
      },
      onOk: handleTransferir,
    });
  };

  const { data: formacoes = [], loading, erro } = useFormacoesSimples({ nomeFormacao: '' });
  const { transferir, loading: loadingTransfer, error: errorTransfer } = useTransferirCursistas();

  const [idFormacaoOrigem, setIdFormacaoOrigem] = useState<number | null>(null);
  const [idTurmaOrigem, setIdTurmaOrigem] = useState<number | null>(null);

  const [idFormacaoDestino, setIdFormacaoDestino] = useState<number | null>(null);
  const [idTurmaDestino, setIdTurmaDestino] = useState<number | null>(null);

  const [selectedCursistas, setSelectedCursistas] = useState<CursistaInscricaoDTO[]>([]);

  const formacaoOrigem = formacoes.find((f) => f.id === idFormacaoOrigem) || null;
  const formacaoDestino = formacoes.find((f) => f.id === idFormacaoDestino) || null;

  const turmasOrigem = formacaoOrigem?.turmas || [];
  const turmasDestino =
    formacaoDestino?.turmas.filter((t) => t.propostaTurmaId !== idTurmaOrigem) || [];

  const handleTransferir = async () => {
    if (!idFormacaoOrigem || !idTurmaOrigem || !idFormacaoDestino || !idTurmaDestino) return;

    try {
      const dto = {
        idFormacaoOrigem,
        idTurmaOrigem,
        idFormacaoDestino,
        idTurmaDestino,
        inscricaoIds: selectedCursistas.map((c) => c.inscricaoId),
        registroFuncionais: selectedCursistas.map((c) => c.registroFuncional),
      };

      const result = await transferir(dto);

      if (result?.sucesso) {
        message.success('Cursistas transferidos com sucesso!');
        setIdFormacaoOrigem(null);
        setIdTurmaOrigem(null);
        setIdFormacaoDestino(null);
        setIdTurmaDestino(null);
        setSelectedCursistas([]);
      }
    } catch {
      message.error('Erro ao transferir cursistas');
    }
  };

  const isBotaoDesabilitado =
    !idFormacaoOrigem ||
    !idTurmaOrigem ||
    !idFormacaoDestino ||
    !idTurmaDestino ||
    selectedCursistas.length === 0;

  useEffect(() => {
    setSelectedCursistas([]);
  }, [idTurmaOrigem]);

  return (
    <>
      {erro && <Alert type='error' message={erro} style={{ marginBottom: 12 }} />}
      {loading ? (
        <Spin />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <Text>Selecione a formação de origem</Text>
          <Select
            showSearch
            placeholder='Selecione'
            value={idFormacaoOrigem}
            optionFilterProp='label'
            style={{ width: '100%', marginTop: 8 }}
            options={formacoes.map((f) => ({ label: f.nomeFormacao, value: f.id }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            onChange={(id) => {
              setIdFormacaoOrigem(id);
              setIdTurmaOrigem(null);
              setIdFormacaoDestino(null);
              setIdTurmaDestino(null);
              setSelectedCursistas([]);
            }}
            allowClear
          />
        </div>
      )}

      {idFormacaoOrigem && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <Text>Selecione a turma de origem</Text>
          <Select
            showSearch
            placeholder='Selecione'
            style={{ width: '100%', marginTop: 8 }}
            value={idTurmaOrigem}
            onChange={(id) => {
              setIdTurmaOrigem(id);
              setIdFormacaoDestino(null);
              setIdTurmaDestino(null);
              setSelectedCursistas([]);
            }}
            options={turmasOrigem.map((t) => ({
              label: `${t.nomeTurma} - ${t.data}`,
              value: t.propostaTurmaId,
            }))}
            optionFilterProp='label'
            allowClear
          />
        </div>
      )}

      {idTurmaOrigem && (
        <div style={{ padding: '16px', gap: 8, display: 'Flex', flexDirection: 'column' }}>
          <Text>Selecione os cursistas que deseja transferir</Text>
          <SelecionarCursistas
            idFormacao={idFormacaoOrigem}
            propostaTurmaId={idTurmaOrigem ?? undefined}
            onSelectionChange={(rows: CursistaInscricaoDTO[]) => setSelectedCursistas(rows)}
          />
        </div>
      )}

      {idTurmaOrigem && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <Text>Selecione a formação de destino</Text>
            <Select
              showSearch
              placeholder='Selecione'
              value={idFormacaoDestino}
              optionFilterProp='label'
              style={{ width: '100%', marginTop: 8 }}
              options={formacoes.map((f) => ({ label: f.nomeFormacao, value: f.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              onChange={(id) => {
                setIdFormacaoDestino(id);
                setIdTurmaDestino(null);
              }}
              allowClear
            />
          </div>

          {idFormacaoDestino && (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
              <Text>Selecione a turma de destino</Text>
              <Select
                showSearch
                placeholder='Selecione'
                style={{ width: '100%', marginTop: 8 }}
                value={idTurmaDestino}
                onChange={(id) => setIdTurmaDestino(id)}
                options={turmasDestino.map((t) => ({
                  label: `${t.nomeTurma} - ${t.data}`,
                  value: t.propostaTurmaId,
                }))}
                optionFilterProp='label'
                allowClear
              />
            </div>
          )}
        </>
      )}

      {idFormacaoDestino && idTurmaDestino && (
        <div style={{ padding: '16px' }}>
          {errorTransfer && (
            <Alert type='error' message={errorTransfer} style={{ marginBottom: 12 }} />
          )}
          <Button
            block
            type='primary'
            htmlType='button'
            id={CF_BUTTON_NOVO}
            style={{ fontWeight: 700 }}
            onClick={confirmarTransferencia}
            loading={loadingTransfer}
            disabled={isBotaoDesabilitado}
          >
            Transferir
          </Button>
        </div>
      )}
    </>
  );
}

export default FormTransferir;
