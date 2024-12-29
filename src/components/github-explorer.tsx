"use client";

import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { AiFillFile } from "react-icons/ai";
import { FaChevronDown, FaChevronRight, FaFolder } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

type FileNode = {
  name: string;
  type: "file" | "dir";
  path: string;
  download_url?: string;
  url: string;
};

const fileExtensionToLanguage: { [key: string]: string } = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  json: "json",
  py: "python",
  java: "java",
  go: "go",
  // Add more extensions and their corresponding languages as needed
};

export default function GitHubFileExplorer({
  githubUrl,
}: {
  githubUrl: string;
}) {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [folderContents, setFolderContents] = useState<
    Record<string, FileNode[]>
  >({});
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false); // Track if the editor is visible
  const [imageUrlContent, setimageUrlContent] = useState<string>("");

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];

  // Fetch initial repository tree
  const fetchRepoTree = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/github-code?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      setTree(data.tree || []);
    } catch (error) {
      console.error("Error fetching repo tree:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch folder content and update state
  const fetchFolderContent = async (url: string): Promise<FileNode[]> => {
    try {
      const response = await fetch(
        `/api/github-folder?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching folder content:", error);
      return [];
    }
  };

  // Toggle folder open/close and dynamically load folder contents
  const toggleFolder = async (folder: FileNode) => {
    const newOpenFolders = new Set(openFolders);

    if (newOpenFolders.has(folder.path)) {
      newOpenFolders.delete(folder.path); // Close folder
    } else {
      newOpenFolders.add(folder.path); // Open folder

      // Fetch folder content if not already loaded
      if (!folderContents[folder.path]) {
        const children = await fetchFolderContent(folder.url);
        setFolderContents((prev) => ({ ...prev, [folder.path]: children }));
      }
    }

    setActivePath(folder.path); // Highlight the active folder
    setOpenFolders(newOpenFolders);
  };

  // Fetch file content and display in editor
  const fetchFileContent = async (file: FileNode) => {
    setActivePath(file.path); // Highlight the active file
    setIsEditorVisible(true); // Show the editor when a file is opened

    if (
      imageExtensions.includes(file.name.split(".").pop()?.toLowerCase() || "")
    ) {
      setimageUrlContent(file.download_url || "");
    } else {
      setimageUrlContent("");
    }

    try {
      const response = await fetch(file.download_url || "");
      const content = await response.text();
      setFileContent(content);
      setSelectedFile(file.name);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  // Go back to file explorer view
  const goBackToExplorer = () => {
    setIsEditorVisible(false); // Hide the editor and go back to explorer
  };

  // Function to get language based on file extension
  const getLanguageForFile = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension
      ? fileExtensionToLanguage[extension] || "plaintext"
      : "plaintext";
  };

  // Render the tree structure
  const renderTree = (nodes: FileNode[], parentPath = "") => {
    if (!Array.isArray(nodes)) return null;

    return nodes.map((node) => {
      const nodePath = `${parentPath}/${node.name}`;
      const isActive = activePath === node.path;

      if (node.type === "dir") {
        const isOpen = openFolders.has(node.path);

        return (
          <div key={node.path} className="pl-2">
            <div
              className={`cursor-pointer flex items-center gap-2 rounded-md ${
                isActive ? "bg-white text-black" : "bg-transparent"
              }`}
              onClick={() => toggleFolder(node)}
            >
              <div>{isOpen ? <FaChevronDown /> : <FaChevronRight />}</div>
              <FaFolder />
              <span>{node.name}</span>
            </div>
            {isOpen && folderContents[node.path] && (
              <div className="pl-2">
                {renderTree(folderContents[node.path], nodePath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          className={`cursor-pointer flex items-center gap-2 pl-4 rounded-md ${
            isActive ? "bg-white text-black" : "bg-transparent"
          }`}
          onClick={() => fetchFileContent(node)}
        >
          <AiFillFile />
          <span>{node.name}</span>
        </div>
      );
    });
  };

  useEffect(() => {
    fetchRepoTree(githubUrl);
  }, [githubUrl]);

  return (
    <div className=" h-[560px] md:h-[600px] flex gap-2">
      {/* File Explorer */}

      <ScrollArea
        className={`border overflow-y-auto p-2 rounded-md border-black dark:border-white min-w-[200px] m-4 md:m-0 ${
          isEditorVisible ? "hidden lg:inline-block" : "w-[100%] lg:w-[200px]"
        }`}
      >
        <h3>File Explorer</h3>
        {loading ? <div>Loading...</div> : renderTree(tree)}
      </ScrollArea>

      {/* Monaco Editor */}
      <div
        className={`flex-1 md:px-4 ${
          isEditorVisible ? "w-[100%]" : "hidden lg:inline-block"
        }`}
      >
        {/* Back Button for mobile and tablet views */}
        <div className="flex items-center mb-4 justify-start">
          <button
            className="lg:hidden p-2 text-white bg-blue-500 rounded"
            onClick={goBackToExplorer}
          >
            Back
          </button>
          <h3 className="ml-4">{selectedFile || "Select a file to view"}</h3>
        </div>
        {selectedFile &&
        imageExtensions.includes(
          selectedFile.split(".").pop()?.toLowerCase() || ""
        ) ? (
          <div className="relative w-full h-[400px] md:h-[562px] rounded-lg overflow-hidden p-4 border border-black dark:border-white/50">
            <div className="w-full h-full rounded-md relative ">
              <Image
                src={activePath ? imageUrlContent : ""}
                alt="Selected File"
                className="object-cover w-full h-full rounded-md"
                width={800}
                height={600}
              />
            </div>
          </div>
        ) : (
          <MonacoEditor
            language={getLanguageForFile(selectedFile || "")}
            value={fileContent}
            theme="vs-dark"
            options={{ readOnly: true }}
            className="w-[100%] lg:w-[700px] h-[500px] md:h-[562px] "
          />
        )}
      </div>
    </div>
  );
}
