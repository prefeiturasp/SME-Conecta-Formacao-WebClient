import React from "react";
import { Card, Tooltip } from "antd";
import { titleStyle, contentStyle, iconStyle } from './styles';
import { InfoCircleFilled } from "@ant-design/icons";


const CardTurmasPublico = ({ turma }: { turma: any }) => {
  const { nome, periodos, local, datasEncontros } = turma;

  const encontros = datasEncontros ?? [];

  const periodoTotal = periodos?.[0]
    ? `De ${periodos[0].split(" - ")[0]} à ${periodos[0].split(" - ")[1]}`
    : "";

  return (
    <Card
      title={<span style={{ fontWeight: "bold", color: "white" }}>{nome}</span>}
      style={{ borderRadius: "12px" }}
      headStyle={{ backgroundColor: "#E48F47", borderBottom: "none" }}
    >
      
      <div style={{ marginBottom: 18 }}>
        <div style={titleStyle}>
          Datas de realização:
          <Tooltip title="Período total da formação, do início ao fim, incluindo encontros presenciais e online."
            placement="top"
            arrow={{ pointAtCenter: true }}
            overlayInnerStyle={{
              fontFamily: "Roboto",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
            }}>
            <InfoCircleFilled style={iconStyle} />
          </Tooltip>
        </div>
        <div style={contentStyle}>{periodoTotal}</div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={titleStyle}>Local:</div>
        <div style={contentStyle}>{local}</div>
      </div>

      <div>
        <div style={titleStyle}>
          Datas dos encontros:
          <Tooltip title="Datas dos encontros em grupo da formação, que podem ser presenciais ou online."
            placement="top"
            arrow={{ pointAtCenter: true }}
            overlayInnerStyle={{
              fontFamily: "Roboto",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
            }}>
            <InfoCircleFilled style={iconStyle} />
          </Tooltip>
        </div>
        <div style={contentStyle}>
          {encontros.map((data: string, index: number) => (
            <div style={{ marginBottom: 3 }} key={index}>{data}</div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CardTurmasPublico;