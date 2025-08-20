import { Select, Alert, Spin, Typography, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useFormacoesSimples } from '~/core/hooks/useFormacoes';
import SelecionarCursistas from '../selecionar-cursistas';
import { useTransferirCursistas } from '~/core/hooks/useTransferirCursistas';
import { CursistaInscricaoDTO } from '~/core/hooks/useCursistasPorFormacao';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import Table, { ColumnsType } from 'antd/es/table';
import DataTable from '~/components/lib/card-table';
import { Colors } from '~/core/styles/colors';
import { notification } from '~/components/lib/notification';

const { Text } = Typography;

function FormTransferir() {
  const { data: formacoes = [], loading, erro } = useFormacoesSimples({ nomeFormacao: '' });
  const { transferir, loading: loadingTransfer, message } = useTransferirCursistas();

  const [idFormacaoOrigem, setIdFormacaoOrigem] = useState<number | null>(null);
  const [idTurmaOrigem, setIdTurmaOrigem] = useState<number | null>(null);
  const [idFormacaoDestino, setIdFormacaoDestino] = useState<number | null>(null);
  const [idTurmaDestino, setIdTurmaDestino] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCursistas, setSelectedCursistas] = useState<CursistaInscricaoDTO[]>([]);

  const formacaoOrigem = formacoes.find((f) => f.id === idFormacaoOrigem) || null;
  const formacaoDestino = formacoes.find((f) => f.id === idFormacaoDestino) || null;

  const turmasOrigem = formacaoOrigem?.turmas || [];
  const turmasDestino =
    formacaoDestino?.turmas.filter((t) => t.propostaTurmaId !== idTurmaOrigem) || [];

  const isBotaoDesabilitado =
    !idFormacaoOrigem ||
    !idTurmaOrigem ||
    !idFormacaoDestino ||
    !idTurmaDestino ||
    selectedCursistas.length === 0;

  useEffect(() => {
    setSelectedCursistas([]);
  }, [idTurmaOrigem, idFormacaoOrigem]);

  const showErrorModal = (titulo: string, cursistas: any[]) => {
    Modal.error({
      title: titulo,
      width: 800,
      centered: true,
      okButtonProps: {
        style: {
          backgroundColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
          borderColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
        },
      },
      content: (
        <Table
          dataSource={cursistas.map((c: any, idx: number) => ({
            key: idx,
            nome: c.nomeCursista,
            rf: c.rf,
            mensagem: c.mensagem,
          }))}
          columns={[
            {
              title: 'Cursista',
              dataIndex: 'nome',
              key: 'nome',
              render: (text: string) => <strong>{text}</strong>,
            },
            {
              title: 'RF',
              dataIndex: 'rf',
              key: 'rf',
              width: 120,
            },
            {
              title: 'Mensagem',
              dataIndex: 'mensagem',
              key: 'mensagem',
            },
          ]}
          pagination={false}
          size='small'
        />
      ),
    });
  };

  const handleTransferir = async () => {
    if (!idFormacaoOrigem || !idTurmaOrigem || !idFormacaoDestino || !idTurmaDestino) return;

    try {
      const dto = {
        idFormacaoOrigem,
        idTurmaOrigem,
        idFormacaoDestino,
        idTurmaDestino,
        cursistas: selectedCursistas.map((c) => ({
          rf: c.registroFuncional,
          idInscricao: c.inscricaoId,
        })),
      };

      const result = await transferir(dto);

      if (result.status === 200) {
        setRefreshKey((prev) => prev + 1);
        setSelectedCursistas([]);

        notification.success({
          message: result.mensagem || 'Transferências realizadas com sucesso!',
          description: `Foram transferidos ${selectedCursistas.length} cursista(s)`,
        });
      }
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.cursistas?.length) {
        showErrorModal('Transferência incompleta: revise os casos abaixo', data.cursistas);
      }
      setRefreshKey((prev) => prev + 1);
    }
  };

  const confirmarTransferencia = () => {
    const columns: ColumnsType<CursistaInscricaoDTO> = [
      { title: 'Cursista', dataIndex: 'nomeCursista' },
      {
        title: 'Origem',
        render: (c) => `${formacaoOrigem?.nomeFormacao} - ${c.nomeTurma}`,
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
            pagination={false}
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
        <div style={{ padding: '16px', gap: 8, display: 'flex', flexDirection: 'column' }}>
          <Text>Selecione os cursistas que deseja transferir</Text>
          <SelecionarCursistas
            idFormacao={idFormacaoOrigem}
            propostaTurmaId={idTurmaOrigem ?? undefined}
            selectedCursistas={selectedCursistas}
            refreshKey={refreshKey}
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
                onChange={(id) => {
                  setIdTurmaDestino(id);
                }}
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
          {message && (
            <Alert
              message={message}
              type='info'
              showIcon={false}
              style={{
                marginBottom: 12,
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                color: '#595959',
              }}
            />
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
