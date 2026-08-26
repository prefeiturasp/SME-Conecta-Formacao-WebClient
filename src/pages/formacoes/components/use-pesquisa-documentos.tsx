import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { notification } from '~/components/lib/notification';

export function usePesquisaDocumentos<T extends { id: number }>(
  apiCall: (pagina: number, registrosPorPagina: number) => Promise<{ sucesso: boolean; dados?: { items: T[], totalRegistros: number } }>,
  mensagemErro: string
) {
  const [dados, setDados] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const buscarDados = async (pagina = 1) => {
    setLoading(true);
    try {
      const response = await apiCall(pagina, registrosPorPagina);

      if (response.sucesso && response.dados) {
        setDados(response.dados.items);
        setTotalRegistros(response.dados.totalRegistros);
        if (response.dados.items.length === 1) {
          setSelectedRowKeys([response.dados.items[0].id]);
        } else {
          setSelectedRowKeys([]);
        }
      } else {
        setDados([]);
        setTotalRegistros(0);
        setSelectedRowKeys([]);
      }
      setPaginaAtual(pagina);
    } catch {
      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
      setDados([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  };

  const onClickFiltrar = () => {
    setFiltroAplicado(true);
    setSelectedRowKeys([]);
    buscarDados(1);
  };

  const handleTableChange = (pagination: any) => {
    if (pagination.pageSize === registrosPorPagina) {
      buscarDados(pagination.current);
      return;
    }

    setRegistrosPorPagina(pagination.pageSize);
    setPaginaAtual(1);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    columnTitle: (
      <Checkbox
        checked={dados.length > 0 && selectedRowKeys.length === dados.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRowKeys(dados.map((item) => item.id));
          } else {
            setSelectedRowKeys([]);
          }
        }}
      />
    ),
  };

  React.useEffect(() => {
    buscarDados(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosPorPagina]);

  return {
    dados,
    setDados,
    loading,
    paginaAtual,
    totalRegistros,
    registrosPorPagina,
    filtroAplicado,
    setFiltroAplicado,
    selectedRowKeys,
    setSelectedRowKeys,
    buscarDados,
    onClickFiltrar,
    handleTableChange,
    rowSelection,
    setPaginaAtual,
    setTotalRegistros,
  };
}
