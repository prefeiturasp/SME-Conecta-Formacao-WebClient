import { useLocation, useParams } from 'react-router-dom';
import { INPUTS_NAMES } from '~/core/constants/inputs-cadastros';
import { ROUTES } from '~/core/enum/routes-enum';
import FormCadastrosAreaPromotora, { FormConfigCadastros } from '.';

const FormConfigCadastroAreaPromotora: React.FC = () => {
  const paramsRoute = useParams();
  const location = useLocation();

  const pathname = location.pathname;

  const paramsConfigPage: FormConfigCadastros[] = [
    {
      breadcrumb: {
        mainPage: 'Area Promotora',
        urlMainPage: ROUTES.AREA_PROMOTORA,
        title: paramsRoute?.id ? 'Editar' : 'Novo',
      },
      page: {
        title: 'Area Promotora',
        urlBase: 'v1/AreaPromotora',
        inputs: [
          {
            nome: INPUTS_NAMES.TEXT.NOME,
            tipo: INPUTS_NAMES.TEXT.TIPO,
            grupoId: INPUTS_NAMES.TEXT.PERFIL,
            telefones: INPUTS_NAMES.TEXT.TELEFONE,
            email: INPUTS_NAMES.TEXT.EMAIL,
          },
        ],
      },
    },
  ];

  const getFormParams = (): FormConfigCadastros | undefined => {
    const configAtual = paramsConfigPage.find((item: FormConfigCadastros) =>
      pathname.includes(item.breadcrumb.urlMainPage),
    );

    return configAtual;
  };

  const formParams = getFormParams();

  if (!formParams) return <></>;

  return <FormCadastrosAreaPromotora {...formParams} />;
};
export default FormConfigCadastroAreaPromotora;
