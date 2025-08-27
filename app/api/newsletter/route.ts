import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { message: 'Email invalide' },
        { status: 400 }
      )
    }

    const listmonkUrl = process.env.LISTMONK_API_URL
    const listUuid = process.env.LISTMONK_LIST_UUID

    if (!listmonkUrl || !listUuid) {
      console.error('Listmonk configuration missing')
      return NextResponse.json(
        { message: 'Service temporairement indisponible' },
        { status: 500 }
      )
    }

    // Use Listmonk's public subscription endpoint (no auth required)
    const response = await fetch(`${listmonkUrl}/api/public/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: email.split('@')[0], // Use part before @ as name
        list_uuids: [listUuid],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Listmonk error:', errorData)

      // Check if user is already subscribed
      if (response.status === 409 || errorData.includes('already subscribed')) {
        return NextResponse.json(
          { message: 'Vous êtes déjà inscrit à notre newsletter!' },
          { status: 200 } // Return 200 to show as success
        )
      }

      return NextResponse.json(
        { message: 'Erreur lors de l\'inscription. Veuillez réessayer.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Inscription réussie! Vérifiez votre email.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { message: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
