import { Col, Form } from 'antd';
import { SelectDRE } from '~/components/main/input/dre';

export const SelectDREAreaPromotora = () => {
  const form = Form.useFormInstance();

  const perfilWatch = Form.useWatch('perfil', form);
  const perfil = form?.getFieldValue('perfil');

  const perfilDRE = 3;

  const ehPerfilDRE = perfilWatch?.visaoId === perfilDRE || perfil?.visaoId === perfilDRE;

  if (!ehPerfilDRE) return <></>;

  return (
    <Col xs={24} sm={12}>
      <SelectDRE
        formItemProps={{
          label: 'DRE',
          name: 'dreIdPropostas',
        }}
      />
    </Col>
  );
};
