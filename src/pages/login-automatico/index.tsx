import { Button, Col, Result } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import usuarioService from '~/core/services/usuario-service';

import { useNavigate, useParams } from 'react-router-dom';
import Spin from '~/components/main/spin';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import { validarAutenticacao } from '~/core/utils/perfil';

const LoginAutomatico = () => {
  const navigate = useNavigate();

  const paramsRoute = useParams();

  const token = paramsRoute?.token || '';

  const [tokenValido, setTokenValido] = useState<boolean>(true);
  const [validandoToken, setValidandoToken] = useState<boolean>(!!token);
  const [erroGeral, setErroGeral] = useState<string[]>();

  const validarToken = useCallback(() => {
    setValidandoToken(true);

    usuarioService
      .validaEmailToken(token)
      .then((resposta) => {
        if (resposta.sucesso) {
          setTokenValido(true);
          validarAutenticacao(resposta.dados);
          navigate(ROUTES.PRINCIPAL);
        } else {
          setTokenValido(false);
          setErroGeral(resposta.mensagens);
        }
      })
      .catch(() => {
        setTokenValido(false);
      })
      .finally(() => setValidandoToken(false));
  }, [token]);

  useEffect(() => {
    if (token) validarToken();
  }, [token, validarToken]);

  const onClickVoltar = () => navigate(ROUTES.LOGIN);

  if (!validandoToken && !tokenValido)
    return (
      <Result
        title={erroGeral}
        status='500'
        extra={[
          <Button
            type='default'
            block
            style={{ fontWeight: 700 }}
            onClick={() => onClickVoltar()}
            id={CF_BUTTON_VOLTAR}
          >
            Voltar
          </Button>,
        ]}
      />
    );

  return (
    <Col span={14}>
      <Spin spinning={validandoToken} tip='Validando token...'>
        {tokenValido ? <Result title='Email validado com sucesso!' status='success' /> : <></>}
      </Spin>
    </Col>
  );
};

export default LoginAutomatico;
