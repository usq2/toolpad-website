import { BaseSyntheticEvent } from "react";

export const Button = ({
  title = "Click",
  onClick,
  className = " bg-red-300 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded w-full my-3",
  ...otherProps
}) => {
  const handleClick = (event: BaseSyntheticEvent) => {
    if (onClick) {
      onClick(event.target.value);
    }
  };
  return (
    <button className={className} onClick={onClick} {...otherProps}>
      {title}
    </button>
  );
};
