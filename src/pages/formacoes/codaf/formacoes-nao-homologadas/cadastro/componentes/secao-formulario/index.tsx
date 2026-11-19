import React from 'react';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { CampoSelectTurmaCodaf } from '~/pages/formacoes/codaf/shared/componentes/campo-select-turma-codaf';
import { CamposBaseFormularioCodaf } from '~/pages/formacoes/codaf/shared/componentes/campos-base-formulario-codaf';

interface SecaoFormularioProps {
  onChangeCodigoFormacao: (value: string) => void;
  onBlurCodigoFormacao: (value: string) => void;
  turmasFiltradas: RetornoListagemDTO[];
  turmaDisabled: boolean;
  tooltipAberto?: boolean;
  exibirTooltipTurma?: boolean;
  camposBloqueados: {
    numeroHomologacao: boolean;
    codigoFormacao: boolean;
    turma: boolean;
  };
}

export const SecaoFormulario: React.FC<SecaoFormularioProps> = ({
  onChangeCodigoFormacao,
  onBlurCodigoFormacao,
  turmasFiltradas,
  turmaDisabled,
  tooltipAberto = false,
  exibirTooltipTurma = false,
  camposBloqueados,
}) => {
  return (
    <div>
      <CamposBaseFormularioCodaf
        onChangeCodigoFormacao={onChangeCodigoFormacao}
        onBlurCodigoFormacao={onBlurCodigoFormacao}
        codigoFormacaoDisabled={camposBloqueados.codigoFormacao}
      >
        <CampoSelectTurmaCodaf
          turmas={turmasFiltradas}
          desabilitado={camposBloqueados.turma || turmaDisabled}
          exibirAvisoCodafExistente={exibirTooltipTurma}
          tooltipAberto={tooltipAberto}
        />
      </CamposBaseFormularioCodaf>
    </div>
  );
};