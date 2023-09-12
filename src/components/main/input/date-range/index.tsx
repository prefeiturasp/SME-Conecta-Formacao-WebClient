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

const DatePickerPeriodo: FC = () => {
  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MM/YYYY';
  const dataAtual = new Date();
  const dataFinal = new Date().setDate(dataAtual.getDate() + 1);
  return (
    <>
      <Form.Item label='Período de realização' name='periodoRealizacao'>
        <RangePicker
          locale={localeDatePicker}
          defaultValue={[dayjs(dataAtual, dateFormat), dayjs(dataFinal, dateFormat)]}
          format={dateFormat}
        />
      </Form.Item>
    </>
  );
};

export default DatePickerPeriodo;
