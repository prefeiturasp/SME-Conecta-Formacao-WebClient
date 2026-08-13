import { useState } from 'react';

export const useTabelaInscritos = <T>() => {
  const [cursistas, setCursistas] = useState<T[]>([]);
  const [cursistasSelecionadosIds, setCursistasSelecionadosIds] = useState<number[]>([]);
  const [paginaAtualInscritos, setPaginaAtualInscritos] = useState(1);
  const [registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos] = useState(10);
  const [totalRegistrosInscritos, setTotalRegistrosInscritos] = useState(0);

  const handleTableChangeInscritos = (pagination: any) => {
    if (pagination.pageSize !== registrosPorPaginaInscritos) {
      setRegistrosPorPaginaInscritos(pagination.pageSize);
    }
    setPaginaAtualInscritos(pagination.current);
  };

  const getRowSelection = (disabled: boolean) => ({
    selectedRowKeys: cursistasSelecionadosIds,
    onChange: (selectedRowKeys: any[]) => setCursistasSelecionadosIds(selectedRowKeys as number[]),
    preserveSelectedRowKeys: true,
    getCheckboxProps: () => ({ disabled }),
  });

  return {
    cursistas, setCursistas,
    cursistasSelecionadosIds, setCursistasSelecionadosIds,
    paginaAtualInscritos, setPaginaAtualInscritos,
    registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos,
    totalRegistrosInscritos, setTotalRegistrosInscritos,
    handleTableChangeInscritos,
    getRowSelection,
  };
};