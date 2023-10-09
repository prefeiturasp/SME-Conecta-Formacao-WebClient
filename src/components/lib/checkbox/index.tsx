import { Checkbox, Form, FormInstance } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

type CheckboxAcaoInformaticaProps = {
  form: FormInstance;
};

const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`);
};
const CheckboxAcaoInformatica: React.FC<CheckboxAcaoInformaticaProps> = () => {
  return (
    <>
      <Form.Item name='acaoInformativa' rules={[{ required: false }]}>
        <Checkbox onChange={onChange}>Checkbox</Checkbox>
      </Form.Item>
    </>
  );
};

export default CheckboxAcaoInformatica;
