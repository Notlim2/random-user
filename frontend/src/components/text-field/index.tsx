import TextField from "@mui/material/TextField";
import { TextFieldProps } from "@mui/material/TextField";
import { useField } from "formik";

interface TextFieldWrapperProps
  extends Omit<TextFieldProps, "name" | "onChange" | "value"> {
  name: string;
  value: string;
  setValue?: (newValue: string) => void;
}

const TextFieldWrapper = ({
  name,
  setValue,
  ...otherProps
}: TextFieldWrapperProps) => {
  const [field, meta] = useField(name);

  const configTextField = {
    fullWidth: true,
    variant: "outlined",
    ...field,
    ...otherProps,
  };

  if (setValue) {
    configTextField.onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value);
  }

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  } else {
    configTextField.error = false;
    configTextField.helperText = "";
  }

  return <TextField {...(configTextField as TextFieldProps)} />;
};

export default TextFieldWrapper;
