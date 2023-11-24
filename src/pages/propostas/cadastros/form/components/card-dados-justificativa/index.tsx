import { Card, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PropostaParecerDTO } from '~/core/dto/proposta-parecer-dto';
import { obterParecerProposta } from '~/core/services/proposta-service';

const Container = styled.div`
  .ant-card-head {
    min-height: auto;
    padding: 0 0 0 24px;
    height: 35px;
    .ant-card-head-title {
      padding: 0;
    }
  }
  .anticon {
    vertical-align: middle;
  }
  .fa {
    margin: 0 !important;
  }
  .display-block {
    display: block !important;
  }
`;

type CardDadosJustificativaProps = {
  id: string | 0;
};

const CardDadosJustificativa: FC<CardDadosJustificativaProps> = ({ id }) => {
  const [parecer, setParecer] = useState<PropostaParecerDTO>();
  const [loading, setLoading] = useState<boolean>(false);

  const obterDados = async () => {
    if (!parecer) {
      setLoading(true);

      const resposta = await obterParecerProposta(id);
      if (resposta.sucesso) {
        setParecer(resposta.dados);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <>
      {parecer?.justificativa && (
        <Container>
          <Card
            type='inner'
            title='Justificativa'
            headStyle={{ borderBottomRightRadius: 0 }}
            bodyStyle={{ borderTopRightRadius: 0 }}
            loading={loading}
          >
            <Typography
              style={{ fontSize: 16, height: 'auto', width: 'auto', textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: parecer?.justificativa || '' }}
            />
          </Card>
        </Container>
      )}
    </>
  );
};

export default CardDadosJustificativa;
