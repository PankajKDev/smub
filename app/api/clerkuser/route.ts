import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, UpdateUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  if (!SIGNING_SECRET) {
    throw new Error(`Error: Please add Signing secret`);
  }
  //creating svix instance
  const wh = new Webhook(SIGNING_SECRET);

  //get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  //get body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  let evt: WebhookEvent | null = null;

  //verifying payload with headers

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (e) {
    console.log(`Error : could not verify webhook :`, e);
  }

  if (!evt) {
    return new Response("Error: Invalid webhook event", {
      status: 400,
    });
  }

  //Do something with payload
  // for this guide,log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  if (evt?.type === "user.created") {
    console.log("Webhook received data:", req.body);
    const userInfo = evt.data;

    const user = {
      clerkId: userInfo.id,
      email: userInfo.email_addresses[0].email_address,
      username: userInfo.username!,
      firstName: userInfo.first_name || "",
      lastName: userInfo.last_name || "",
      photo: userInfo.image_url,
    };
    const newUser = await createUser(user);
    if (newUser) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userInfo.id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }
    return NextResponse.json({ message: "OK", user: newUser });
  }

  if (evt?.type === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name || "",
      lastName: last_name || "",
      username: username!,
      photo: image_url,
    };
    const updatedUser = await UpdateUser(id, user);
    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  if (evt?.type === "user.deleted") {
    const { id } = evt.data;
    const deletedUser = await deleteUser(id!);
    return NextResponse.json({ message: "OK", user: deletedUser });
  }
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);
  return new Response("Webhook received", { status: 200 });
}
