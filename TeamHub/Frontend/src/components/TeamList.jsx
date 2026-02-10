import { useNavigate } from "react-router-dom"


export default function TeamList({ teams }) {
    const navigate=useNavigate();

    return (<ul>
        {teams.map((team) => (
            <li key={team.teamCode}>
                <div className="user-info">
                    <span className="team-name">{team.name}</span>
                    <span className="team-createdAt"> • CreatedAt: {new Date(team.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => navigate(`/teams/${team.teamCode}/projects`)}>
                        View Projects
                    </button>

                </div>
            </li>
        ))}
    </ul>)
}