import { BaseSyntheticEvent, useState, useEffect, FC, ReactNode } from "react";

export const LongTextInput: FC<{
  placeholder?: string;
  rows?: number;
  value: string;
  className?: string;
  onChange?: Function;
  copyComponent?: ReactNode;
  validComponent?: ReactNode;
}> = ({
  placeholder,
  rows = 8,
  value = "",
  className = "",
  onChange,
  copyComponent,
  validComponent,
}) => {
  const [internalValue, setValue] = useState(value);
  useEffect(() => {
    if (internalValue !== value) {
      setValue(value);
    }
  }, [value]);
  function handleChange(event: BaseSyntheticEvent) {
    setValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-3 border border-gray-300 rounded-lg resize-y text-base font-sans focus:outline-none focus:ring-2 focus:ring-blue-500  dark:bg-gray-800">
      <textarea
        value={internalValue}
        style={{ resize: "none" }}
        onChange={handleChange}
        placeholder={placeholder || "Type your text here..."}
        rows={rows}
        className={
          className
            ? className
            : "w-full h-full  dark:bg-gray-800 dark:text-white focus:outline-none"
        }
      />
      <div className="flex flex-grow justify-end">{copyComponent}</div>
      {validComponent}
    </div>
  );
};
