import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownChevron } from "../../assets/down-chevron.tsx";
import { UpChevron } from "../../assets/up-chevron.tsx";
import { routes } from "../../../router/index.ts";
import { CollapsibleMenuItem } from "./CollapsibleMenuItem.tsx";
import DotCircle from "/dot-circle.svg";
import { useLocation } from "react-router-dom";
export const BreadCrumbs = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const getMainName = (path: string, removeFirst?: boolean) => {
    let str = path.split("-");
    if (removeFirst) {
      str.shift();
    }
    str = str.map((item) => {
      return item.charAt(0).toUpperCase() + item.slice(1);
    });
    return str.join(" ").split("/")[0];
  };
  const getCurrPath = (path: string, removeFirst?: boolean) => {
    let str = path.split("/");
    if (str.length > 2) {
      str.shift();
      str.shift();
      let currPath = str[0].split("-");
      currPath = currPath.map((item) => {
        return item.charAt(0).toUpperCase() + item.slice(1);
      });
      return currPath.join(" ");
    }
    return null;
  };
  return (
    <div
      className="relative inline-flex flex-col max-h-12 max-w-fit mb-4"
      ref={dropdownRef}
    >
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-8 text-lg
                   text-black dark:text-white"
      >
        <span className="text-xl text-black dark:text-orange font-bold tracking-wide">
          {getMainName(location.pathname, true)}
        </span>
        <img src={DotCircle} height={12} width={12} />
        <span className="text-lg text-gray-500 dark:text-white font-light">
          {getCurrPath(location.pathname, true)}
        </span>
        <span className="text-xs">
          {isOpen ? (
            <UpChevron height={"15"} width={"15"} />
          ) : (
            <DownChevron height={"15"} width={"15"} />
          )}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-60 rounded-2xl
                       bg-white dark:bg-gray-900
                       shadow-xl ring-1 ring-black/5
                       z-50"
          >
            <ul className="flex flex-col p-4 space-y-2 text-sm">
              {routes.map((route) => {
                if (route.path?.startsWith("/tool")) {
                  return (
                    <CollapsibleMenuItem key={route.path} RouteItem={route} />
                  );
                }
                return null;
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
