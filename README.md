# kp-admin

```shell
npm i react-hook-form react-compose-form
```

## Usage

```tsx
import {Form, FormControl, FormFieldProps} from "@kearisp/react-admin";

type InputProps = {
    label: string;
};

const InputField = ({label, ...props}: FormFieldProps<InputProps>) => {
    return (
        <div>
            <label>{label}</label>
            <input {...props} />
        </div>
    );
};

<Form>
    <FormControl
      as={InputField}
      label="First name"
      name="first_name" />
</Form>
```

```tsx
import {Form, FormControl, FormArray, useFormArray} from "@kearisp/react-admin";


const ExampleArray = ({ children }: PropsWithChildren) => {
    const {
        append
    } = useFormArray();

    return (
        <div className="array-container">
            {children}

            <button type="button" onClick={() => append({first_name: "", last_name: ""})}>
                Add Item
            </button>
        </div>
    );
};

<Form>
    <FormArray as={ExampleArray} name="users">
        <div className="row">
            <FormControl name="first_name" />
            <FormControl name="last_name" />
        </div>
    </FormArray>
</Form>
```
