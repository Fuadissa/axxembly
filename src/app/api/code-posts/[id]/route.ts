import dbConnect from "@/lib/db";
import { CodePost } from "@/lib/models/CodePostSchema";
import { NextResponse } from "next/server";

// Function to get a single code post by its ID
async function getSinglePost(postId: string) {
  await dbConnect();

  const post = await CodePost.findById(postId).exec();
  return post;
}

// GET function to handle fetching a single post
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: postId } = params;

  try {
    // Ensure database connection
    await dbConnect();

    // Fetch the post using the provided ID
    const post = await getSinglePost(postId);

    if (!post) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching the post:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the post." },
      { status: 500 }
    );
  }
}
