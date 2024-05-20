/* eslint-disable @typescript-eslint/no-empty-function */
import { useWatch } from 'antd/es/form/Form';
import React, { PropsWithChildren, createContext, useMemo } from 'react';

type PropostaCargaHorariaTotalContextProps = {
  ehOutros?: boolean;
  cargasHorariaCorrespondem?: boolean;
};

const DEFAULT_VALUES: PropostaCargaHorariaTotalContextProps = {
  ehOutros: false,
  cargasHorariaCorrespondem: false,
};

export const PropostaCargaHorariaTotalContext = createContext(DEFAULT_VALUES);

export const PropostaCargaHorariaTotalContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const assicrona = useWatch('cargaHorariaSincrona');
  const distancia = useWatch('cargaHorariaDistancia');
  const presencial = useWatch('cargaHorariaPresencial');
  const cargaHorariaTotal = useWatch('cargaHorariaTotal');
  const cargaHorariaTotalOutros = useWatch('cargaHorariaTotalOutros');

  let ehOutros = cargaHorariaTotal === 99;

  const converterParaMinutos = (hora: string | number): number => {
    if (typeof hora === 'string' && hora.length === 6) {
      const partes = hora?.split(':');
      const parteZero = partes[0] ?? '00';
      const horas = Number(parteZero);
      const parteUm = partes[1] ?? '00';
      const minutos = Number(parteUm);
      return horas * 60 + minutos;
    } else if (typeof hora === 'number') {
      return hora * 60;
    } else {
      return 0;
    }
  };

  const cargasHorariaCorrespondem = useMemo(() => {
    const minutosTotais =
      converterParaMinutos(presencial) +
      converterParaMinutos(assicrona) +
      converterParaMinutos(distancia);

    const horasFinais = Math.floor(minutosTotais / 60);
    const minutosFinais = minutosTotais % 60;

    const newValue = `${horasFinais.toString().padStart(3, '0')}:${minutosFinais
      .toString()
      .padStart(2, '0')}`;

    const somaDosCamposEmMinutos = converterParaMinutos(newValue);
    const cargaHorariaTotalEmMinutos = converterParaMinutos(cargaHorariaTotal);
    const cargaHorariaTotalOutrosEmMinutos = converterParaMinutos(cargaHorariaTotalOutros);

    if (ehOutros) {
      return somaDosCamposEmMinutos === cargaHorariaTotalOutrosEmMinutos;
    } else {
      return somaDosCamposEmMinutos === cargaHorariaTotalEmMinutos;
    }
  }, [assicrona, distancia, presencial, cargaHorariaTotal, cargaHorariaTotalOutros]);

  return (
    <PropostaCargaHorariaTotalContext.Provider
      value={{
        ehOutros,
        cargasHorariaCorrespondem,
      }}
    >
      {children}
    </PropostaCargaHorariaTotalContext.Provider>
  );
};
