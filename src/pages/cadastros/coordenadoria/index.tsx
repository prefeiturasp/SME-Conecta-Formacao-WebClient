import { Button, Col, Form, Row, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

import HeaderPage from "~/components/lib/header-page";
import ButtonVoltar from "~/components/main/button/voltar";
import CardContent from "~/components/lib/card-content";
import InputTexto from "~/components/main/text/input-text";
import DataTable from "~/components/lib/card-table";
import { notification } from "~/components/lib/notification";

import ModalSalvarCoordenadoria from "./components/modal-salvar-coordernadoria/modal-salvar-coordernadoria";
import ModalVinculoAreaPromotora from "./components/modal-vinculo-area-promotora/modal-vinculo-area-promotora";
import ModalDeleteCoordenadoria from "./components/modal-excluir-coordenadoria/modal-excluir-coordenadoria";

import { MenuEnum } from "~/core/enum/menu-enum";
import { ROUTES } from "~/core/enum/routes-enum";
import { onClickVoltar } from "~/core/utils/form";
import { obterPermissaoPorMenu } from "~/core/utils/perfil";
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from "~/core/constants/ids/button/intex";
import { CF_INPUT_NOME_COORDENADORIA, CF_INPUT_SIGLA_COORDENADORIA } from "~/core/constants/ids/input";
import { 
    atualizarCoordenadoria, 
    CadastroCoordenadoriaDTO, 
    criarCoordenadoria, 
    excluirCoordenadoria, 
    obterCoordenadoriaPorId 
} from "~/core/services/coordenadoria-service";

const ListCoordenadoria: React.FC = () => {
    const navigate = useNavigate();    
    const [form] = useForm();

    const [filter, setFilter] = useState({ nome: '', sigla: '' });
    const [realizouBusca, setRealizouBusca] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [coordenadoriaSelecionada, setCoordenadoriaSelecionada] = useState<CadastroCoordenadoriaDTO>();

    const [modalSalvarVisivel, setModalSalvarVisivel] = useState(false);
    const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);
    const [modalVinculoAreaPromotoraVisivel, setModalVinculoAreaPromotoraVisivel] = useState(false);

    const API_URL = 'v1/Coordenadoria';
    const permissao = obterPermissaoPorMenu(MenuEnum.Coordenadoria);

    const columns: ColumnsType<CadastroCoordenadoriaDTO> = [
        { key: 'nome', title: 'Nome', dataIndex: 'nome' },
        { key: 'sigla', title: 'Sigla', dataIndex: 'sigla' },
    ];

    const onClickNovo = () => {
        setModoEdicao(false);
        setModalSalvarVisivel(true);
        setCoordenadoriaSelecionada(undefined);
    }

    const onClickEditar = async (coordenadoria: CadastroCoordenadoriaDTO) => {
        const response = await obterCoordenadoriaPorId(coordenadoria.id);
        if (response.sucesso && response.dados) {
            setCoordenadoriaSelecionada(response.dados);
            setModoEdicao(true);
            setModalSalvarVisivel(true);
        }
    }

    const onConfirmModal = async (coordenadoria: CadastroCoordenadoriaDTO) => {
        const response = modoEdicao
            ? await atualizarCoordenadoria(coordenadoria.id, coordenadoria)
            : await criarCoordenadoria(coordenadoria);
        console.log('Resposta da API:', response);

        tratarRespostaSalvar(response);

        if (response?.sucesso) {
            setModalSalvarVisivel(false);
            setCoordenadoriaSelecionada(undefined);
            obterDadosFiltrados();
        }
    }

    const onCancelModal = () => {
        setModalSalvarVisivel(false);
        setCoordenadoriaSelecionada(undefined);
    }

    const onDeleteModal = () => {
        setModalExcluirVisivel(true);
        setModalSalvarVisivel(false);
    }

    const onClickDeletarModal = () => {
        setModalExcluirVisivel(false);
        if (!coordenadoriaSelecionada) return;
        if (
            coordenadoriaSelecionada?.areasPromotoras && 
            coordenadoriaSelecionada.areasPromotoras.length > 0
        ) {
            setModalVinculoAreaPromotoraVisivel(true);
        } else {
            excluirCoordenadoria(coordenadoriaSelecionada.id).then(response => {
                if (response.sucesso) {
                    notification.success({
                        message: 'Sucesso',
                        description: 'Coordenadoria excluída com sucesso!',
                    });
                    obterDadosFiltrados();
                } else {
                    const mensagensErro = response.mensagens ?? [];
                    const mensagemPadrao = 'Erro ao excluir o registro';
                    const mensagemDetalhada =
                        mensagensErro.length > 0 ? mensagensErro.join(', ') : mensagemPadrao;
                    console.error('Erro da API:', mensagensErro);
                    notification.error({ message: 'Erro ao excluir', description: mensagemDetalhada });
                }
            });
        }
    }

    const tratarRespostaSalvar = (response: any) => {
        if (response.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: modoEdicao ? 'Coordenadoria atualizada com sucesso!' : 'Coordenadoria criada com sucesso!',
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

    const obterDadosFiltrados = useCallback(() => {
        setRealizouBusca(true);
        const nome = form.getFieldValue('nomeCoordenadoria') ?? '';
        const sigla = form.getFieldValue('siglaCoordenadoria') ?? '';

        if (!nome && !sigla) {
            setRealizouBusca(false);
        }
        setFilter({ nome, sigla });
    }, [filter])

    return (
        <Col>
            <HeaderPage title='Cadastro coordenadorias'>
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
                        disabled={!permissao?.podeIncluir}
                    >
                        Adicionar coordenadoria
                    </Button>
                    </Col>
                </Row>
                </Col>
            </HeaderPage>
            <Form form={form} layout='vertical' autoComplete='off' initialValues={{ nome: '', sigla: '' }}>
                <CardContent>
                    <Form.Item shouldUpdate>
                        <Row gutter={[16, 8]}>
                            <Col span={24}>
                                <Typography.Title level={4} style={{ marginBottom: 0 }}>
                                    Refine sua busca
                                </Typography.Title>
                            </Col>
                            <Col span={24}>
                                <Typography.Paragraph style={{ marginBottom: 0, color: "#42474A" }}>
                                    Utilize o filtro para localizar as coordenadorias
                                </Typography.Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <b>
                                    <InputTexto
                                        formItemProps={{
                                            label: 'Nome',
                                            name: 'nomeCoordenadoria',
                                            rules: [{ required: false }],                                            
                                        }}
                                        inputProps={{
                                            id: CF_INPUT_NOME_COORDENADORIA,
                                            placeholder: 'Digite o nome',
                                            maxLength: 100,
                                            onChange: obterDadosFiltrados,
                                        }}
                                    />
                                </b>
                            </Col>
                            <Col xs={24} sm={12}>
                                <b>
                                    <InputTexto
                                        formItemProps={{
                                            label: 'Sigla',
                                            name: 'siglaCoordenadoria',
                                            rules: [{ required: false }],
                                        }}
                                        inputProps={{
                                            id: CF_INPUT_SIGLA_COORDENADORIA,
                                            placeholder: 'Digite a sigla',
                                            maxLength: 10,
                                            onChange: obterDadosFiltrados,
                                        }}
                                    />
                                </b>
                            </Col>
                            <Col span={24}>
                                <DataTable
                                    filters={filter}
                                    realizouFiltro={realizouBusca}
                                    alterarRealizouFiltro={setRealizouBusca}
                                    url={API_URL}
                                    columns={columns}
                                    rowKey='id'
                                    onRow={(record) => ({
                                        onClick: () => onClickEditar(record),
                                    })}
                                />  
                            </Col>
                        </Row>
                    </Form.Item>

                </CardContent>
            </Form>
            {modalSalvarVisivel && (
                <ModalSalvarCoordenadoria
                    visible={modalSalvarVisivel}
                    onConfirm={onConfirmModal}
                    onCancel={onCancelModal}
                    onDelete={onDeleteModal}
                    coordenadoriaInicial={coordenadoriaSelecionada}
                    modoEdicao={modoEdicao}
                />
            )}
            {modalVinculoAreaPromotoraVisivel && (
                <ModalVinculoAreaPromotora
                    visible={modalVinculoAreaPromotoraVisivel}
                    onClose={() => setModalVinculoAreaPromotoraVisivel(false)}
                    areasPromotoras={coordenadoriaSelecionada?.areasPromotoras}
                />
            )}
            {modalExcluirVisivel && (
                <ModalDeleteCoordenadoria
                    visible={modalExcluirVisivel}
                    onCancel={() => setModalExcluirVisivel(false)}
                    onConfirm={onClickDeletarModal}
                />)}
        </Col>
    );
}

export default ListCoordenadoria;