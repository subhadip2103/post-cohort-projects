import { useNavigate } from "react-router-dom"


export default function ProjectList({ projects }) {
    const navigate=useNavigate();

    return (<ul>
        {projects.map((project) => (
            <li key={project.projectCode}>
                <div className="project-info">
                    <span className="project-title">{project.title}</span>
                    <span className="project-description">• {project.description}</span>
                    <span className="project-createdAt"> • CreatedAt: {new Date(project.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => navigate(`/projects/${project.projectCode}/tasks`)}>
                        View Tasks
                    </button>

                </div>
            </li>
        ))}
    </ul>)
}