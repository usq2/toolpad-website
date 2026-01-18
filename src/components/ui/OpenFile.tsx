import { BaseSyntheticEvent, FC, useRef } from "react";

export const OpenFile: FC<{
  onFileChange: (event: BaseSyntheticEvent) => void;
}> = ({ onFileChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto p-6 dark:bg-gray-700 dark:text-white shadow-lg h-full my-2 border border-gray-300 rounded-lg">
      <label
        htmlFor="fileInput"
        className="flex flex-col items-center p-4 rounded cursor-pointer hover:bg-grey-800 transition-colors duration-200"
        tabIndex={0}
      >
        <svg
          className="w-8 h-8 mb-3 dark:text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 16v-9M12 7l-4 4m4-4l4 4M16 16v5H8v-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-semibold text-lg">Open File</span>
        <span className="text-sm mt-1">Choose your docx file</span>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
      </label>
    </div>
  );
};
