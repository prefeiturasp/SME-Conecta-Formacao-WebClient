import MeusDados from './components/meus-dados/meus-dados';
import MeusDadosContextProvider from './provider';

export const MeusDadosProvider = () => {
  return (
    <MeusDadosContextProvider>
      <MeusDados />
    </MeusDadosContextProvider>
  );
};
