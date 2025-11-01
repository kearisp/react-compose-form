import React from "react";
import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Form, FormControl, FormGroup, FormFieldProps, useFormControl} from "../index";


describe("FormControl", () => {
    it("renders as default input and binds to form value", async () => {
        const user = userEvent.setup();

        render(
            <Form defaultValues={{first: "Bob"}}>
                <FormControl name="first" />
            </Form>
        );

        const input = screen.getByRole("textbox") as HTMLInputElement;

        expect(input.value).toBe("Bob");

        await user.clear(input);
        await user.type(input, "Alice");

        expect(input.value).toBe("Alice");
    });

    it("supports custom component via 'as' and passes field props", async () => {
        const user = userEvent.setup();

        const CustomInput: React.FC<FormFieldProps<{label?: string}>> = (props) => {
            const {
                label,
                ...rest
            } = props;

            return (
                <label>
                    {label}
                    <input aria-label="custom" {...rest} />
                </label>
            );
        };

        render(
            <Form defaultValues={{first: ""}}>
                <FormControl
                  as={CustomInput}
                  name="first"
                  label="First" />
            </Form>
        );

        const input = screen.getByLabelText("First") as HTMLInputElement;

        expect(input.getAttribute("name")).toBe("first");

        await user.type(input, "Value");

        expect(input.value).toBe("Value");
    });

    it("respects disabled prop", async () => {
        render(
            <Form>
                <FormControl
                  disabled
                  name="first" />
            </Form>
        );

        const input = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    it("applies required validation and exposes invalid via FormControlContext", async () => {
        const user = userEvent.setup();

        const InspectInput: React.FC<FormFieldProps> = (props) => {
            const state = useFormControl();

            return (
                <input
                  {...props}
                  aria-label="inspect"
                  data-invalid={state.invalid ? "yes" : "no"} />
            );
        };

        render(
            <Form defaultValues={{first: ""}}>
                <FormControl
                  as={InspectInput}
                  required="Required"
                  name="first" />

                <button type="submit">Send</button>
            </Form>
        );

        const input = screen.getByLabelText("inspect") as HTMLInputElement;
        const submit = screen.getByRole("button", {name: /send/i});

        // initially not invalid
        expect(input.getAttribute("data-invalid")).toBe("no");

        await user.click(submit);

        // after submit with empty value -> invalid
        expect(input.getAttribute("data-invalid")).toBe("yes");
    });

    it("resolves full field name via FormGroup context", async () => {
        render(
            <Form
              defaultValues={{
                user: {
                    first: ""
                }
              }}>
                <FormGroup name="user">
                    <FormControl name="first" />
                </FormGroup>
            </Form>
        );

        const input = screen.getByRole("textbox") as HTMLInputElement;

        expect(input.getAttribute("name")).toBe("user.first");
    });
});
