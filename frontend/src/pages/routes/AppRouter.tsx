import { Routes, Route, Navigate } from 'react-router'
import MainPage from '../MainPage.tsx'
import ClientsPage from '../ClientsPage.tsx'
import LoginPage from '../LoginPage.tsx'
import { UsersPage } from '../UsersPage.tsx'
import { CreateUserPage } from '../CreateUserPage.tsx'
import { authClient } from '../../lib/auth-client'

function ProtectedClientsRoute() {
	const {
		data: session,
		isPending,
		error,
		refetch,
	} = authClient.useSession()

	if (isPending) {
		return <p>Sivu latautuu...</p>
	}

	if (error) {
		return (
		<div>
			<p>Kirjautuminen ei onnistunut</p>
			<button onClick={() => void refetch()}>
			Yritä uudelleen
			</button>
		</div>
		)
	}
	if (!session) {
		return <Navigate to="/login" replace />
	}

	return <ClientsPage /> }

	function ProtectedUsersRoute() {
	const {
		data: session,
		isPending,
		error,
		refetch,
	} = authClient.useSession()

	if (isPending) {
		return <p>Sivu latautuu...</p>
	}

	if (error) {
		return (
		<div>
			<p>Kirjautuminen ei onnistunut</p>
			<button onClick={() => void refetch()}>
			Yritä uudelleen
			</button>
		</div>
		)
	}

	if (!session || session.user.username !== 'admin') {
		return <Navigate to="/" replace />
	}

	return <UsersPage /> }

	function ProtectedCreateUserRoute() {
	const {
		data: session,
		isPending,
		error,
		refetch,
	} = authClient.useSession()

	if (isPending) {
		return <p>Sivu latautuu...</p>
	}

	if (error) {
		return (
		<div>
			<button onClick={() => void refetch()}>
			Yritä uudelleen
			</button>
		</div>
		)
	}

	if (!session || session.user.username !== 'admin') {
		return <Navigate to="/" replace />
	}

	return <CreateUserPage /> }

export const AppRouter = () => {
  	return (
		<Routes>
			<Route path="/" element={<MainPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/asiakkaat" element={<ProtectedClientsRoute />}/>
			<Route path="/kayttajat" element={<ProtectedUsersRoute />}/>
			<Route path="/luo-kayttaja" element={<ProtectedCreateUserRoute />}/>
		</Routes>
  	)
}