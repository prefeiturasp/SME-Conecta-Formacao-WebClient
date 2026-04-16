import React from 'react';
import { Card, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { titleStyle, contentStyle, iconStyle } from './styles';
import {
  DataEncontroNovoDTO,
  RetornoTurmaDetalheDTO,
} from '~/core/dto/dados-formacao-area-publica-dto';

type EncontroExpandido = { data: string; horaInicial: string; horaFinal: string };

const parseDateBR = (data: string): Date => {
  const [dia, mes, ano] = data.split('/');
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
};

const formatarData = (data: string): string => {
  const d = new Date(data);
  if (isNaN(d.getTime())) return data;
  return d.toLocaleDateString('pt-BR');
};

const expandirEncontro = (encontro: DataEncontroNovoDTO): EncontroExpandido[] => {
  if (!encontro.dataFinal) {
    return [
      {
        data: encontro.dataInicial,
        horaInicial: encontro.horaInicial,
        horaFinal: encontro.horaFinal,
      },
    ];
  }
  const linhas: EncontroExpandido[] = [];
  const atual = parseDateBR(encontro.dataInicial);
  const fim = parseDateBR(encontro.dataFinal);
  while (atual <= fim) {
    linhas.push({
      data: atual.toLocaleDateString('pt-BR'),
      horaInicial: encontro.horaInicial,
      horaFinal: encontro.horaFinal,
    });
    atual.setDate(atual.getDate() + 1);
  }
  return linhas;
};

const tooltipStyle = {
  fontFamily: 'Roboto',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '100%',
  letterSpacing: '0%',
  textAlign: 'center' as const,
};

const CardTurmasPublico = ({ turma }: { turma: RetornoTurmaDetalheDTO }) => {
  const { nome, local, dataInicio, dataFim, dataEncontrosNovo, modeloHorario } = turma;

  const encontros =
    modeloHorario === 'legado'
      ? (dataEncontrosNovo ?? []).flatMap(expandirEncontro)
      : (dataEncontrosNovo ?? []).map((e) => ({
          data: e.dataInicial,
          horaInicial: e.horaInicial,
          horaFinal: e.horaFinal,
        }));

  const periodoRealizacao =
    dataInicio && dataFim
      ? `De ${formatarData(dataInicio)} à ${formatarData(dataFim)}`
      : dataInicio
      ? `De ${formatarData(dataInicio)}`
      : dataFim
      ? `Até ${formatarData(dataFim)}`
      : null;

  return (
    <Card
      title={<span style={{ fontWeight: 'bold', color: 'white' }}>{nome}</span>}
      style={{ borderRadius: '12px' }}
      headStyle={{ backgroundColor: '#E48F47', borderBottom: 'none' }}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={titleStyle}>
          Datas de realização:
          <Tooltip
            title='Período total da formação, do início ao fim, incluindo encontros presenciais e online.'
            placement='top'
            arrow={{ pointAtCenter: true }}
            overlayInnerStyle={tooltipStyle}
          >
            <InfoCircleFilled style={iconStyle} />
          </Tooltip>
        </div>
        {periodoRealizacao && <div style={contentStyle}>{periodoRealizacao}</div>}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={titleStyle}>Local:</div>
        <div style={contentStyle}>{local}</div>
      </div>

      <div>
        <div style={titleStyle}>
          Datas dos encontros*:
          <Tooltip
            title='Datas dos encontros em grupo da formação, que podem ser presenciais ou online.'
            placement='top'
            arrow={{ pointAtCenter: true }}
            overlayInnerStyle={tooltipStyle}
          >
            <InfoCircleFilled style={iconStyle} />
          </Tooltip>
        </div>
        <div style={contentStyle}>
          {encontros.map((encontro) => (
            <div style={{ marginBottom: 3 }} key={`${encontro.data}-${encontro.horaInicial}`}>
              {encontro.data} {encontro.horaInicial} - {encontro.horaFinal}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CardTurmasPublico;
