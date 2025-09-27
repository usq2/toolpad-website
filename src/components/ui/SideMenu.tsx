import { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SideMenu: FC<{
  Links: Array<{ label: string; onClick: Function }>;
}> = ({ Links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile hamburger toggle */}
      <div className="md:hidden fixed top-0 p-4  bg-dark-surface text-white flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>
      </div>

      {/* Side menu */}
      <nav
        className={`fixed top-0 bottom-0 left-0 shadow-default w-64 dark:bg-dark-surface bg-primary dark:text-text-primary text-dark-text-secondary p-6 space-y-4 transform transition-transform duration-300 ease-in-out
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:w-56 md:p-4 md:space-y-6`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>
        <ul className="flex flex-col space-y-3">
          {Links.map((link) => (
            <li key={link.label}>
              <span
                onClick={() => {
                  if (link.onClick) link.onClick(navigate);
                }}
                className="block px-4 py-2 rounded hover:bg-background hover:text-primary dark:hover:bg-dark-background dark:hover:text-dark-surface transition-colors cursor-pointer"
              >
                {link.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
