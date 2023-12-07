import { FormInstance, FormItemProps, SelectProps } from 'antd';
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

  const newToken = { ...decodeToken, dres: [1, 2, 3] };
  const dresIdsDoToken = newToken?.dres;

  const [desabilitarCampoDRE, setDesabilitarCampoDRE] = useState<boolean>(false);
  const [autoSetValues, setAutoSetValues] = useState<string[]>([]);

  useEffect(() => {
    if (dresIdsDoToken && dresIdsDoToken.length > 0 && !desabilitarCampoDRE) {
      const obterDescricoesDRE = async () => {
        const resposta = await obterDREs();
        const descricoes = resposta.dados
          .filter((item) => dresIdsDoToken.includes(item.id))
          .map((dre) => dre.descricao);

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
