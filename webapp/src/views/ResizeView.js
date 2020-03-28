import React, { useRef, useCallback, useState } from "react";

export default function ResizeView(props) {
  let [size, setSize] = useState({});

  let resizeObserver = useRef();
  let refHolder = useCallback(ref => {
    if (ref) {
      resizeObserver.current = new ResizeObserver(entries => {
        let { width, height } = entries[0].contentRect;
        // console.log(entries[0]);
        setSize({ width, height });
      });
      resizeObserver.current.observe(ref);
    } else {
      resizeObserver.current.disconnect();
    }
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      ref={refHolder}
    >
      <div style={{ position: "absolute", width: "100%", height: "100%" }}>
        {React.cloneElement(React.Children.only(props.children), size)}
      </div>
    </div>
  );
}
