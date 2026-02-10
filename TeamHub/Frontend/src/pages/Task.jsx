import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList.jsx";
import { API_BASE_URL } from "../api/base.js";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [taskTitle, setTaskTitle] = useState();
    const [taskDescription, setTaskDescription] = useState();
    const [status, setStatus] = useState("todo");
    const [members, setMembers] = useState([]);
    const [taskAssignedTo,setTaskAssignedTo]=useState("")



    const { projectCode } = useParams();

    const fetchTask = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/tasks/project/${projectCode}`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }
            const data = await res.json();
            console.log(data)
            setTasks(data);

        } catch (err) {
            setError(err.message)
            console.log(err.message)
        } finally {
            setLoading(false);
        }

    }

    const createTask = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/tasks/project/${projectCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    status,
                    assignedTo: taskAssignedTo || undefined
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create team.");
            }

            const data = await res.json();

            setTaskTitle("")
            setTaskDescription("");

            fetchTask()
        } catch (error) {
            console.error(error)
            alert("Could not create project")
        }

    }

    const fetchContext = async () => {
        const res = await fetch(
            `${API_BASE_URL}/api/v1/projects/${projectCode}/context`,
            { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to load project context");

        const data = await res.json();
        setMembers(data.members);
    };



    useEffect(() => {
        fetchTask();
        fetchContext();
    }, [projectCode])

    if (loading) return <h4>Loading tasks...</h4>;
    if (error) return <h4>{error}</h4>;


    return (
        <div>
            <div className="fetch-tasks">
                <h3>My Tasks</h3>
                {tasks.length === 0 && <p>No tasks yet</p>}
                <TaskList tasks={tasks} />
            </div>
            <div className="create-tasks">
                <input
                    type="text"
                    placeholder="Title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />

                <textarea
                    value={taskDescription}
                    placeholder="Enter your description here..."
                    onChange={(e) => setTaskDescription(e.target.value)}
                />

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                </select>

                <select
                    value={taskAssignedTo || ""}
                    onChange={(e) => setTaskAssignedTo(e.target.value)}
                >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                        <option key={m.userId} value={m.userId}>
                            {m.name}
                        </option>
                    ))}
                </select>

                <button onClick={createTask} disabled={!taskTitle}>
                    Create
                </button>

            </div>
        </div>


    )

}