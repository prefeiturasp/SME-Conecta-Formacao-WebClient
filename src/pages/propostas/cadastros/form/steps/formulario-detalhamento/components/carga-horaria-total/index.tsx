import { Form, Input } from 'antd';
import { useEffect, useState } from 'react';

const InputTimerCargaHorariaTotal = () => {
  const form = Form.useFormInstance();

  const [cargaHorariaTotal, setCargaHorariaTotal] = useState<string>('');

  const presencial = form.getFieldValue('cargaHorariaPresencial');
  const assicrona = form.getFieldValue('cargaHorariaSincrona');
  const distancia = form.getFieldValue('cargaHorariaDistancia');

  const converterParaMinutos = (hora: string): number => {
    if (hora) {
      const partes = hora?.split(':');
      const parteZero = partes[0] ?? '00';
      const horas = Number(parteZero);
      const parteUm = partes[1] ?? '00';
      const minutos = Number(parteUm);
      return horas * 60 + minutos;
    }
    return 0;
  };

  useEffect(() => {
    const minutosTotais =
      converterParaMinutos(presencial) +
      converterParaMinutos(assicrona) +
      converterParaMinutos(distancia);

    const horasFinais = Math.floor(minutosTotais / 60);
    const minutosFinais = minutosTotais % 60;

    const newValue = `${horasFinais.toString().padStart(3, '0')}:${minutosFinais
      .toString()
      .padStart(2, '0')}`;

    setCargaHorariaTotal(newValue);
  }, [presencial, assicrona, distancia]);

  return <Input value={cargaHorariaTotal} disabled />;
};

export default InputTimerCargaHorariaTotal;
