const editor = new EditorJS({
  /**
   * Id of Element that should contain Editor instance
   */
  holder: 'editorjs',

  // Allows you to add text and a header to the note     
  tools: {
    header: {
      class: Header,
      // Can choose to bold or underline header 
      inlineToolbar: ['bold', 'underline']
    }
  },
  // Start with an empty editor
  data: {}
});


// Reset the editor when the create note button is clicked
document.getElementById('createNoteBtn').addEventListener('click', function() {
  editor.save().then((outputData) => {
      // outputData contains the data from the Editor.js instance
      // You can send this data to your server here
      console.log(outputData);
      // Clear the editor for the next note
      editor.clear();
  }).catch((error) => {
      console.log('Saving failed: ', error);
  });
});


// Load the note when an existing note is clicked
function loadNote(noteId) {
  // Replace '/notes/' + noteId with the URL server's endpoint
  fetch('/notes/' + noteId)
    .then(response => response.json())
    .then(note => {

      editor.clear();

      // Load the note's contents into the editor
      editor.render(note.content);
    });
}