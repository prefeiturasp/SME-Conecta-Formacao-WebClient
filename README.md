# SME Conecta Formação WebClient

Aplicação web para gestão e acompanhamento de formações de profissionais da educação da Rede Municipal de São Paulo.

---

## Sobre o Conecta Formação

> O **Conecta Formação** é um sistema de gestão de informações voltado para a administração de formações e cursos, especialmente para a área educacional. Ele não é um LMS (sistema de gestão de aprendizagem), mas integra-se a um LMS (no caso, o SGA/Google Classroom) para facilitar a gestão de propostas de formação, inscrições e fluxos de aprovação.

### Para que serve o Conecta Formação

- **Cadastro e Gestão de Propostas de Formação:** Permite que áreas da SME (Secretaria Municipal de Educação) cadastrem propostas de cursos/formações, que podem passar por fluxos de validação e homologação, dependendo do tipo de curso.
- **Gestão de Inscrições:** Gerencia inscrições em cursos de diversas formas: optativa (inscrição pelo usuário), automática (inscrição em massa baseada em regras como cargo ou modalidade), manual (inscrição feita pela área gestora) e externa (cursos realizados por sindicatos, por exemplo).
- **Integração com LMS:** Integra-se ao SGA (Google Classroom) para repassar informações dos cursos e inscrições, utilizando um serviço intermediário (GCA).
- **Controle de Turmas e Vagas:** Permite criar turmas por DRE (Diretoria Regional de Educação), controlar vagas, validar inscrições por cargo, função ou modalidade, e realizar sorteios quando há mais inscritos do que vagas.
- **Fluxos de Aprovação:** Cursos homologados passam por etapas de validação por diferentes setores antes de serem disponibilizados para inscrição.
- **Funcionalidades Adicionais:** Inclui recursos para transferência de inscrições entre turmas, reativação de inscrições canceladas, anexos de documentos na inscrição, e relatórios gerenciais.

**Em resumo:**
O Conecta Formação centraliza e automatiza o processo de criação, validação, inscrição e acompanhamento de cursos de formação, integrando-se a sistemas de aprendizagem e facilitando a gestão para áreas administrativas e usuários finais.

## Como executar

1. Instale o Node.js e o yarn.
2. Clone o repositório:
   ```powershell
   git clone https://github.com/sme-sp/sme-conecta-formacao-webclient.git
   cd sme-conecta-formacao-webclient
   ```
3. Instale as dependências:
   ```powershell
   yarn install
   ```
4. Configure o arquivo `.env.development` conforme necessário.
5. Inicie o projeto:
   ```powershell
   yarn start
   ```
6. Acesse `http://localhost:3000` no navegador.

## Tecnologias principais
- React
- TypeScript
- Vite


---


