import { Navigate, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"
import NewNote from "./pages/NewNote"
import { useLocalStorage } from "./hooks"
import { NoteData, RawNote, Tag ,Note} from "./types"
import { useMemo } from "react"
import { nanoid } from 'nanoid'
import NoteList from "./pages/NoteList"
import NoteLayout from "./pages/NoteLayout"


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
  // adding tag
  const addTag = (tag: Tag) => {
    setTags(prevTags => [...prevTags, tag])
  } 
  return (
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags}/>} />
          <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>} />
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<h1>Show</h1>} />
          <Route
            path="edit"
            element={
              <h1>Edit</h1>
            }
          /> 
        </Route>
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Container>
  )
}

export default App
