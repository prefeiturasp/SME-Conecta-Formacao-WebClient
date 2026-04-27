import { Form, FormItemProps, Select, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Empty from '~/components/main/empty';
import {
  CadastroCoordenadoriaDTO,
  CoordenadoriaFiltroDTO,
  listarCoordenadorias,
} from '~/core/services/coordenadoria-service';

const { Option } = Select;

interface SelectCoordenadoriaProps {
  formItemProps?: FormItemProps;
}

export const SelectCoordenadoria: React.FC<SelectCoordenadoriaProps> = ({ formItemProps }) => {
  const [items, setItems] = useState<CadastroCoordenadoriaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const carregarDados = async (currentPage: number, termo: string, limparLista: boolean = false) => {
    setLoading(true);
    const filtros: CoordenadoriaFiltroDTO = {
      nome: termo,
      numeroPagina: currentPage,
      numeroRegistros: 15,
    };

    const resposta = await listarCoordenadorias(filtros);

    if (resposta.sucesso && resposta.dados) {
      const novosItens = resposta.dados.items || [];
      setItems((prev) => (limparLista ? novosItens : [...prev, ...novosItens]));
      setHasMore(currentPage < (resposta.dados.totalPaginas || 1));
      setPage(currentPage);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarDados(1, '');
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      carregarDados(1, value, true);
    }, 600);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight + 5 >= target.scrollHeight) {
      if (hasMore && !loading) {
        carregarDados(page + 1, searchTerm, false);
      }
    }
  };

  return (
    <Form.Item {...formItemProps}>
      <Select
        showSearch
        allowClear
        placeholder='Selecione a Coordenadoria'
        filterOption={false}
        notFoundContent={loading ? <Spin size="small" /> : <Empty />}
        onSearch={handleSearch}
        onPopupScroll={handleScroll}
        loading={loading}
      >
        {items.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.nome}
          </Option>
        ))}
        {loading && page > 1 && (
          <Option disabled key="loading-more" className="text-center">
            <Spin size="small" /> Carregando...
          </Option>
        )}
      </Select>
    </Form.Item>
  );
};