import React from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";

const CommTextArea = ({
  value,
  setValue,
  placeHolder,
  errorClass,
  helperText,
  name,
  minRows,
  multiline,
  inputProps,
}) => {
  return (
    <div>
      <TextareaAutosize
        // placeholder="Empty"
        aria-label="empty textarea"
        minRows={minRows}
        onChange={setValue}
        value={value}
        placeholder={placeHolder}
        helperText={helperText}
        error={errorClass}
        id={name}
        multiline={multiline}
        inputProps={inputProps}
        style={{ width: "100%" , borderRadius:"0.5rem"}}
      />
    </div>
  );
};

export default CommTextArea;
