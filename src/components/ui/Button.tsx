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
  className = " hover:bg-background hover:text-primary font-semibold py-3 px-6 rounded w-full my-3 dark:bg-dark-surface bg-primary",
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
