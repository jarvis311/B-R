import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CommEditor = ({ description, setDescription }) => {
  const onEditorStateChange = (editorValue) => {
    const editorStateInHtml = draftToHtml(
      convertToRaw(editorValue.getCurrentContent())
    );
    setDescription({
      htmlValue: editorStateInHtml,
      editorState: editorValue,
    });
  };

  return (
    <>
      <Editor
        toolbarHidden={false}
        editorClassName="common-editor"
        editorState={description.editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder="Type..."
      />
    </>
  );
};

export default CommEditor;
