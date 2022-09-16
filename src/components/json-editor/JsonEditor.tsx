import { JSONEditor } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import "./JsonEditor.css";

export default function JsonEditor(props: any) {
  const refContainer = useRef(null);
  const refEditor = useRef(null);

  useEffect(() => {
    // create editor
    console.log("create editor", refContainer.current);
    (refEditor as any).current = new JSONEditor({
      target: refContainer.current,
      props: {}
    } as any);

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log("destroy editor");
        (refEditor.current as any).destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      console.log("update props", props);
      (refEditor.current as any).updateProps(props);
    }
  }, [props]);

  return <div className="svelte-jsoneditor-react" ref={refContainer}></div>;
}
