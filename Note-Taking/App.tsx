import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get('noteId');
  const content = urlParams.get('noteContent');
  
  // console.log(noteId)
  // console.log(content)
// console.log(typeof(content))

// Remove the curly braces and split the string into an array of key-value pairs
const keyValuePairs = content.replace(/[{}]/g, '').split(', ');

// Initialize an empty object
let contents = {};

// Loop through the key-value pairs
for (const pair of keyValuePairs) {
  // Split the pair into a key and a value
  const [key, value] = pair.split(': ');

  // Check if value is defined
  if (value) {
    // Remove the double quotes from the value
    const cleanValue = value.replace(/"/g, '');

    // Add the key-value pair to the object
    contents[key.trim()] = cleanValue;
  }
}
console.log(contents)
axios.get(`http://localhost:5173/?noteId=${noteId}&noteContent=${content}`)
    .then(response => {
      console.log(response.data)
    })

// Creates a new editor instance.
const editor = useCreateBlockNote({
  initialContent: [contents]
});

const [currentContent, setCurrentContent] = useState(null);
useEffect(() => {
  if (editor) {
    const unsubscribe = editor.onChange(newContent => {
      setCurrentContent(newContent);
      console.log(newContent);
    });

    // Unsubscribe from the onChange event when the component unmounts
    return () => unsubscribe();
  }
}, [editor]);

// Renders the editor instance using a React component.
return( 
  <div>
    <BlockNoteView editor={editor} theme="light" />
  </div>
)
}





// import React, { useEffect, useState } from 'react';
// import "@blocknote/core/fonts/inter.css";
// import axios from 'axios';
// import { useCreateBlockNote } from "@blocknote/react";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";

// export default function App() {
//   const [notes, setNotes] = useState([]);
//   const [userId, setUserId] = useState(null);  
//   const [noteId, setNoteId] = useState(null);
//   const [editor, setEditor] = useState(null);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const userId = urlParams.get('userId');
//     const noteId = urlParams.get('noteId');

//     setUserId(userId);
//     setNoteId(noteId);
  
//     axios.get(`http://localhost:5173/?userId=${userId}&noteId=${noteId}`)
//       .then(response => {
//         const note = response.data;
//         setNotes(note);
//         const initialContent = [{ type: 'paragraph', content: note.content }];
//         const editor = useCreateBlockNote({ initialContent });
//         setEditor(editor);
//       });
//   }, []);

//   useEffect(() => {
//     const saveData = async () => {
//       if (editor) {
//         const content = editor.value();
//         try {
//           await axios.post(`http://localhost:5173/?userId=${userId}&noteId=${noteId}`, { content });
//         } catch (error) {
//           console.error("Error saving data: ", error);
//         }
//       }
//     };

//     if (userId && notes.length > 0) {
//       saveData();
//     }
//   }, [editor, userId, notes]);

//   const goBack = () => {
//     window.location.href = 'http://localhost:3080/notes';
//   };

//   return (
//     <div>
//       {editor && <BlockNoteView editor={editor} theme="light" />}
//       <button onClick={goBack}>Back</button>
//     </div>
//   );
// }
