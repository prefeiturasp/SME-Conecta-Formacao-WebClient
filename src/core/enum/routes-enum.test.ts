import { ROUTES } from './routes-enum';

describe('ROUTES Enum', () => {
  test('deve ter rotas principais definidas', () => {
    expect(ROUTES.PRINCIPAL).toBe('/');
    expect(ROUTES.LOGIN).toBe('/login');
    expect(ROUTES.CADASTRO).toBe('/cadastro');
  });

  test('todas as rotas devem começar com /', () => {
    const routes = Object.values(ROUTES);
    routes.forEach((route) => {
      expect(route).toMatch(/^\//);
    });
  });

  test('deve ter rotas de autenticação', () => {
    expect(ROUTES.REDEFINIR_SENHA).toBeDefined();
    expect(ROUTES.REDEFINIR_SENHA_TOKEN).toContain(':token');
    expect(ROUTES.LOGIN_AUTOMATICO_PELO_TOKEN).toContain(':token');
  });

  test('deve ter rotas de cadastro', () => {
    expect(ROUTES.CADASTRO_DE_USUARIO).toBe('/cadastre-se');
    expect(ROUTES.CADASTRO_DE_PROPOSTAS).toBeDefined();
    expect(ROUTES.AREA_PROMOTORA).toBeDefined();
  });

  test('deve ter rotas com parâmetros dinâmicos', () => {
    expect(ROUTES.CADASTRO_DE_PROPOSTAS_EDITAR).toContain(':id');
    expect(ROUTES.AREA_PROMOTORA_EDITAR).toContain(':id');
    expect(ROUTES.USUARIO_REDE_PARCERIA_EDITAR).toContain(':id');
  });

  test('deve ter rotas de formações e inscrições', () => {
    expect(ROUTES.FORMACAOES_INSCRICOES).toBe('/formacoes/inscricoes');
    expect(ROUTES.FORMACAOES_INSCRICOES_NOVO).toBeDefined();
    expect(ROUTES.FORMACAOES_INSCRICOES_POR_ARQUIVO).toBeDefined();
  });

  test('deve ter rotas de área pública', () => {
    expect(ROUTES.AREA_PUBLICA).toBe('/area-publica');
    expect(ROUTES.AREA_PUBLICA_VISUALIZAR_FORMACAO).toContain(':id');
  });

  test('todas as rotas devem ser strings', () => {
    const routes = Object.values(ROUTES);
    routes.forEach((route) => {
      expect(typeof route).toBe('string');
    });
  });

  test('não deve ter rotas duplicadas', () => {
    const routes = Object.values(ROUTES);
    const uniqueRoutes = new Set(routes);
    expect(routes.length).toBe(uniqueRoutes.size);
  });

  test('deve ter rota de notificações', () => {
    expect(ROUTES.NOTIFICACOES).toBe('/notificacoes');
    expect(ROUTES.NOTIFICACOES_DETALHES).toContain(':id');
  });
});
