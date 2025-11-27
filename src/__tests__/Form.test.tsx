import React from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi} from "vitest";
import {Form, FormControl, FormComponentProps} from "../index";


describe("Form", (): void => {
    it("renders children and applies className", async () => {
        render(
            <Form className="my-form" role="form">
                <div data-testid="child" />
            </Form>
        );

        const formEl = screen.getByRole("form", {
            hidden: true
        }) as HTMLFormElement | null;

        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(formEl).not.toBeNull();
        expect(formEl!.className).toContain("my-form");
    });

    it("calls onSubmit with form values", async () => {
        const user = userEvent.setup();
        const handleSubmit = vi.fn();

        render(
            <Form defaultValues={{first: ""}} onSubmit={handleSubmit}> <FormControl name="first"/>
                <button type="submit">Submit</button>
            </Form>
        );

        const input = screen.getByRole("textbox");
        await user.clear(input);
        await user.type(input, "Alice");

        await user.click(screen.getByRole("button", {name: /submit/i}));

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenLastCalledWith(
            {first: "Alice"},
            expect.anything()
        );
    });

    it("calls onInvalid when validation fails (required)", async () => {
        const user = userEvent.setup();
        const handleInvalid = vi.fn();

        render(
            <Form onInvalid={handleInvalid} defaultValues={{first: ""}}>
                <FormControl name="first" required="Required" />
                <button type="submit">Submit</button>
            </Form>
        );

        await user.click(screen.getByRole("button", {name: /submit/i}));

        expect(handleInvalid).toHaveBeenCalledTimes(1);
        const args = handleInvalid.mock.calls[0];
        // args[0] is FieldErrors
        expect(args[0]).toHaveProperty("first");
    });

    it("uses defaultValues to prefill inputs", async () => {
        render(
            <Form defaultValues={{first: "Bob"}}>
                <FormControl
                  name="first" />
            </Form>
        );

        const input = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.value).toBe("Bob");
    });

    it("should use custom form", async () => {
        const CustomForm: React.FC<FormComponentProps> = (props) => {
            return (
                <form role="custom-form" {...props} />
            );
        };

        render(
            <Form as={CustomForm} />
        );

        const form = screen.getByRole("custom-form") as HTMLFormElement | null;

        expect(form).not.toBeNull();
    });
});
