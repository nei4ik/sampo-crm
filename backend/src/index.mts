import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getAllUsers } from './users.js'
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node'
import type { NextFunction, Request, Response } from 'express'
import { auth, prisma } from './auth.js'

const app = express()
const frontendOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173'

app.use(cors({ origin: frontendOrigin, credentials: true }))
//registration only for admin user
app.post('/api/auth/sign-up/email', requireAdmin)

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

async function requireAuth(req: Request, res: Response, next: NextFunction) {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		})
		if (!session) {
			res.status(401).json({ error: 'Unauthorized' })
			return
		}
		next()
	} catch (error) {
		console.error('Failed to validate session', error)
		res.status(500).json({ error: 'Failed to validate session' })
	}
}

async function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
			res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const adminId = process.env.ADMIN_USER_ID?.trim()

        if (!adminId || session.user.id !== adminId) {
            res.status(403).json({ error: 'Forbidden' })
            return
        }

        next()
    } catch (error) {
        console.error('Failed to check admin access', error)
        res.status(500).json({ error: 'Failed to check access' })
    }
}

// ── Customers (protected) ──

app.use('/api/customers', requireAuth)

app.get('/api/customers', async (_req, res) => {
	try {
		const customers = await prisma.customer.findMany({ orderBy: { id: 'asc' } })
		res.json(customers)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to fetch customers' })
	}
})

app.post('/api/customers', async (req, res) => {
	const { companyName, businessId, phone, billingAddress } = req.body ?? {}
	if (!companyName || !businessId || !phone || !billingAddress) {
		res.status(400).json({ error: 'All fields are required' })
		return
	}
	try {
		const customer = await prisma.customer.create({
		data: { companyName, businessId, phone, billingAddress },
		})
		res.status(201).json(customer)
	} catch (err) {
		console.error(err)
		res.status(400).json({ error: 'Failed to create customer' })
	}
})

app.put('/api/customers/:id', async (req, res) => {
	const id = Number(req.params.id)
	const { companyName, businessId, phone, billingAddress } = req.body ?? {}
	try {
		const customer = await prisma.customer.update({
		where: { id },
		data: { companyName, businessId, phone, billingAddress },
		})
		res.json(customer)
	} catch (err) {
		console.error(err)
		res.status(400).json({ error: 'Failed to update customer' })
	}
})

app.delete('/api/customers/:id', async (req, res) => {
	const id = Number(req.params.id)
	try {
		await prisma.customer.delete({ where: { id } })
		res.status(204).end()
	} catch (err) {
		console.error(err)
		res.status(400).json({ error: 'Failed to delete customer' })
	}
})

// ── Users (admin only) ──

app.use('/api/users', requireAdmin)

app.get('/api/users', async (_req, res) => {
	let data;
	try {
		data = await getAllUsers()
		res.json(data)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to fetch users' })
	}
})

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  	console.log(`API running at http://localhost:${port}`)
})
