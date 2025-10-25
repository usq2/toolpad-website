import { useRef } from "react";

export default function FileUpload({ onFileChange, onUrlChange }) {
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
        <span className="font-semibold text-lg">Upload File</span>
        <span className="text-sm mt-1">Choose your file to upload</span>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
      </label>

      {/* OR DIVIDER */}
      <div className="flex items-center my-4">
        <div className="border-t border-white flex-grow opacity-30"></div>
        <span className="mx-3 text-xs font-medium opacity-80">OR</span>
        <div className="border-t border-white flex-grow opacity-30"></div>
      </div>

      {/* URL INPUT */}
      <input
        type="url"
        placeholder="Enter file URL"
        className="w-full p-2 rounded dark:bg-gray-700 dark:placeholder-white/70 dark:text-white border dark:border-white/20 focus:outline-none dark:focus:border-white"
        onChange={onUrlChange}
      />
    </div>
  );
}
