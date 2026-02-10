import { useNavigate } from "react-router-dom";

export default function NoteList({ notes }) {
    const navigate = useNavigate();

    return (
        <ul>
            {notes.map((note) => (
                <li key={note.noteCode}>
                    <div className="note-info">
                        <span className="note-content">{note.content}</span>
                        <span className="note-owner"> • {note.createdBy.firstname} {note.createdBy.lastname}</span>
                        <span className="note-createdAt"> 
                            • Created At: {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
}