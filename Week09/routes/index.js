const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const notesFilePath = path.join(__dirname, '../data/notes.json');

function readNotes() {
  if (!fs.existsSync(notesFilePath)) {
    fs.writeFileSync(notesFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(notesFilePath, 'utf8');
  return JSON.parse(data);
}

function writeNotes(notes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
}

router.post('/notes', function (req, res, next) {
  const { title, body, color, starred } = req.body;
  const notes = readNotes();
  const newNote = {
      id: Date.now(),
      title,
      body,
      color: color || '#ffffff', 
      starred: !!starred, // Ensure starred is a boolean
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  writeNotes(notes);
  res.redirect('/');
});

router.get('/notes/:id/edit', function (req, res, next) {
  const notes = readNotes();
  const note = notes.find((n) => n.id === parseInt(req.params.id));

  if (!note) {
      return res.status(404).send('Note not found');
  }

  res.render('edit', { note });
});

router.get('/notes/all', function (req, res, next) {
  const notes = readNotes();
  res.render('view', { notes });
});

router.post('/notes/:id', function (req, res, next) {
  const { title, body, color, starred } = req.body;
  const notes = readNotes();
  const note = notes.find((n) => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).send('Note not found');
  note.title = title;
  note.body = body;
  note.color = color || 'white';
  note.starred = !!starred; // Ensure starred is a boolean
  note.updatedAt = new Date().toISOString();
  writeNotes(notes);
  res.redirect('/');
});

router.delete('/notes/:id', function (req, res, next) {
  let notes = readNotes();
  notes = notes.filter((n) => n.id !== parseInt(req.params.id));
  writeNotes(notes);
  res.redirect('/');
});

router.get('/notes/:id', function (req, res, next) {
  let notes = readNotes();
  notes = notes.filter((n) => n.id !== parseInt(req.params.id));
  writeNotes(notes);
  res.redirect('/');
});

router.post('/notes/delete/:id', function (req, res, next) {
  let notes = readNotes();
  notes = notes.filter((n) => n.id !== parseInt(req.params.id));
  writeNotes(notes);
  res.redirect('/');
});

router.get('/', function (req, res, next) {
  const notes = readNotes();
  const error = req.query.error;
  res.render('index', { notes, error, searchError: null }); // Add searchError with a default value
});

router.get('/search', (req, res) => {
  const notes = readNotes();
  const query = req.query.query ? req.query.query.toLowerCase() : '';

  const foundNote = notes.find(note =>
    note.title.toLowerCase().includes(query) ||
    note.body.toLowerCase().includes(query)
  );

  if (foundNote) {
    res.redirect(`/notes/${foundNote.id}/edit`);
  } else {
    res.render('index', { notes, searchError: 'No matching notes found.' });
  }
});

module.exports = router;