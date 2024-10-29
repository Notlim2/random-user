import React from "react";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

interface DatePickerProps {
  label: string;
  value: Dayjs | null;
  setValue: (value: Dayjs | null) => void;
}

// const defaultFormat = "YYYY-MM-DD";
const brFormat = "DD/MM/YYYY";

const DatePicker: React.FC<DatePickerProps> = ({ label, value, setValue }) => {
  return (
    <MUIDatePicker
      label={label}
      format={brFormat}
      value={value}
      onChange={setValue}
    />
  );
};

export default DatePicker;
