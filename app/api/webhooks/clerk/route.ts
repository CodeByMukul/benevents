
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Move Prisma Client initialization outside the function to avoid creating new instances on each request.

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    return new Response('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local', {
      status: 500,
    })
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err: any) {
    console.error('Error: Could not verify webhook:', err)
    return new Response(`Error: Verification error - ${err.message}`, {
      status: 400,
    })
  }

  // Handle different event types
  const eventType = evt.type

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data
      const user = {
        clerkId: id || "",
        email: email_addresses[0].email_address || "",
        username: username || "",
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url
      }

      const newUser = await prisma.user.create({
        data: user
      })

      console.log(newUser)
      return new Response("User created successfully", { status: 201 })
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data
      const updatedUser = {
        email: email_addresses[0].email_address || '',
        username: username || '',
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url
      }

      const userToUpdate = await prisma.user.update({
        where: { clerkId: id },
        data: updatedUser
      })

      console.log(userToUpdate)
      return NextResponse.json({ msg: 'User Updated', user: userToUpdate })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      const deletedUser = await prisma.user.delete({
        where: { clerkId: id }
      })
      const posttt=await prisma.event.deleteMany({
        where:{
          organizer:id
        }
      })
      console.log(posttt)
      console.log(deletedUser)
      return NextResponse.json({ msg: 'User Deleted', user: deletedUser ,posttt})
    }

    return new Response('Webhook received', { status: 200 })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return new Response(`Error processing webhook: ${error.message}`, { status: 500 })
  }
}

