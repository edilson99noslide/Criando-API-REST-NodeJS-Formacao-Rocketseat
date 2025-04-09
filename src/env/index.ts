import { config } from 'dotenv'
import { z } from 'zod'

if(process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PORT: z.coerce.number().default(3333),
})

const envValidator = envSchema.safeParse(process.env)

if (!envValidator.success) {
  console.error('Invalid environment variable(s)!', envValidator.error.format())

  throw new Error('Invalid environment variable(s).')
}

export const env = envValidator.data
