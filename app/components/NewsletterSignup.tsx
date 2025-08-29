'use client'

import { useState } from 'react'
import { usePlausible } from 'next-plausible'

export default function NewsletterSignup() {
  const plausible = usePlausible()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Merci! Vérifiez votre email pour confirmer votre inscription.')
        setEmail('')
        plausible('Newsletter Signup', { 
          props: { 
            email_domain: email.split('@')[1] 
          } 
        })
      } else {
        setStatus('error')
        setMessage(data.message || 'Une erreur est survenue. Veuillez réessayer.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Une erreur est survenue. Veuillez réessayer.')
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <section className="rounded-2xl px-8 md:px-12">
      <div className="mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            📬 Restez <span className="text-orange-600">informé</span>
          </h2>
          <p className="text-gray-600">
            Recevez les nouveautés de CalABSSA : nouvelles fonctionnalités, début de saison, et mises à jour importantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            disabled={status === 'loading' || status === 'success'}
            required
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${status === 'loading' || status === 'success'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
          >
            {status === 'loading' ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {message}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  )
}
