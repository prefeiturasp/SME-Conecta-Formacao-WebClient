import { Form, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import { useContext, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import InputTimer from '~/components/lib/inputs/timer';
import { CF_SELECT_CARGA_HORARIA_TOTAL } from '~/core/constants/ids/select';
import { obterCargaHorariaTotal } from '~/core/services/proposta-service';
import { PropostaCargaHorariaTotalContext } from '../../provider';

type SelectCargaHorariaTotalProps = {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
};

export const SelectCargaHorariaTotal: React.FC<SelectCargaHorariaTotalProps> = ({
  formItemProps,
  selectProps,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const { ehOutros, cargasHorariaCorrespondem } = useContext(PropostaCargaHorariaTotalContext);

  const dependencies = [
    'cargaHorariaDistancia',
    'cargaHorariaPresencial',
    'cargaHorariaPresencial',
  ];

  const obterDados = async () => {
    const resposta = await obterCargaHorariaTotal();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        value: item.id,
        label: item.descricao,
      }));

      setOptions(newOptions);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  const validator = () => {
    return {
      validator() {
        if (cargasHorariaCorrespondem) return Promise.resolve();

        return Promise.reject(
          'A soma dos campos de carga horária deve ser igual a carga horária total.',
        );
      },
    };
  };

  const campoOutrosJsx = () => {
    if (ehOutros) {
      return (
        <InputTimer
          formItemProps={{
            dependencies,
            required: true,
            label: 'Outros',
            rules: [validator],
            name: 'cargaHorariaTotalOutros',
          }}
        />
      );
    }
  };

  return (
    <>
      <Form.Item
        label='Carga horária total'
        name='cargaHorariaTotal'
        dependencies={dependencies}
        rules={ehOutros ? [] : [validator]}
        {...formItemProps}
      >
        <Select
          allowClear
          options={options}
          id={CF_SELECT_CARGA_HORARIA_TOTAL}
          placeholder='Selecione a carga horária total'
          onChange={() => ehOutros && form.setFieldValue('cargaHorariaTotalOutros', '')}
          {...selectProps}
        />
      </Form.Item>
      {campoOutrosJsx()}
    </>
  );
};
