import { AccessToken, VideoGrant } from "livekit-server-sdk"
import { NextRequest, NextResponse } from "next/server"

const apiKey = process.env.LIVEKIT_API_KEY
const apiSecret = process.env.LIVEKIT_API_SECRET
const livekitUrl = process.env.LIVEKIT_URL

export type ConnectionParams = {
  serverUrl: string
  roomName: string
  participantName: string
  participantToken: string
}

export async function GET(request: NextRequest) {
  try {
    if (!apiKey || !apiSecret || !livekitUrl) {
      throw new Error(
        "LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL must be defined"
      )
    }

    const { searchParams } = new URL(request.url)
    const roomName =
      searchParams.get("roomName") || `room-${Math.random() * 10_000}`
    const participantName =
      searchParams.get("participantName") || `user-${Math.random() * 10_000}`

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: "15m",
    })

    const videoGrant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      canUpdateOwnMetadata: true,
    }

    at.addGrant(videoGrant)

    const token = await at.toJwt()
    const connectionParams: ConnectionParams = {
      serverUrl: livekitUrl,
      roomName,
      participantName,
      participantToken: token,
    }

    return NextResponse.json(connectionParams, { status: 200 })
  } catch (error) {
    console.error("Error generating LiveKit token:", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}
