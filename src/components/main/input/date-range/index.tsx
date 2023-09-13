import { DatePicker, Form } from 'antd';
import { FC } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import locale from 'dayjs/locale/pt-br';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(locale);

type DatePickerPeriodoProps = {
  changeFunction: VoidFunction;
};

const DatePickerPeriodo: FC<DatePickerPeriodoProps> = ({ changeFunction }) => {
  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MM/YYYY';
  return (
    <>
      <Form.Item label='Período de realização' name='periodoRealizacao'>
        <RangePicker onChange={changeFunction} locale={localeDatePicker} format={dateFormat} />
      </Form.Item>
    </>
  );
};

export default DatePickerPeriodo;
