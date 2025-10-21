import { useState } from "react";
import { motion } from "framer-motion";
import { LeftChevron } from "../../assets/left-chevron.tsx";
import { RightChevron } from "../../assets/right-chevron.tsx";
import { routes } from "../../../router/index.ts";
import { CollapsibleMenuItem } from "./CollapsibleMenuItem.tsx";

export const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(true); // Start open
  return (
    <motion.nav
      initial={false}
      animate={{
        width: isOpen ? "240px" : "40px", // open width vs collapsed width
        x: 0, // no horizontal slide, just width change
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="flex flex-col text-xs relative top-0 bottom-0 left-0 dark:text-white text-black p-6 space-y-4 overflow-hidden max-h-lvh"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none w-6 h-6 self-end cursor-pointer ps-4"
        aria-label="Toggle menu"
      >
        {isOpen ? <LeftChevron /> : <RightChevron />}
      </button>

      <ul className="flex flex-col space-y-3 ms-1">
        {isOpen && (
          <>
            <span className="text-orange-active text-lg">Quick Links</span>
            {routes.map((route) => {
              if (route.path?.startsWith("/tool")) {
                return <CollapsibleMenuItem RouteItem={route} />;
              }
            })}
          </>
        )}
      </ul>
    </motion.nav>
  );
};
