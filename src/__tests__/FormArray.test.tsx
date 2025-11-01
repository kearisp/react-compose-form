import React from "react";
import {describe, it, expect} from "vitest";
import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    Form,
    FormArray,
    FormGroup,
    FormControl,
    useFormArray,
    useFormArrayItemContext,
    FormFieldProps
} from "../index";
import {useFieldArray} from "react-hook-form";


describe("FormArray", () => {
    const Row: React.FC<FormFieldProps<{ label?: string }>> = ({label}) => {
        const {index, remove, moveUp, moveDown} = useFormArrayItemContext();

        return (
            <div aria-label={`row-${index}`} data-index={index}>
                {label ? <span>{label}</span> : null}
                <FormControl name="name" aria-label={`name-${index}`} />
                <button type="button" onClick={remove}>remove</button>
                <button type="button" onClick={moveUp}>up</button>
                <button type="button" onClick={moveDown}>down</button>
            </div>
        );
    };

    const Toolbar: React.FC = () => {
        const {append} = useFormArray();
        return (
            <div>
                <button
                  type="button"
                  onClick={() => append({name: ""})}>
                    append
                </button>
            </div>
        );
    };

    it("renders rows for defaultValues and resolves nested names", async () => {
        render(
            <Form
              defaultValues={{
                  users: [
                      {name: "Alice"},
                      {name: "Bob"}
                  ]
              }}>
                <FormArray name="users">
                    <Row />
                </FormArray>
            </Form>
        );

        const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
        expect(inputs.length).toBe(2);

        // names are resolved through FormGroup layers: users.0.name, users.1.name
        expect(inputs[0].getAttribute("name")).toBe("users.0.name");
        expect(inputs[1].getAttribute("name")).toBe("users.1.name");

        expect(inputs[0].value).toBe("Alice");
        expect(inputs[1].value).toBe("Bob");

        // row containers expose current index via FormArrayItemContext
        const row0 = screen.getByLabelText("row-0");
        const row1 = screen.getByLabelText("row-1");
        expect(row0).toBeInTheDocument();
        expect(row1).toBeInTheDocument();
        expect(row0.getAttribute("data-index")).toBe("0");
        expect(row1.getAttribute("data-index")).toBe("1");
    });

    it("appends new item via FormArrayContext", async () => {
        const user = userEvent.setup();

        const Wrapper: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
            const {append} = useFormArray();
            return (
                <div>
                    <button type="button" onClick={() => append({name: ""})}>append</button>
                    {children}
                </div>
            );
        };

        render(
            <Form defaultValues={{users: []}}>
                <FormArray as={Wrapper} name="users">
                    <Row />
                </FormArray>
            </Form>
        );

        expect(screen.queryAllByRole("textbox").length).toBe(0);

        await user.click(screen.getByRole("button", {name: /append/i}));

        const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
        expect(inputs.length).toBe(1);

        await user.type(inputs[0], "Charlie");
        expect(inputs[0].value).toBe("Charlie");
        expect(inputs[0].getAttribute("name")).toBe("users.0.name");
    });

    it("removes item and reindexes remaining rows", async () => {
        const user = userEvent.setup();

        render(
            <Form defaultValues={{users: [{name: "A"}, {name: "B"}, {name: "C"}]}}>
                <FormArray name="users">
                    <Row />
                </FormArray>
            </Form>
        );

        const rowsBefore = screen.getAllByLabelText(/row-\d+/);
        expect(rowsBefore.length).toBe(3);

        // remove middle (index 1)
        const middleRow = screen.getByLabelText("row-1");
        const removeBtn = within(middleRow).getByRole("button", {name: /remove/i});
        await user.click(removeBtn);

        const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
        expect(inputs.length).toBe(2);
        // After removing B, remaining values should be A and C, reindexed 0 and 1
        expect(inputs[0].value).toBe("A");
        expect(inputs[0].getAttribute("name")).toBe("users.0.name");
        expect(inputs[1].value).toBe("C");
        expect(inputs[1].getAttribute("name")).toBe("users.1.name");
    });

    it("moves items up and down via FormArrayItemContext actions", async () => {
        const user = userEvent.setup();

        render(
            <Form defaultValues={{users: [{name: "A"}, {name: "B"}, {name: "C"}]}}>
                <FormArray name="users">
                    <Row />
                </FormArray>
            </Form>
        );

        const getValues = () => (screen.getAllByRole("textbox") as HTMLInputElement[]).map(i => i.value);

        // initial order
        expect(getValues()).toEqual(["A", "B", "C"]);

        // moveDown on first row (A) -> A swaps with B => [B, A, C]
        const firstRow = screen.getByLabelText("row-0");
        const downBtn = within(firstRow).getByRole("button", {name: /down/i});
        await user.click(downBtn);
        expect(getValues()).toEqual(["B", "A", "C"]);

        // moveUp on last row (C) -> C swaps with A => [B, C, A]
        const lastRow = screen.getByLabelText("row-2");
        const upBtn = within(lastRow).getByRole("button", {name: /up/i});
        await user.click(upBtn);
        expect(getValues()).toEqual(["B", "C", "A"]);
    });

    it("ignores boundary moves (first up, last down)", async () => {
        const user = userEvent.setup();

        render(
            <Form defaultValues={{users: [{name: "X"}, {name: "Y"}]}}>
                <FormArray name="users">
                    <Row />
                </FormArray>
            </Form>
        );

        const getValues = () => (screen.getAllByRole("textbox") as HTMLInputElement[]).map(i => i.value);
        expect(getValues()).toEqual(["X", "Y"]);

        // first up -> no change
        const row0 = screen.getByLabelText("row-0");
        await user.click(within(row0).getByRole("button", {name: /up/i}));
        expect(getValues()).toEqual(["X", "Y"]);

        // last down -> no change
        const row1 = screen.getByLabelText("row-1");
        await user.click(within(row1).getByRole("button", {name: /down/i}));
        expect(getValues()).toEqual(["X", "Y"]);
    });

    it("supports custom wrapper via 'as' prop", async () => {
        const Wrapper: React.FC<React.PropsWithChildren<{testid?: string}>> = ({children, testid}) => {
            return <section data-testid={testid}>{children}</section>;
        };

        render(
            <Form defaultValues={{users: [{name: "One"}]}}>
                <FormArray as={(p) => <Wrapper {...p} testid="array-wrapper" />} name="users">
                    <Row />
                </FormArray>
            </Form>
        );

        expect(screen.getByTestId("array-wrapper")).toBeInTheDocument();
        const input = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.value).toBe("One");
    });
});
