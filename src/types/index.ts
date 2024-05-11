export type Note = {
  id: string,
} & NoteData

export type Tag = {
  id: string,
  label: string,
}

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[]
}

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

//für Home Page
export type SimplifiedNote = {
  tags: Tag[]
  title: string
  id: string
}

export type NoteListProps = {
  availableTags: Tag[]
  notes: SimplifiedNote[]
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, label: string) => void
}

export type EditTagsModalProps = {
  show: boolean
  availableTags: Tag[]
  handleClose: () => void
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, label: string) => void
}

