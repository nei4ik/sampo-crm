import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import '../styles/components/auth.css'
import { authClient } from '../lib/auth-client'

function LoginPage() {
	const navigate = useNavigate()
	const [error, setError] = useState<string | null>(null)
	const { data: session } = authClient.useSession()
	useEffect(() => {
		if (session) {
			navigate('/asiakkaat', { replace: true })
		}
	}, [session, navigate])

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		const formData = new FormData(e.currentTarget)
		const username = String(formData.get('username') ?? '').trim()
		const password = String(formData.get('password') ?? '')

		try {
			const { error } = await authClient.signIn.username({
				username,
				password,
			})
			if (error) {
				throw new Error(error.message)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Invalid credentials')
		}
	}

	return (
		<section className="auth-page" aria-labelledby="login-title">
			<div className="auth-card">
				<div className="auth-heading">
					<span className="auth-eyebrow">Sampo</span>
					<h1 id="login-title">Kirjaudu sisään</h1>
					<p className="auth-description">Kirjaudu asiakasrekisteriin käyttäjätunnuksellasi.</p>
				</div>

				{error && <div className="auth-error" role="alert">{error}</div>}

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="auth-field">
						<label htmlFor="username">Käyttäjänimi</label>
						<input
							id="username"
							name="username"
							type="text"
							required
							placeholder="Käyttäjänimi"
							className="auth-input"
						/>
					</div>

					<div className="auth-field">
						<label htmlFor="password">Salasana</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							minLength={8}
							placeholder="Salasana"
							className="auth-input"
						/>
					</div>

					<button type="submit" className="auth-submit">
						Kirjaudu sisään
					</button>
				</form>
			</div>
		</section>
	)
}

export default LoginPage
