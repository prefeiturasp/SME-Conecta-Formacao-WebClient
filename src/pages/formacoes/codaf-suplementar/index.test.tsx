import { describe, expect, test } from '@jest/globals';

describe('CodafSuplementar - Regras de Negócio', () => {
  const CODAF_SUPLEMENTAR_STATUS = {
    INICIADO: 1,
    AGUARDANDO_FINALIZACAO: 2,
    FINALIZADO: 3,
  } as const;

  const CERTIFICADO_STATUS = {
    SEM_CERTIFICADO: 0,
    NAO_EMITIDOS: 1,
    PODE_EMITIR: 2,
    EMITINDO: 3,
    EMITIDOS: 4,
  } as const;

  const getTrainingStatusLabel = (status: number) => {
    const labelsByStatus: Record<number, string> = {
      [CODAF_SUPLEMENTAR_STATUS.INICIADO]: 'Iniciado',
      [CODAF_SUPLEMENTAR_STATUS.AGUARDANDO_FINALIZACAO]: 'Aguardando finalização',
      [CODAF_SUPLEMENTAR_STATUS.FINALIZADO]: 'Finalizado',
    };

    return labelsByStatus[status] ?? 'Desconhecido';
  };

  const buildCertificateState = (status?: number) => {
    const stateByStatus: Record<number, { label: string; disabled: boolean }> = {
      [CERTIFICADO_STATUS.SEM_CERTIFICADO]: { label: 'Sem certificado', disabled: true },
      [CERTIFICADO_STATUS.NAO_EMITIDOS]: { label: 'Não emitidos', disabled: true },
      [CERTIFICADO_STATUS.PODE_EMITIR]: { label: 'Emitir certificados', disabled: false },
      [CERTIFICADO_STATUS.EMITINDO]: { label: 'Emitindo certificado', disabled: true },
      [CERTIFICADO_STATUS.EMITIDOS]: { label: 'Certificados emitidos', disabled: true },
    };

    return stateByStatus[status ?? -1] ?? { label: '—', disabled: true };
  };

  const buildReportFileName = (numeroHomologacao: number, nomeTurma: string) =>
    `CODAF_${numeroHomologacao}_${nomeTurma.replaceAll(' ', '_')}.xlsx`;

  const resolveHeaderFileName = (contentDisposition: string | undefined, fallback: string) => {
    if (!contentDisposition) {
      return fallback;
    }

    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    return fileNameMatch?.[1]?.replaceAll("'", '').replaceAll('"', '') || fallback;
  };

  const getActionPermissions = (
    status: number,
    statusCertificacaoTurma: number,
    codigoCursoEol: number | null,
    isDfAdmin: boolean,
  ) => {
    const hasEolCourseCode = codigoCursoEol != null;
    const waitingForFinalization =
      status === CODAF_SUPLEMENTAR_STATUS.AGUARDANDO_FINALIZACAO;
    const finished = status === CODAF_SUPLEMENTAR_STATUS.FINALIZADO;
    const certificatesReady = statusCertificacaoTurma === CERTIFICADO_STATUS.EMITIDOS;
    const commonTxtAllowed = waitingForFinalization && hasEolCourseCode;
    const adminTxtAllowed = finished && isDfAdmin;

    return {
      txtAllowed: commonTxtAllowed || adminTxtAllowed,
      certificatesReady,
    };
  };

  test('deve mapear status da formação corretamente', () => {
    expect(getTrainingStatusLabel(1)).toBe('Iniciado');
    expect(getTrainingStatusLabel(2)).toBe('Aguardando finalização');
    expect(getTrainingStatusLabel(3)).toBe('Finalizado');
  });

  test('deve retornar Desconhecido para status não mapeado', () => {
    expect(getTrainingStatusLabel(999)).toBe('Desconhecido');
  });

  test('deve montar estado do certificado para cada status', () => {
    expect(buildCertificateState(0)).toEqual({ label: 'Sem certificado', disabled: true });
    expect(buildCertificateState(1)).toEqual({ label: 'Não emitidos', disabled: true });
    expect(buildCertificateState(2)).toEqual({ label: 'Emitir certificados', disabled: false });
    expect(buildCertificateState(3)).toEqual({ label: 'Emitindo certificado', disabled: true });
    expect(buildCertificateState(4)).toEqual({ label: 'Certificados emitidos', disabled: true });
  });

  test('deve montar nome do relatório trocando todos os espaços', () => {
    const fileName = buildReportFileName(1234, 'Turma A B C');
    expect(fileName).toBe('CODAF_1234_Turma_A_B_C.xlsx');
  });

  test('deve resolver nome do arquivo via content-disposition', () => {
    const fileName = resolveHeaderFileName('attachment; filename="arquivo_final.xlsx"', 'fallback.xlsx');
    expect(fileName).toBe('arquivo_final.xlsx');
  });

  test('deve usar fallback quando header estiver ausente', () => {
    expect(resolveHeaderFileName(undefined, 'fallback.xlsx')).toBe('fallback.xlsx');
  });

  test('deve habilitar TXT EOL para aguardando finalização com código EOL', () => {
    const result = getActionPermissions(2, 1, 777, false);
    expect(result.txtAllowed).toBe(true);
  });

  test('deve habilitar TXT EOL para admin DF quando status finalizado', () => {
    const result = getActionPermissions(3, 1, null, true);
    expect(result.txtAllowed).toBe(true);
  });

  test('deve habilitar download CODAF somente quando certificados emitidos', () => {
    expect(getActionPermissions(2, 4, 999, false).certificatesReady).toBe(true);
    expect(getActionPermissions(2, 3, 999, false).certificatesReady).toBe(false);
  });
});
