import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { authenticatedFetch } from "../lib/auth";
import "../styles/components/users.css";

type UserListItem = {
    id: string;
    name: string;
    email: string;
};

export const UsersPage = () => {
    const { data: session } = authClient.useSession();
    const userId = session?.user.id;
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const controller = new AbortController();
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authenticatedFetch("/api/users", {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(response.status === 403
                        ? "Sinulla ei ole oikeutta tarkastella käyttäjiä."
                        : "Käyttäjien lataaminen epäonnistui.");
                }

                const data: unknown = await response.json();
                if (!Array.isArray(data) || !data.every((user: unknown) =>
                    typeof user === "object" && user !== null
                    && "id" in user && typeof user.id === "string"
                    && "name" in user && typeof user.name === "string"
                    && "email" in user && typeof user.email === "string"
                )) {
                    throw new Error("Palvelin palautti virheelliset käyttäjätiedot.");
                }

                if (!controller.signal.aborted) setUsers(data as UserListItem[]);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Käyttäjien lataaminen epäonnistui.");
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        void fetchUsers();
        return () => controller.abort();
    }, [userId]);

    return (
        <section className="users-page" aria-labelledby="users-title">
            <header className="users-heading">
                <h1 id="users-title">Käyttäjät</h1>
                {!isLoading && !error && (
                    <span className="users-count">
                        {users.length} {users.length === 1 ? "käyttäjä" : "käyttäjää"}
                    </span>
                )}
            </header>

            {isLoading ? (
                <p className="users-message" role="status">Ladataan käyttäjiä...</p>
            ) : error ? (
                <p className="users-message users-error" role="alert">{error}</p>
            ) : users.length === 0 ? (
                <p className="users-message">Ei käyttäjiä.</p>
            ) : (
                <div className="users-table-wrap">
                    <table className="users-table">
                        <caption className="users-sr-only">Rekisteröidyt käyttäjät</caption>
                        <thead>
                            <tr>
                                <th scope="col">Nimi</th>
                                <th scope="col">Sähköposti</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="users-name">{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};
