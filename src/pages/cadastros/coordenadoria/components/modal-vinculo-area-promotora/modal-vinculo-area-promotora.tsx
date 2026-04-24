import React from "react";
import { Button, Typography } from "antd";
import Modal from "~/components/lib/modal";
import { AreaPromotoraDTO } from "~/core/services/coordenadoria-service";

interface ModalVinculoAreaPromotoraProps {
    visible: boolean;
    onClose: () => void;
    areasPromotoras?: AreaPromotoraDTO[];
}

const ModalVinculoAreaPromotora: React.FC<ModalVinculoAreaPromotoraProps> = ({
    visible,
    onClose,
    areasPromotoras = [],
}) => {
    return (
        <>
            <style>{`
                .modal-vinculo-area .ant-modal-header {
                    border-bottom: none !important;
                }
                .modal-vinculo-area .ant-modal-footer {
                    border-top: none !important;
                    padding-top: 32px !important;
                }
            `}</style>
            <Modal
                className="modal-vinculo-area"
                title={
                    <span
                        style={{ 
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "100%",
                            color: "#42474A", 
                            fontFamily: "Roboto",
                        }}
                    >
                        Não é possível excluir a coordenadoria
                    </span>
                }
                open={visible}
                onCancel={onClose}
                centered
                width={600}
                styles={{
                    header: { borderBottom: 'none', paddingBottom: '0' }, 
                    footer: { borderTop: 'none' }
                }}
                footer={[
                    <Button
                        key="voltar"
                        onClick={onClose}
                        style={{
                            display: "inline-flex",
                            height: "40px",
                            padding: "8px 16px",
                            alignItems: "center",
                            gap: "10px",
                            borderRadius: "4px",
                            background: "#FF9A52",
                            border: "none",
                            color: "#FFF",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 700,
                        }}
                    >
                        Voltar
                    </Button>,
                ]}
            >
                <Typography.Paragraph 
                    style={{ 
                        marginTop: "32px", 
                        marginBottom: "32px", 
                        color: "#666", 
                        fontFamily: "Roboto",
                        fontSize: "14px" 
                    }}
                >
                    Esta coordenadoria está vinculada a uma ou mais áreas promotoras. Para continuar, acesse as áreas promotoras relacionadas e remova o vínculo com esta coordenadoria. Após isso, a exclusão estará disponível.
                </Typography.Paragraph>

                <div>
                    <Typography.Text 
                        strong 
                        style={{ 
                            display: "block", 
                            marginBottom: "16px", 
                            color: "#42474A",
                            fontFamily: "Roboto"
                        }}
                    >
                        Áreas promotoras vinculadas:
                    </Typography.Text>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {areasPromotoras.map((area) => (
                            <span 
                                key={area.id}
                                style={{
                                    display: "flex",
                                    padding: "4px 8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "4px",
                                    borderRadius: "4px",
                                    background: "#F0F0F0",
                                    color: "#42474A",
                                    fontFamily: "Roboto",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                }}
                            >
                                {area.nome}
                            </span>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalVinculoAreaPromotora;