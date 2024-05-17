/* eslint-disable @typescript-eslint/no-empty-function */
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';

type PropostaCargaHorariaTotalContextProps = {
  cargasHorariaCorrespondem?: boolean;
  // setCargasHorariaCorrespondem: React.Dispatch<React.SetStateAction<boolean>>;
};

const DEFAULT_VALUES: PropostaCargaHorariaTotalContextProps = {
  cargasHorariaCorrespondem: false,
  // setCargasHorariaCorrespondem: () => false,
};

export const PropostaCargaHorariaTotalContext = createContext(DEFAULT_VALUES);

// TODO: AJUSTAR CONTEXT PRA REFLETIR NAS RULES DOS CAMPOS DE CARGA
export const PropostaCargaHorariaTotalContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const form = useFormInstance();
  const [cargasHorariaCorrespondem, setCargasHorariaCorrespondem] = useState<boolean>(false);

  const assicrona = form.getFieldValue('cargaHorariaSincrona');
  const distancia = form.getFieldValue('cargaHorariaDistancia');
  const presencial = form.getFieldValue('cargaHorariaPresencial');
  const cargaHorariaTotal: number = form.getFieldValue('cargaHorariaTotal');

  const converterParaMinutos = (hora: string | number): number => {
    if (typeof hora === 'string') {
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

  const validarCargas = () => {
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
    setCargasHorariaCorrespondem(somaDosCamposEmMinutos === cargaHorariaTotalEmMinutos);
  };

  useEffect(() => {
    validarCargas();
  }, [assicrona, distancia, presencial, cargaHorariaTotal]);

  return (
    <PropostaCargaHorariaTotalContext.Provider
      value={{
        cargasHorariaCorrespondem,
      }}
    >
      {children}
    </PropostaCargaHorariaTotalContext.Provider>
  );
};
