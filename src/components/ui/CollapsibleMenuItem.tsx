import { useState, FC } from "react";
import { RouteObject, useNavigate } from "react-router-dom";

export const CollapsibleMenuItem: FC<{ RouteItem: RouteObject }> = ({
  RouteItem,
}) => {
  const navigate = useNavigate();
  const [expandMe, setExpandMe] = useState(false);
  const basepath = RouteItem.path;
  const getName = (path: string, removeFirst?: boolean) => {
    let str = path.split("-");
    if (removeFirst) {
      str.shift();
    }
    str = str.map((item) => {
      return item.charAt(0).toUpperCase() + item.slice(1);
    });
    return str.join(" ");
  };

  return (
    <>
      <div
        className="text-sm font-roboto text-orange-active hover:text-orange-hover"
        onClick={() => setExpandMe((prev) => !prev)}
      >
        {getName(RouteItem.path!, true)}
      </div>
      {expandMe ? (
        <div className="flex flex-col border-s-1 border-orange-active ms-2">
          {RouteItem?.children?.map((route) => {
            return (
              <span
                className="text-xs text-orange-active hover:text-orange-hover ms-5"
                onClick={() => {
                  navigate(`${basepath}/${route.path}`);
                }}
                key={route.path}
              >
                {getName(route.path!)}
              </span>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
