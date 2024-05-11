import { Navigate, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"
import NewNote from "./pages/NewNote"
import { useLocalStorage } from "./hooks"
import { NoteData, RawNote, Tag } from "./types"
import { useMemo } from "react"
import { nanoid } from 'nanoid'
import NoteList from "./pages/NoteList"
import NoteLayout from "./pages/NoteLayout"
import { Note } from "./pages/Note"
import { EditNote } from "./pages/EditNote"


function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', [])
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => ({
      ...note,
      tags: tags.filter(tag => note.tagIds.includes(tag.id))
    }))
    
  }, [notes, tags])

  // create note
  const onCreateNote = ({tags, ...data}: NoteData) => {
    setNotes(prevNotes => {
      return [...prevNotes, {
        ...data,
        id: nanoid(),
        tagIds: tags.map(tag => tag.id)
      }]
    })
  }
  // update note
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }
  // delete note
  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }
  // adding tag
  const addTag = (tag: Tag) => {
    setTags(prevTags => [...prevTags, tag])
  } 
  // update tag
  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }
  // delete tag
  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }
  return (
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags} onUpdateTag={updateTag} onDeleteTag={deleteTag}/>} />
          <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>} />
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote}/>} />
          <Route
            path="edit"
            element={<EditNote   onSubmit={onUpdateNote}
            onAddTag={addTag}
            availableTags={tags}/>
            }
          /> 
        </Route>
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Container>
  )
}

export default App
