import { useRef, useState } from "react";

import React from "react";

export default function Accordion(props) {
  const { className, children, openAction, offsetArrow } = props;

  const [open, setOpen] = useState(false);
  const detailRef = useRef(null);

  const [summary, ...details] = children;

  let toggleHandler = () => {
    setOpen(!open);
    if (openAction) openAction();
  };

  return (
    <div className={className}>
      <div
        className="relative flex hover:text-sky-400 cursor-pointer"
        onClick={toggleHandler}
      >
        <div className="w-full">{summary}</div>
        <div className="place-self-center h-min my-auto">
          <p
            className="text-2xl transition-[transform] ease-out duration-200 delay-[0ms] select-none"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ❯
          </p>
        </div>
      </div>

      <div
        className="flex overflow-hidden transition-[max-height] ease-out duration-200 delay-[0ms]"
        style={{
          maxHeight: open ? detailRef.current.scrollHeight + "px" : "0px",
        }}
        ref={detailRef}
      >
        {details}
        {offsetArrow && <p className="text-2xl invisible">❯</p>}
      </div>
    </div>
  );
}
