import React from "react";
import { Card, Row, Col } from 'antd';

const CardTurmasPublico = ({ turma }: { turma: any }) => {
  const { nome, periodos, horario, local } = turma;

  return (
    <Card
      title={<span style={{ fontWeight: "bold", color: "white" }}>{nome}</span>}
      style={{ borderRadius: "12px" }}
      headStyle={{ backgroundColor: "#ff9a52", borderBottom: "none" }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <div>
            <strong>Datas dos encontros:</strong>
            {periodos.map((periodo: string, index: number) => (
              <div key={index}>
                {periodo} {horario}
              </div>
            ))}
          </div>
        </Col>

        <Col span={12}>
          <div>
            <strong>Local:</strong> 
            <div>{local}</div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CardTurmasPublico;