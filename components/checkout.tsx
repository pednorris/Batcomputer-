'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  productId: string
  onComplete: () => void
}

export default function Checkout({ productId, onComplete }: CheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  const startCheckoutSessionForProduct = useCallback(
    async () => {
      try {
        const clientSecret = await startCheckoutSession(productId)
        return clientSecret
      } catch (err) {
        setError('Erro ao iniciar checkout. Tente novamente.')
        throw err
      }
    },
    [productId],
  )

  const handleComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
        <button 
          onClick={() => setError(null)}
          className="block mx-auto mt-4 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div id="checkout" className="w-full max-w-md mx-auto">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ 
          clientSecret: startCheckoutSessionForProduct,
          onComplete: handleComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
