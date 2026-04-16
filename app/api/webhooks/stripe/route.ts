import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Se você tiver um webhook secret configurado, descomente a linha abaixo
    // event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    
    // Por enquanto, apenas parse o evento
    event = JSON.parse(body) as Stripe.Event
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }

  // Processa o evento
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Pagamento confirmado!
      console.log('Pagamento confirmado para:', session.customer_details?.email)
      console.log('Produto:', session.metadata?.productId)
      console.log('Valor:', session.amount_total)
      
      // Aqui você pode:
      // 1. Salvar no banco de dados que o usuário pagou
      // 2. Enviar email de confirmação
      // 3. Ativar a conta do usuário
      
      break
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment intent succeeded:', paymentIntent.id)
      break
    }
    
    default:
      console.log(`Evento não tratado: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
