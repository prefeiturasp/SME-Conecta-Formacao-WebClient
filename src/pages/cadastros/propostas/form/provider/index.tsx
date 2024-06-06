/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, createContext, useState } from 'react';
import { PropostaFormDTO } from '~/core/dto/proposta-dto';

type PropostaContextProps = {
  formInitialValues: PropostaFormDTO;
  setFormInitialValues: React.Dispatch<React.SetStateAction<PropostaFormDTO>>;
};

const DEFAULT_VALUES: PropostaContextProps = {
  formInitialValues: {},
  setFormInitialValues: () => {},
};

export const PropostaContext = createContext<PropostaContextProps>(DEFAULT_VALUES);

export const PropostaContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [formInitialValues, setFormInitialValues] = useState<PropostaFormDTO>({});

  return (
    <PropostaContext.Provider
      value={{
        formInitialValues,
        setFormInitialValues,
      }}
    >
      {children}
    </PropostaContext.Provider>
  );
};
