import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderPage from "~/components/lib/header-page";
import ButtonVoltar from "~/components/main/button/voltar";
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from "~/core/constants/ids/button/intex";
import { ROUTES } from "~/core/enum/routes-enum";
import { onClickVoltar } from "~/core/utils/form";

const CodafSuplementar: React.FC = () => {
  const navigate = useNavigate();
  const onClickNovo = () => {
    navigate(ROUTES.CODAF_SUPLEMENTAR_NOVO);
  };
  return (
    <Col>
      
      <HeaderPage title='CODAF Suplementar'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CF_BUTTON_NOVO}
                onClick={() => onClickNovo()}
                style={{ fontWeight: 700 }}
              >
                Novo registro
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
    </Col>
  );
}

export default CodafSuplementar;