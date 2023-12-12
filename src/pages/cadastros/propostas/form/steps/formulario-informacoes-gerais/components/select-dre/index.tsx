import { FormItemProps, SelectProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';
import jwt_decode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { SelectDRE } from '~/components/main/input/dre';
import { CF_SELECT_DRE_CADASTRO_PROPOSTAS } from '~/core/constants/ids/select';
import { JWTDecodeDTO } from '~/core/dto/jwt-decode-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import { obterDREs } from '~/core/services/dre-service';

export type InitialValueConfig = {
  value: any;
  loaded: boolean;
};

type SelectDRECadastroPropostasProps = {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  exibirOpcaoOutros?: boolean;
};

export const SelectDRECadastroPropostas: React.FC<SelectDRECadastroPropostasProps> = ({
  formItemProps,
  selectProps,
  exibirOpcaoOutros,
}) => {
  const form = useFormInstance();
  const token = useAppSelector((store) => store.auth.token);
  const decodeToken: JWTDecodeDTO = jwt_decode(token);
  //TODO: verificar quando ja tiver dados no alterar
  // const dres = form.getFieldValue('dres');

  //TODO: verificar o retorno do dado para SUBSTITUIR O 15 PELO -99 OU OPCAOLISTAGEM.TODOS
  const newToken = { ...decodeToken, dres: [1, 2] };
  const dresIdsDoToken = newToken?.dres;

  // const [desabilitarCampoDRE, setDesabilitarCampoDRE] = useState<boolean>(false);
  const [autoSetValues, setAutoSetValues] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    // if (dresIdsDoToken && dresIdsDoToken.length > 0 && !desabilitarCampoDRE) {
    if (dresIdsDoToken && dresIdsDoToken.length > 0) {
      const obterDescricoesDRE = async () => {
        const resposta = await obterDREs();

        const descricoes = resposta.dados
          .filter((item) => dresIdsDoToken.includes(item.id))
          .map((item) => ({
            label: item.descricao,
            value: item.id,
          }));

        if (descricoes.length > 0) {
          // setDesabilitarCampoDRE(true);
          setAutoSetValues(descricoes);
        }
      };
      obterDescricoesDRE();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (autoSetValues.length > 0) {
        form?.setFieldValue('dres', autoSetValues);
      }
    }, 300);
  }, [autoSetValues, form]);

  return (
    <SelectDRE
      exibirOpcaoOutros={exibirOpcaoOutros}
      formItemProps={{
        ...formItemProps,
        label: formItemProps?.label,
        name: 'dres',
        // getValueFromEvent: (_, value) => value,
      }}
      selectProps={{
        mode: 'multiple',
        // labelInValue: true,
        disabled: selectProps?.disabled,
        id: CF_SELECT_DRE_CADASTRO_PROPOSTAS,
        ...selectProps,
      }}
    />
  );
};
