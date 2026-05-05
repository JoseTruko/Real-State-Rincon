import { z } from 'zod'

export const contactSchema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters'),
  email:       z.string().email('Invalid email address'),
  phone:       z.string().optional(),
  message:     z.string().min(10, 'Message must be at least 10 characters'),
  honeypot:    z.string().max(0, 'Bot detected').optional(),
  property_id: z.string().uuid().optional(),
  agent_id:    z.string().uuid().optional(),
  source:      z.enum(['form', 'whatsapp', 'email_reveal', 'seller']),
})

export type ContactFormData = z.infer<typeof contactSchema>
