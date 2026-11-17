import 'dotenv/config'
import { auth, prisma } from './auth.js'

async function initDb() {
  console.log('Initializing database...')
  
  const existingUser = await prisma.user.findUnique({ where: { username: 'admin' } })
  
  if (!existingUser) {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || adminPassword.length < 8) {
      throw new Error('Set ADMIN_PASSWORD to a value of at least 8 characters before initializing the database.')
    }
    await auth.api.signUpEmail({
      body: {
        email: 'admin@accounts.invalid',
        name: 'admin',
        password: adminPassword,
        username: 'admin',
      },
    })
    console.log('Created user: admin')
  } else {
    console.log('User admin already exists')
  }

  const existingCustomer = await prisma.customer.findFirst({
    where: { businessId: '1234567-8' },
  })
  if (!existingCustomer) {
    await prisma.customer.create({
      data: {
        companyName: 'Test Oy',
        businessId: '1234567-8',
        phone: '+358 40 1234567',
        billingAddress: 'Testkatu 1, 00100 Helsinki',
      },
    })
    console.log('Created test customer')
  } else {
    console.log('Test customer already exists')
  }
}

initDb().catch((e) => {
  console.error(e)
  process.exitCode = 1
}).finally(async () => {
  await prisma.$disconnect()
})
