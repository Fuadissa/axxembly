"use client";
import MonacoEditor from "@monaco-editor/react";
import React from "react";

export const CodeEditor = ({
  initialCode,
  selectedLanguage,
}: {
  initialCode: string;
  selectedLanguage: string;
}) => {
  if (!initialCode) {
    return null;
  }
  return (
    <>
      <MonacoEditor
        language={selectedLanguage}
        // Bound to form state
        // onChange={} // Updates form state
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
        }}
        className="h-[500px] rounded-md md:h-[500px] lg:h-[600px] w-full"
        // onMount={handleEditorDidMount} // Called when Monaco is mounted
        value={initialCode}
      />
    </>
  );
};
