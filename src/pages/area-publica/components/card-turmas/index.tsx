import React from "react";
import { Card, Row, Col } from "antd";


export const gerarDatas = (periodo: string, horario: string): string[] => {
  const regexRange = /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2})\/(\d{2})\/(\d{4})/;
  const regexSingle = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  const matchRange = regexRange.exec(periodo);
  const matchSingle = !matchRange ? regexSingle.exec(periodo) : null;

  if (!matchRange && !matchSingle) return [];

  let d1: string, m1: string, a1: string, d2: string, m2: string, a2: string;

  if (matchRange) {
    [, d1, m1, a1, d2, m2, a2] = matchRange;
  } else {
    [, d1, m1, a1] = matchSingle!;
    [d2, m2, a2] = [d1, m1, a1];
  }

  const dataInicio = new Date(Number(a1), Number(m1) - 1, Number(d1));
  const dataFim = new Date(Number(a2), Number(m2) - 1, Number(d2));

  const datas: string[] = [];
  const dataAtual = new Date(dataInicio);

  while (dataAtual <= dataFim) {
    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();

    datas.push(`${dia}/${mes}/${ano} ${horario}`);
    dataAtual.setDate(dataAtual.getDate() + 1);
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