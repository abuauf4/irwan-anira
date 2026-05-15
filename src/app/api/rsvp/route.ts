import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/rsvp — Fetch all RSVP entries, newest first
export async function GET() {
  try {
    const rsvps = await db.rSVP.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Failed to fetch RSVPs:', error)
    return NextResponse.json({ error: 'Failed to fetch RSVPs' }, { status: 500 })
  }
}

// POST /api/rsvp — Submit RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, attending, guests, message } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nama harus diisi' }, { status: 400 })
    }

    if (typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Konfirmasi kehadiran harus diisi' }, { status: 400 })
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ error: 'Nama terlalu panjang' }, { status: 400 })
    }

    const guestCount = typeof guests === 'number' ? Math.max(1, Math.min(guests, 10)) : 1

    const rsvp = await db.rSVP.create({
      data: {
        name: name.trim(),
        attending,
        guests: guestCount,
        message: typeof message === 'string' ? message.trim() : '',
      },
    })

    return NextResponse.json(rsvp, { status: 201 })
  } catch (error) {
    console.error('Failed to create RSVP:', error)
    return NextResponse.json({ error: 'Gagal mengirim konfirmasi' }, { status: 500 })
  }
}
