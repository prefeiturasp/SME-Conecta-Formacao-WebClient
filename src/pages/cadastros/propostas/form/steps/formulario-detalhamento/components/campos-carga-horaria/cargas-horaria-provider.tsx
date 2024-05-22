import React from 'react';
import { CamposCargaHoraria } from './cargas-horaria';
import { PropostaCargaHorariaTotalContextProvider } from './provider';

const CamposCargaHorariaProvider: React.FC = () => {
  return (
    <PropostaCargaHorariaTotalContextProvider>
      <CamposCargaHoraria />
    </PropostaCargaHorariaTotalContextProvider>
  );
};

export default CamposCargaHorariaProvider;
