import { ChangeEvent, useState } from "react"
import logo from "./assets/Logo-nlw-expert.svg"
import { NewNoteCard } from "./components/new-note-card"
import { NoteCard } from "./components/note-card"

interface Note {
  id: string
  date: Date
  content: string
}


export function App() {


  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() =>{
    const notesOnStorage = localStorage.getItem("notes")
     
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onNoteCreated(content: string) {

    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem("notes", JSON.stringify(notesArray))

  }

  function onNoteDeleted(id: string) {
    const newNotesArray = notes.filter(el =>{
      return el.id != id
    })

    setNotes(newNotesArray)
    localStorage.setItem("notes", JSON.stringify(newNotesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search != "" ? notes.filter((el => el.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))) : notes


  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="logo Nlw Expert" />

      <form className="w-full">
        <input type="text"
          placeholder="Busque em suas notas..."
          className="bg-transparent w-full text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500 "
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map(el => {
          return <NoteCard key={el.id} note={el} onNoteDeleted={onNoteDeleted} />
        })}

      </div>

    </div>
  )
}
