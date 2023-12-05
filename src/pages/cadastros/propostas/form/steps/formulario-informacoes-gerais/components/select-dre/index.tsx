import { SelectDRE } from '~/components/main/input/dre';

export const SelectDRECadastroPropostas = () => {
  //TODO: E quando a área promotora for de uma DRE o campo já deve ser preenchido com a respectiva DRE
  // Quando o perfil estiver vinculado a uma dre o campo deve ficar desabilitado

  return (
    <SelectDRE
      formItemProps={{
        label: 'DRE',
        name: 'dreIdPropostas',
      }}
    />
  );
};
