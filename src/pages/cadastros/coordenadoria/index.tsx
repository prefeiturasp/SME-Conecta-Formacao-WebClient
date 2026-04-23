import { Button, Col, Row } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPage from "~/components/lib/header-page";
import ButtonVoltar from "~/components/main/button/voltar";
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from "~/core/constants/ids/button/intex";
import { CadastroCoordenadoriaDTO } from "~/core/dto/cadastro-coordenadoria-dto";
import { MenuEnum } from "~/core/enum/menu-enum";
import { ROUTES } from "~/core/enum/routes-enum";
import { onClickVoltar } from "~/core/utils/form";
import { obterPermissaoPorMenu } from "~/core/utils/perfil";
import ModalSalvarCoordenadoria from "./components/modal-salvar-coordernadoria/modal-salvar-coordernadoria";
import { criarCoordenadoria } from "~/core/services/coordenadoria-service";
import { notification } from "~/components/lib/notification";

const ListCoordenadoria: React.FC = () => {
    const navigate = useNavigate();
    
    const [filters, setFilters] = useState({ nome: '', sigla: '' });
    const [listaCoordenadorias, setListaCoordenadorias] = useState<CadastroCoordenadoriaDTO[]>([]);
    const [modalSalvarVisivel, setModalSalvarVisivel] = useState(false);
    const [coordenadoriaSelecionada, setCoordenadoriaSelecionada] = useState<CadastroCoordenadoriaDTO>();

    const permissao = obterPermissaoPorMenu(MenuEnum.Coordenadoria);

    const columns: ColumnsType<CadastroCoordenadoriaDTO> = [
        {
            key: 'nome',
            title: 'Nome',
            dataIndex: 'nome',
        },
        {
            key: 'sigla',
            title: 'Sigla',
            dataIndex: 'sigla',
        },
    ];

    const onClickNovo = () => setModalSalvarVisivel(true);

    const onClickEditar = (id: number) => {
        const coordenadoria = listaCoordenadorias.find(c => c.id === id);
        if (coordenadoria) {
            setCoordenadoriaSelecionada(coordenadoria);
            setModalSalvarVisivel(true);
        }
    }

    const onConfirmModal = async (coordenadoria: CadastroCoordenadoriaDTO) => {
        var response = await criarCoordenadoria(coordenadoria);
        console.log('Resposta da API:', response);

        tratarRespostaSalvar(response);
        setModalSalvarVisivel(false);
    }

    const onCancelModal = () => {
        setModalSalvarVisivel(false);
        setCoordenadoriaSelecionada(undefined);
    }

    const tratarRespostaSalvar = (response: any) => {
        if (response.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'Coordenadoria criada com sucesso!',
          });
        } else {
          const mensagensErro = response.mensagens ?? [];
          const mensagemPadrao = 'Erro ao salvar o registro';
          const mensagemDetalhada =
            mensagensErro.length > 0 ? mensagensErro.join(', ') : mensagemPadrao;
          console.error('Erro da API:', mensagensErro);
          notification.error({ message: 'Erro ao salvar', description: mensagemDetalhada });
        }
      };

    return (
        <Col>
            <HeaderPage title='Coordenadoria'>
                <Col span={24}>
                <Row gutter={[8, 8]}>
                    <Col>
                    <ButtonVoltar
                        onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                        id={CF_BUTTON_VOLTAR}
                    />
                    </Col>
                    <Col>
                    <Button
                        block
                        type='primary'
                        htmlType='submit'
                        id={CF_BUTTON_NOVO}
                        style={{ fontWeight: 700 }}
                        onClick={() => onClickNovo()}
                        // disabled={!permissao?.podeIncluir}
                    >
                        Novo
                    </Button>
                    </Col>
                </Row>
                </Col>
            </HeaderPage>
            {modalSalvarVisivel && (
                <ModalSalvarCoordenadoria
                    visible={modalSalvarVisivel}
                    onConfirm={onConfirmModal}
                    onCancel={onCancelModal}
                    coordenadoriaInicial={coordenadoriaSelecionada}
                />
            )}
        </Col>
    );
}

export default ListCoordenadoria;