import { useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import Modal from "~/components/lib/modal";
import { CadastroCoordenadoriaDTO } from "~/core/services/coordenadoria-service";
import { DeleteFilled } from "@ant-design/icons";
import { FaTrashAlt } from "react-icons/fa";

interface ModalSalvarCoordenadoriaProps {
    visible: boolean;
    modoEdicao: boolean;
    onConfirm: (coordenadoria: CadastroCoordenadoriaDTO) => void;
    onCancel: () => void;
    onDelete?: () => void;
    loading?: boolean;
    coordenadoriaInicial?: CadastroCoordenadoriaDTO;
}

const ModalSalvarCoordenadoria: React.FC<ModalSalvarCoordenadoriaProps> = ({
    visible,
    modoEdicao,
    onConfirm,
    onCancel,
    onDelete,
    loading,
    coordenadoriaInicial,
}) => {
    const [form] = Form.useForm();

    const titulo = modoEdicao ? 'Editar Coordenadoria' : 'Adicionar coordenadoria';
    const descricao = modoEdicao
        ? 'Você pode editar o nome e a sigla da coordenadoria. Essa informação poderá ser usada no cadastro de áreas promotoras e na emissão de certificados.' 
        : 'Adicione uma nova coordenadoria. Essa informação poderá ser usada no cadastro de áreas promotoras e na emissão de certificados.';

    useEffect(() => {
        if (visible) {
            if (modoEdicao) {
                form.setFieldsValue({
                    nome: coordenadoriaInicial?.nome,
                    sigla: coordenadoriaInicial?.sigla,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, modoEdicao, coordenadoriaInicial, form]);

    const handleConfirm = (values: { nome: string; sigla: string }) => {
        const coordenadoria: CadastroCoordenadoriaDTO = {
            id: coordenadoriaInicial?.id ?? 0,
            nome: values.nome,
            sigla: values.sigla,
        };
        onConfirm(coordenadoria);
    }

    const customFooter = (
        <div style={{ display: 'flex', justifyContent: modoEdicao ? 'space-between' : 'flex-end', alignItems: 'center', width: '100%' }}>
            
            <div>
                {modoEdicao && (
                    <Button
                        onClick={onDelete}
                        icon={<FaTrashAlt />}
                        style={{
                            display: "flex",
                            height: "40px",
                            padding: "0 16px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            borderRadius: "4px",
                            border: "1px solid #B40C02",
                            background: "#FFF",
                            color: "#B40C02",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 700,
                        }}
                    >
                        Excluir
                    </Button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    onClick={onCancel}
                    style={{
                        height: "40px",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "1px solid #FF9A52",
                        background: "#FFF",
                        color: "#FF9A52",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 700,
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={() => form.submit()}
                    loading={loading}
                    style={{
                        height: "40px",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        background: "#FF9A52",
                        border: "none",
                        color: "#FFF",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 700,
                    }}
                >
                    Salvar
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <style>{`
                .modal-coordenadoria .ant-modal-header {
                    border-bottom: none !important;
                }
                .modal-coordenadoria .ant-modal-footer {
                    border-top: none !important;
                    padding-top: 16px !important;
                }

                .modal-coordenadoria .custom-label {
                    color: #42474A;
                    font-family: 'Roboto', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    transition: color 0.3s ease;
                }

                .modal-coordenadoria .ant-form-item-has-error .custom-label {
                    color: #B40C02 !important;
                }

                .modal-coordenadoria .ant-form-item-explain-error {
                    color: #B40C02 !important;
                    font-family: 'Roboto', sans-serif !important;
                    font-size: 12px !important;
                    font-weight: 400 !important;
                    margin-top: 4px;
                }
            `}</style>
            <Modal
                className="modal-coordenadoria"
                title={
                    <span
                        style={{ 
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#42474A", 
                        }}>{titulo}</span>
                }
                open={visible}
                onCancel={onCancel}
                centered
                width={600}
                onOk={() => form.submit()}
                okText="Salvar"
                cancelText="Cancelar"
                confirmLoading={loading}
                footer={customFooter}
                styles={{
                    header: { borderBottom: 'none', paddingBottom: '0' }, 
                    footer: { borderTop: 'none', paddingTop: '16px' }
                }}
            >
                <Typography.Paragraph style={{marginBottom: "24px", marginTop: "16px", color: "#666"}}>
                    {descricao}
                </Typography.Paragraph>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirm}
                    autoComplete="off"
                    requiredMark={false}
                >
                    <Form.Item
                        name="nome"
                        label={
                            <span className="custom-label">
                                *Nome da coordenadoria
                            </span>
                        }
                        rules={[
                            { required: true, message: "Campo obrigatório" },
                        ]}
                    >
                        <Input placeholder="Digite o nome da coordenadoria" size="large" onPressEnter={() => form.submit()} />
                    </Form.Item>

                    <Form.Item
                        name="sigla"
                        label={
                            <span className="custom-label">
                                Sigla
                            </span>
                        }
                    >
                        <Input placeholder="Digite a sigla" size="large" onPressEnter={() => form.submit()} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ModalSalvarCoordenadoria;