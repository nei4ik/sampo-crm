import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { username } from 'better-auth/plugins'

const secret = process.env.BETTER_AUTH_SECRET ?? process.env.JWT_SECRET
if (!secret?.trim()) {
	throw new Error('BETTER_AUTH_SECRET or JWT_SECRET must be configured')
}

export const prisma = new PrismaClient()

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: 'sqlite' }),
	secret,
	baseURL: process.env.BETTER_AUTH_URL ?? `http://localhost:${process.env.PORT ?? '3001'}`,
	trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
	plugins: [username()],
})
