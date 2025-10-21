import {
  BaseSyntheticEvent,
  ButtonHTMLAttributes,
  FC,
  HTMLAttributes,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}
export const Button: FC<ButtonProps> = ({
  title = "Click",
  onClick,
  className = " hover:bg-orange-100 hover:text-primary text-white font-semibold py-3 px-6 rounded w-1/2 my-3 bg-orange",
  ...otherProps
}) => {
  const handleClick = (event: BaseSyntheticEvent) => {
    if (onClick) {
      onClick(event.target.value);
    }
  };
  return (
    <button
      className={className}
      onClick={(e: BaseSyntheticEvent) => handleClick(e)}
      {...otherProps}
    >
      {title}
    </button>
  );
};
