// Note App - JavaScript functionality

// DOM Elements
const noteForm = document.getElementById('noteForm');
const imageInput = document.getElementById('imageInput');
const descriptionInput = document.getElementById('descriptionInput');
const notesContainer = document.getElementById('notesContainer');
const noNotesMessage = document.getElementById('noNotesMessage');

// Load notes from localStorage on page load
document.addEventListener('DOMContentLoaded', loadNotes);

// Handle form submission
noteForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const imageFile = imageInput.files[0];
    const description = descriptionInput.value.trim();
    
    if (!imageFile || !description) {
        alert('Please select an image and enter a description');
        return;
    }
    
    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onload = function(event) {
        const note = {
            id: Date.now(),
            image: event.target.result,
            description: description,
            date: new Date().toLocaleDateString()
        };
        
        saveNote(note);
        displayNote(note);
        resetForm();
    };
    
    reader.readAsDataURL(imageFile);
});

// Save note to localStorage
function saveNote(note) {
    let notes = getNotesFromStorage();
    notes.push(note);
    localStorage.setItem('imageNotes', JSON.stringify(notes));
}

// Get notes from localStorage
function getNotesFromStorage() {
    const notes = localStorage.getItem('imageNotes');
    return notes ? JSON.parse(notes) : [];
}

// Load all notes from storage
function loadNotes() {
    const notes = getNotesFromStorage();
    
    if (notes.length === 0) {
        noNotesMessage.classList.remove('hidden');
        return;
    }
    
    noNotesMessage.classList.add('hidden');
    
    // Display notes in reverse order (newest first)
    notes.reverse().forEach(note => displayNote(note));
}

// Display a single note card
function displayNote(note) {
    noNotesMessage.classList.add('hidden');
    
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.dataset.id = note.id;
    
    noteCard.innerHTML = `
        <img src="${note.image}" alt="Note Image" class="note-image">
        <div class="note-content">
            <p class="note-date">${note.date}</p>
            <p class="note-description">${escapeHtml(note.description)}</p>
            <button class="btn-delete" onclick="deleteNote(${note.id})">Delete Note</button>
        </div>
    `;
    
    notesContainer.appendChild(noteCard);
}

// Delete note
function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    let notes = getNotesFromStorage();
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('imageNotes', JSON.stringify(notes));
    
    // Remove the note card from display
    const noteCard = document.querySelector(`.note-card[data-id="${noteId}"]`);
    if (noteCard) {
        noteCard.remove();
    }
    
    // Show message if no notes left
    const remainingNotes = getNotesFromStorage();
    if (remainingNotes.length === 0) {
        noNotesMessage.classList.remove('hidden');
    }
}

// Reset the form
function resetForm() {
    noteForm.reset();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}