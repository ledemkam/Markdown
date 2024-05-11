import { nanoid } from "nanoid"
import { FormEvent, useRef, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate} from "react-router-dom"
import CreatableReactSelect from 'react-select/creatable'
import { NoteData, Tag } from "../../types"


type NoteFormProps = {
  onSubmit: (data : NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<NoteData>

const NoteForm = ({onSubmit,onAddTag,availableTags} : NoteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null)  
  const MarkdownRef = useRef<HTMLTextAreaElement>(null)
  const [selectTags, setSelectTags] = useState<Tag[]>([])
  const navigate = useNavigate()

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
   
    onSubmit({
      title : titleRef.current!.value,
      markdown : MarkdownRef.current!.value,
      tags : selectTags
    })
    navigate('..') //bedeutet, dass wir jedes Mal, wenn wir auf „Save button“ klicken, auf dem homepage  zurückgehen
  } 
  return (
    <Form onSubmit={handleSubmit}>
      <Stack>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control required ref={titleRef}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="tag">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
              onCreateOption={label => {
                const newTag = {id: nanoid(), label}
                onAddTag(newTag)
                setSelectTags(prevTags => [...prevTags, newTag])
              }}
              value={selectTags.map(tag => ({value: tag.id, label: tag.label}))}
              options={availableTags.map(tag => ({value: tag.id, label: tag.label}))}
              onChange={ 
                tags => {
                  setSelectTags(tags ? tags.map(tag => ({id: tag.value, label: tag.label})) : [])
                }
              }
              
              isMulti/>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control as="textarea" rows={15} ref={MarkdownRef}   required/>
        </Form.Group>
        <Stack direction="horizontal" gap={3}>
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Link to="/" >
             <Button variant="outline-secondary" type="button">
              Cancel
            </Button>
          </Link>
        </Stack>  
      </Stack>
      
    </Form>
  )
}
export default NoteForm