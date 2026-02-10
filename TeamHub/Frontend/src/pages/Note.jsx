import { useParams } from "react-router-dom";
import NoteList from "../components/NoteList";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/base";


export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [noteContent, setNoteContent] = useState("");


    const { taskCode } = useParams();

    const fetchNote = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/notes/task/${taskCode}`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }
            const data = await res.json();
            console.log(data.notes)
            setNotes(data.notes);

        } catch (err) {
            setError(err.message)
            console.log(err.message)
        } finally {
            setLoading(false);
        }

    }

    const createNote = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/notes/task/${taskCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    content: noteContent
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create Note.");
            }

            const data = await res.json();


            setNoteContent("")

            fetchNote()
        } catch (error) {
            console.error(error)
            alert("Could not create note")
        }

    }

    useEffect(() => {
        fetchNote();
    }, [taskCode])

    if (loading) return <h4>Loading tasks...</h4>;
    if (error) return <h4>{error}</h4>;

    return (
        <div>
            <div className="fetch-notes">
                <h3>My Notes</h3>
                {notes.length === 0  && <p>No notes yet</p>}
                <NoteList notes={notes} />
            </div>
            <div className="create-tasks">

                <textarea
                    value={noteContent}
                    placeholder="Enter note content here..."
                    onChange={(e) => setNoteContent(e.target.value)}
                />

                <button onClick={createNote} disabled={!noteContent}>
                    Create
                </button>

            </div>
        </div>
    )

}