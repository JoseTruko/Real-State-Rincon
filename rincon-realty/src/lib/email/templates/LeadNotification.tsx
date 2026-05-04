import * as React from 'react'
import { SITE_NAME, SITE_URL } from '@/config/site'
import type { Contact } from '@/types'

interface LeadNotificationProps {
  contact: Contact
  propertyTitle?: string
  agentName?: string
}

export function LeadNotification({ contact, propertyTitle, agentName }: LeadNotificationProps) {
  const sourceLabels: Record<string, string> = {
    form:          'Contact Form',
    whatsapp:      'WhatsApp Click',
    email_reveal:  'Email Reveal',
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: '#1A3A2A', padding: '20px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: '#C5973A', margin: 0, fontSize: '20px' }}>{SITE_NAME}</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: '14px' }}>New Lead Notification</p>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
        <h2 style={{ color: '#1C2833', fontSize: '18px', marginTop: 0 }}>
          New lead from {contact.name}
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', width: '120px' }}>Name</td>
              <td style={{ padding: '8px 0', color: '#1C2833', fontWeight: 'bold' }}>{contact.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Email</td>
              <td style={{ padding: '8px 0' }}>
                <a href={`mailto:${contact.email}`} style={{ color: '#1A5276' }}>{contact.email}</a>
              </td>
            </tr>
            {contact.phone && (
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Phone</td>
                <td style={{ padding: '8px 0', color: '#1C2833' }}>{contact.phone}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Source</td>
              <td style={{ padding: '8px 0', color: '#1C2833' }}>{sourceLabels[contact.source] ?? contact.source}</td>
            </tr>
            {propertyTitle && (
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Property</td>
                <td style={{ padding: '8px 0', color: '#1C2833' }}>{propertyTitle}</td>
              </tr>
            )}
            {agentName && (
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Agent</td>
                <td style={{ padding: '8px 0', color: '#1C2833' }}>{agentName}</td>
              </tr>
            )}
          </tbody>
        </table>

        {contact.message && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #1A5276' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#1C2833', lineHeight: '1.5' }}>{contact.message}</p>
          </div>
        )}

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <a
            href={`${SITE_URL}/admin/leads`}
            style={{ display: 'inline-block', background: '#1A5276', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
          >
            View in Dashboard →
          </a>
        </div>

        <p style={{ marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
          Received: {new Date(contact.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
