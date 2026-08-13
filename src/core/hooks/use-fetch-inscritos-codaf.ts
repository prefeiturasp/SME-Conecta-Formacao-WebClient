import { useState, useEffect, useCallback, useRef } from 'react';
import { notification } from '~/components/lib/notification';
import { obterInscritosTurma } from '../services/codaf-nao-homologado-service';

export const useFetchInscritosCodaf = <TCursista>(
  turmaId: number | undefined,
  registrosPorPagina: number,
  setPaginaAtualInscritos: (pagina: number) => void,
  mapper: (item: any) => TCursista
) => {
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [cursistas, setCursistas] = useState<TCursista[]>([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const cursistasOriginais = useRef<TCursista[]>([]);

  const buscar = useCallback(async () => {
    if (!turmaId) {
      setCursistas([]);
      setTotalRegistros(0);
      setPaginaAtualInscritos(1);
      return;
    }

    setLoadingInscritos(true);
    try {
      const response = await obterInscritosTurma(turmaId, 1, 99999);
      if (response.sucesso && response.dados) {
        const formatados = response.dados.items.map(mapper);
        setCursistas(formatados);
        setTotalRegistros(response.dados.totalRegistros || 0);
        setPaginaAtualInscritos(1);
        
        setTimeout(() => {
          cursistasOriginais.current = structuredClone(formatados);
        }, 100);
      } else {
        setCursistas([]);
        setTotalRegistros(0);
        notification.warning({ message: 'Atenção', description: 'Nenhum inscrito encontrado para esta turma.' });
      }
    } catch (error) {
      console.error('Erro ao buscar inscritos:', error);
      setCursistas([]);
      setTotalRegistros(0);
      notification.error({ message: 'Erro', description: 'Erro ao buscar inscritos da turma.' });
    } finally {
      setLoadingInscritos(false);
    }
  }, [turmaId, mapper]);

  useEffect(() => {
    buscar();
  }, [buscar, registrosPorPagina]);

  return { cursistas, setCursistas, totalRegistros, loadingInscritos, cursistasOriginais, recarregarInscritos: buscar };
};