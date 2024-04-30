import { useEffect, useRef, useState } from "react";

import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

type Props = {
  content: string;
  onChange: (content: string) => void;
};
export const RTEditor = (props: Readonly<Props>) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { content } = props;
  const [dirty, setDirty] = useState(false);
  useEffect(() => setDirty(false), [content]);

  const save = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setDirty(false);
      editorRef.current.setDirty(false);
      // an application would save the editor content to the server here
      console.log(content);
    }
  };

  return (
    <>
      <Editor
        apiKey="gh5u9hd8ro85zd2wvl0qa558jg4dfwo3mnqx5hk05kyf5onv"
        onInit={(evt, editor) => (editorRef.current = editor)}
        onDirty={() => setDirty(true)}
        init={{
          plugins: "save",
          toolbar: "save",
          save_onsavecallback: save,
        }}
        initialValue={content}
      />
      {dirty && <p>You have unsaved content!</p>}
    </>
  );
};
