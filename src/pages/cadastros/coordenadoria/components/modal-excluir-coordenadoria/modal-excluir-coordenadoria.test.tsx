/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import ModalDeleteCoordenadoria from "./modal-excluir-coordenadoria";

jest.mock("~/components/lib/modal", () => {
    return {
        __esModule: true,
        default: ({
            title,
            children,
            footer,
            open,
            onCancel,
            className,
        }: any) => {

            if (!open) return null;

            return (
                <div data-testid="modal" className={className}>

                    <div data-testid="modal-title">
                        {title}
                    </div>

                    <div>
                        {children}
                    </div>

                    <button
                        data-testid="modal-cancel"
                        onClick={onCancel}
                    >
                        fechar modal
                    </button>

                    <div>
                        {footer}
                    </div>

                </div>
            );
        }
    };
});

describe("ModalDeleteCoordenadoria", () => {
    const setup = (
        props = {}
    ) => {
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        render(
            <ModalDeleteCoordenadoria
                visible
                onCancel={onCancel}
                onConfirm={onConfirm}
                {...props}
            />
        );
        return {
            onCancel,
            onConfirm,
        };
    };

    it("deve renderizar o modal de exclusão", () => {
        setup();
        expect(
            screen.getByText("Excluir coordenadoria")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Essa ação não poderá ser desfeita. Deseja continuar?"
            )
        ).toBeInTheDocument();
    });

    it("deve aplicar classe correta no modal", () => {
        setup();
        expect(
            screen.getByTestId("modal")
        ).toHaveClass(
            "modal-excluir-coordenadoria"
        );
    });

    it("deve chamar onCancel ao clicar em cancelar", () => {
        const {
            onCancel
        } = setup();
        fireEvent.click(
            screen.getByText("Cancelar")
        );
        expect(onCancel)
            .toHaveBeenCalledTimes(1);
        });

    it("deve chamar onConfirm ao clicar em excluir", () => {
        const {
            onConfirm
        } = setup();
        fireEvent.click(
            screen.getByText("Excluir")
        );
        expect(onConfirm)
            .toHaveBeenCalledTimes(1);
    });

    it("deve renderizar botão excluir com loading", () => {
        setup({
            loading:true
        });
        const botaoExcluir =
            screen.getByText("Excluir");
        expect(botaoExcluir)
            .toBeInTheDocument();
    });

    it("não deve renderizar quando visible=false",()=>{
        render(
            <ModalDeleteCoordenadoria
                visible={false}
                onCancel={jest.fn()}
                onConfirm={jest.fn()}
            />
        );
        expect(
            screen.queryByTestId("modal")
        )
        .not
        .toBeInTheDocument();
    });
    it("deve fechar modal pelo onCancel do componente Modal",()=>{
        const {
            onCancel
        } = setup();
        fireEvent.click(
            screen.getByTestId("modal-cancel")
        );
        expect(onCancel)
            .toHaveBeenCalled();
    });
});