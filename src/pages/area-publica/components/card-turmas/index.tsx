import React from "react";
import { Card, Row, Col } from "antd";

const gerarDatas = (periodo: string, horario: string): string[] => {
  const regex = /De (\d{2}\/\d{2}) até (\d{2}\/\d{2})/;
  const match = regex.exec(periodo);

  if (!match) return [];

  const start = match[1];
  const end = match[2];

  const [startDia, startMes] = start.split("/").map(Number);
  const [endDia] = end.split("/").map(Number);

  const datas: string[] = [];

  for (let dia = startDia; dia <= endDia; dia++) {
    datas.push(
      `${dia.toString().padStart(2, "0")}/${startMes
        .toString()
        .padStart(2, "0")} ${horario}`
    );
  }

  return datas;
};

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
            {periodos.map((periodo: string) =>
              gerarDatas(periodo, horario).map((data: string, index: number) => (
                <div key={`${data}-${index}`}>{data}</div>
              ))
            )}
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