import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FormProvider } from "../blocks/FormProvider";
import { useFormContext } from "../contexts/FormContext";


describe("FormProvider", () => {
    it("renders children correctly", () => {
        render(
            <FormProvider>
                <div data-testid="child">Child Content</div>
            </FormProvider>
        );

        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("provides form registry and management functions through context", async () => {
        const TestComponent = () => {
            const context = useFormContext();
            return (
                <div>
                    <span data-testid="registry-size">{context.registry.size}</span>
                    <button
                      data-testid="register-btn"
                      onClick={() => context.registerForm("test-id", { id: "test-form" } as unknown as UseFormReturn)}>
                        Register
                    </button>

                    <button
                      data-testid="unregister-btn"
                      onClick={() => context.unregisterForm("test-id")}>
                        Unregister
                    </button>

                    <span data-testid="has-form">
                        {context.getForm("test-id") ? "yes" : "no"}
                    </span>
                </div>
            );
        };

        render(
            <FormProvider>
                <TestComponent />
            </FormProvider>
        );

        // Initial state
        expect(screen.getByTestId("registry-size")).toHaveTextContent("0");
        expect(screen.getByTestId("has-form")).toHaveTextContent("no");

        await act(async () => {
            fireEvent.click(screen.getByTestId("register-btn"));
        });

        expect(screen.getByTestId("registry-size")).toHaveTextContent("1");
        expect(screen.getByTestId("has-form")).toHaveTextContent("yes");

        await act(async () => {
            fireEvent.click(screen.getByTestId("unregister-btn"));
        });

        expect(screen.getByTestId("registry-size")).toHaveTextContent("0");
        expect(screen.getByTestId("has-form")).toHaveTextContent("no");
    });

    it("maintains separate form instances in registry", () => {
        const TestComponent = () => {
            const context = useFormContext();

            useEffect(() => {
                context.registerForm("form-1", {name: "Form 1"} as unknown as UseFormReturn);
                context.registerForm("form-2", {name: "Form 2"} as unknown as UseFormReturn);
            }, []);

            const form1 = context.getForm("form-1");
            const form2 = context.getForm("form-2");

            return (
                <div>
                    <span data-testid="form1-name">{(form1 as any)?.name}</span>
                    <span data-testid="form2-name">{(form2 as any)?.name}</span>
                    <span data-testid="registry-count">{context.registry.size}</span>
                </div>
            );
        };

        render(
            <FormProvider>
                <TestComponent />
            </FormProvider>
        );

        expect(screen.getByTestId("registry-count")).toHaveTextContent("2");
        expect(screen.getByTestId("form1-name")).toHaveTextContent("Form 1");
        expect(screen.getByTestId("form2-name")).toHaveTextContent("Form 2");
    });
});
