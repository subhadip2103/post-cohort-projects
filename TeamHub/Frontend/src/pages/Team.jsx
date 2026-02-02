import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/base";
import TeamList from "../components/TeamList";


export default function Team() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [teamName, setTeamName] = useState();
    const [inviteLink, setInviteLink] = useState();
    const [teamCode, setTeamCode] = useState();
    const [joinCode, setJoinCode] = useState();

    const fetchTeam = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/teams`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }
            const data = await res.json();
            console.log(data)
            setTeams(data.teams);

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }
    const createTeam = async (teamName) => {
        const res = await fetch(`${API_BASE_URL}/api/v1/teams`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ teamName }),
        });

        if (!res.ok) {
            throw new Error("Failed to create team.");
        }

        const data = await res.json();
        setInviteLink(data.inviteLink);
        setTeamCode(data.teamCode)
    }

    const joinTeam = async (teamCode) => {
        const res = await fetch(`${API_BASE_URL}/api/v1/teams/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ teamCode }),
        });

        if (!res.ok) {
            throw new Error("Team not found");
        }
        fetchTeam()
    }

    useEffect(() => {
        fetchTeam()
    }, [])

    if (loading) return <h4>Loading teams...</h4>;
    if (error) return <h4>{error}</h4>;
    { teams.length === 0 && <p>No teams yet</p> }
    <TeamList teams={teams} />


    return (
        <div>
            <div className="fetch-teams">
                <h3>My Teams</h3>
                <TeamList teams={teams} />
            </div>
            <div className="create-team">
                <h3>Create Team</h3>
                <div>
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)} />
                    <button onClick={() => createTeam(teamName)}>Create</button>
                    <div>
                        {inviteLink && (
                            <>
                                <p>Invite Link: {inviteLink}</p>
                                <p>Team Code: {teamCode}</p>
                            </>
                        )}

                    </div>
                </div>
            </div>
            <div className="join-team">
                <h3>Join Team</h3>
                <input
                    type="text"
                    placeholder="Team Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)} />
                <button onClick={() => joinTeam(joinCode)}>Join</button>
                <div>

                </div>
            </div>
        </div>


    )
}
