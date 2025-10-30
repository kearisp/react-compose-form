# react-compose-form

[![npm version](https://img.shields.io/npm/v/react-compose-form.svg)](https://www.npmjs.com/package/react-compose-form)
[![Publish](https://github.com/kearisp/react-compose-form/actions/workflows/publish-latest.yml/badge.svg?event=release)](https://github.com/kearisp/react-compose-form/actions/workflows/publish-latest.yml)
[![License](https://img.shields.io/npm/l/react-compose-form)](https://github.com/kearisp/react-compose-form/blob/master/LICENSE)

[![npm total downloads](https://img.shields.io/npm/dt/react-compose-form.svg)](https://www.npmjs.com/package/react-compose-form)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-compose-form)](https://bundlephobia.com/package/react-compose-form)
![Coverage](https://gist.githubusercontent.com/kearisp/f17f46c6332ea3bb043f27b0bddefa9f/raw/coverage-react-compose-form-latest.svg)

```shell
npm i react-hook-form react-compose-form
```

## Usage

```tsx
import {Form, FormControl, FormFieldProps} from "react-compose-form";

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
import {Form, FormControl, FormArray, useFormArray} from "react-compose-form";


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
