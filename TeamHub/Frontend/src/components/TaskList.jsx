import { useNavigate } from "react-router-dom"


export default function TaskList({ tasks }) {
    const navigate=useNavigate();

    return (<ul>
        {tasks.map((task) => (
            <li key={task.taskCode}>
                <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    <span className="task-description">• {task.description}</span>
                    <span className="task-status">• {task.status}</span>
                    <span className="project-createdAt"> • CreatedAt: {new Date(task.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => navigate(`/tasks/${task.taskCode}/notes`)}>
                        View Notes
                    </button>

                </div>
            </li>
        ))}
    </ul>)
}