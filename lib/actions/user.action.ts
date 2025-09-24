"use server";

import User from "@/models/user.model";
import connectDB from "../connectDB";
import { revalidatePath } from "next/cache";

export async function createUser(user: CreateUserParams) {
  try {
    await connectDB();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (e: any) {
    throw new Error(`Encountered error while creating user:`, e);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (e: any) {
    throw new Error(`Encountered error while fetching user:`, e);
  }
}

export async function UpdateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectDB();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (e: any) {
    throw new Error(`Encountered error while updating user:`, e);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectDB();
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (e: any) {
    throw new Error(`Encountered error while deleting user:`, e);
  }
}
