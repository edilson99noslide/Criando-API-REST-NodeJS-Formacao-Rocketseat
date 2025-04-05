import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PORT: z.number().default(3333),
})

const envValidator = envSchema.safeParse(process.env)

if(!envValidator.success) {
  console.error('Invalid environment variable(s)!', envValidator.error.format())

  throw new Error('Invalid environment variable(s).')
}

export const env = envValidator.data