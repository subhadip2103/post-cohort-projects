import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectList from "../components/ProjectList";
import { API_BASE_URL } from "../api/base.js";


export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [projectTitle, setProjectTitle] = useState();
    const [projectDescription, setProjectDescription] = useState();



    const { teamCode } = useParams();

    const fetchProject = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/projects/team/${teamCode}`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }
            const data = await res.json();
            console.log(data.projects)
            setProjects(data.projects);

        } catch (err) {
            setError(err.message)
            console.log(err.message)
        } finally {
            setLoading(false);
        }

    }

    const createProject = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    teamCode,
                    title: projectTitle,
                    description: projectDescription
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create team.");
            }

            const data = await res.json();

            setProjectTitle("")
            setProjectDescription("");

            fetchProject()
        } catch (error) {
            console.error(err)
            alert("Could not create project")
        }

    }
    useEffect(() => {
        fetchProject()
    }, [teamCode])

    if (loading) return <h4>Loading Projects...</h4>;
    if (error) return <h4>{error}</h4>;


    return (
        <div>
            <div className="fetch-projects">
                <h3>My Projects</h3>
                {projects.length === 0 && <p>No projects yet</p>}
                <ProjectList projects={projects} />
            </div>
            <div className="create-projects">
                <h3>Create Projects</h3>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)} />
                    <textarea
                        name="description"
                        id="project-description"
                        value={projectDescription}
                        placeholder="Enter your description here"
                        onChange={(e) => setProjectDescription(e.target.value)} />
                    <button onClick={() => createProject()} disabled={!projectTitle}>Create</button>
                </div>
            </div>
        </div>


    )

}