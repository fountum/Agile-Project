import React, { useEffect, useState } from 'react';
import "@blocknote/core/fonts/inter.css";
import axios from 'axios';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState(null);  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId')
    const noteId = urlParams.get('noteId')

    setUserId(userId);
  
    fetch(`http://localhost:5173/?userId=${userId}$noteId=${noteId}`)
      .then(response => response.json())
      .then(data => setNotes(data));
  }, []);

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Untitled Page",
      },
      ...notes.map(note => ({ type: 'paragraph', content: note.content })),
    ],
  });

  useEffect(() => {
    const saveData = async () => {
      console.log('After editor.getContent');
      console.log(editor)
      const content = editor.value();
      try {
        await axios.post('http://localhost:3080/save', { content, userId });
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    };

    if (userId && notes.length > 0) {
      saveData();
    }
  }, [editor, userId, notes]); // This will run the effect whenever `editor`, `userId`, or `notes` changes

  const goBack = () => {
    window.location.href = 'http://localhost:3080/notes';
  };

  return (
    <div>
      <BlockNoteView editor={editor} theme="light" />
      <button onClick={goBack}>Back</button>
    </div>
  );
}