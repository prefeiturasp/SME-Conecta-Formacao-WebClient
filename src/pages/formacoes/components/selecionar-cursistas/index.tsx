import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { Input, Row, Col, Space } from 'antd';
import DataTable from '~/components/lib/card-table';
import {
  useCursistasPorFormacao,
  CursistaInscricaoDTO,
} from '~/core/hooks/useCursistasPorFormacao';
import { useDebounce } from '~/core/hooks/useDebounce';

type SelecionarCursistasProps = {
  idFormacao: number | null;
  propostaTurmaId?: number | null;
  onSelectionChange: (rows: CursistaInscricaoDTO[]) => void;
};

const SelecionarCursistas = ({
  idFormacao,
  propostaTurmaId,
  onSelectionChange,
}: SelecionarCursistasProps) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [tamanhoPagina, setTamanhoPagina] = useState(10);
  const [cpf, setCpf] = useState<string>();
  const [nomeCursista, setNomeCursista] = useState<string>();
  const [registroFuncional, setRegistroFuncional] = useState<string>();

  const cpfDebounced = useDebounce(cpf, 500);
  const nomeCursistaDebounced = useDebounce(nomeCursista, 500);
  const registroFuncionalDebounced = useDebounce(registroFuncional, 500);
  const propostaTurmaIdDebounced = useDebounce(propostaTurmaId, 500);

  const {
    data: cursistas = [],
    total,
    loading,
  } = useCursistasPorFormacao({
    idFormacao,
    cpf: cpfDebounced,
    nomeCursista: nomeCursistaDebounced,
    registroFuncional: registroFuncionalDebounced,
    turmasId: propostaTurmaIdDebounced ?? undefined,
    numeroPagina: paginaAtual,
    numeroRegistros: tamanhoPagina,
  });

  const cursistasAtivos = cursistas.filter((c) => c.situacao !== 'Cancelada');

  const [selectedRows, setSelectedRows] = useState<CursistaInscricaoDTO[]>([]);
  const selectedRowKeys = selectedRows.map((c) => c.inscricaoId);

  const onSelectChange = (_: React.Key[], rows: CursistaInscricaoDTO[]) => {
    setSelectedRows(rows);
    onSelectionChange(rows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<CursistaInscricaoDTO> = [
    { title: 'Cursista', dataIndex: 'nomeCursista' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'RF', dataIndex: 'registroFuncional' },
    { title: 'Situação', dataIndex: 'situacao' },
  ];

  useEffect(() => {
    setSelectedRows([]);
    onSelectionChange([]);
  }, [propostaTurmaId]);

  return (
    <>
      <Space direction='vertical' style={{ width: '100%', marginBottom: 16 }}>
        <Row gutter={8}>
          <Col span={6}>
            <Input
              placeholder='Nome do Cursista'
              value={nomeCursista}
              onChange={(e) => setNomeCursista(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Input
              placeholder='CPF'
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Input
              placeholder='RF'
              value={registroFuncional}
              onChange={(e) => setRegistroFuncional(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </Space>

      <DataTable<CursistaInscricaoDTO>
        rowKey='inscricaoId'
        rowSelection={rowSelection}
        columns={columns}
        dataSource={cursistasAtivos}
        loading={loading}
        pagination={{
          current: paginaAtual,
          pageSize: tamanhoPagina,
          total: total,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPaginaAtual(page);
            setTamanhoPagina(pageSize);
          },
        }}
      />
    </>
  );
};

export default SelecionarCursistas;
