import { FormInstance, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import jwt_decode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { SelectDRE } from '~/components/main/input/dre';
import { CF_SELECT_DRE_CADASTRO_PROPOSTAS } from '~/core/constants/ids/select';
import { JWTDecodeDTO } from '~/core/dto/jwt-decode-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import { obterDREs } from '~/core/services/dre-service';

type SelectDRECadastroPropostasProps = {
  form: FormInstance;
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
};

export const SelectDRECadastroPropostas: React.FC<SelectDRECadastroPropostasProps> = ({
  form,
  formItemProps,
  selectProps,
}) => {
  const token = useAppSelector((store) => store.auth.token);
  const decodeToken: JWTDecodeDTO = jwt_decode(token);

  //TODO: verificar o retorno do dado para SUBSTITUIR O 15 PELO -99 OU OPCAOLISTAGEM.TODOS
  const newToken = { ...decodeToken, dres: [15] };
  const dresIdsDoToken = newToken?.dres;

  const [desabilitarCampoDRE, setDesabilitarCampoDRE] = useState<boolean>(false);
  const [autoSetValues, setAutoSetValues] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    if (dresIdsDoToken && dresIdsDoToken.length > 0 && !desabilitarCampoDRE) {
      const obterDescricoesDRE = async () => {
        const resposta = await obterDREs();
        const descricoes = resposta.dados
          .filter((item) => dresIdsDoToken.includes(item.id))
          .map((item) => ({
            label: item.descricao,
            value: item.id,
          }));

        if (descricoes.length > 0) {
          setDesabilitarCampoDRE(true);
          setAutoSetValues(descricoes);
        }
      };
      obterDescricoesDRE();
    }
  }, [dresIdsDoToken, desabilitarCampoDRE]);

  useEffect(() => {
    if (autoSetValues.length > 0) {
      form?.setFieldValue('dreIdPropostas', autoSetValues);
    }
  }, [autoSetValues, form]);

  return (
    <SelectDRE
      formItemProps={{
        ...formItemProps,
        label: formItemProps?.label ?? 'DRE',
        name: 'dreIdPropostas',
      }}
      selectProps={{
        mode: 'multiple',
        disabled: selectProps?.disabled ?? desabilitarCampoDRE,
        id: CF_SELECT_DRE_CADASTRO_PROPOSTAS,
      }}
    />
  );
};
