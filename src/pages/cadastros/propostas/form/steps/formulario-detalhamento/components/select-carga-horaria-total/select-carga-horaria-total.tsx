import { Col, Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import InputTimer from '~/components/lib/inputs/timer';
import { CF_SELECT_CARGA_HORARIA_TOTAL } from '~/core/constants/ids/select';
import { obterCargaHorariaTotal } from '~/core/services/proposta-service';

type SelectCargaHorariaTotalProps = {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
};

export const SelectCargaHorariaTotal: React.FC<SelectCargaHorariaTotalProps> = ({
  formItemProps,
  selectProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

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

  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const assicrona = form.getFieldValue('cargaHorariaSincrona');
        const distancia = form.getFieldValue('cargaHorariaDistancia');
        const presencial = form.getFieldValue('cargaHorariaPresencial');
        const cargaHorariaTotal: number = form.getFieldValue('cargaHorariaTotal');

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
        const validacaoCampos = somaDosCamposEmMinutos === cargaHorariaTotalEmMinutos;

        let campoOutros = null;
        let ehOutros = cargaHorariaTotal === 99;
        if (ehOutros) {
          campoOutros = (
            <InputTimer
              formItemProps={{
                required: true,
                label: 'Outros',
                name: 'cargaHorariaTotalOutros',
              }}
            />
          );
        }

        return (
          <>
            <Form.Item
              label='Carga horária total'
              name='cargaHorariaTotal'
              rules={[
                {
                  validator() {
                    if (!validacaoCampos) {
                      return Promise.reject(
                        'A soma dos campos de carga horária deve ser igual a carga horária total.',
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
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
            {campoOutros ? <Col span={24}>{campoOutros}</Col> : <></>}
          </>
        );
      }}
    </Form.Item>
  );
};
