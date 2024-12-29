import { NextRequest, NextResponse } from "next/server"; // Use NextRequest
import { CodePost } from "@/lib/models/CodePostSchema"; // Ensure the correct path for the CodePost schema
import { ObjectId } from "mongodb"; // Ensure MongoDB's ObjectId is imported
import dbConnect from "@/lib/db";

const PAGE_SIZE = 20;

// Function to get posts with pagination
async function getPostsForYou(cursor: string | null) {
  await dbConnect();

  const query = cursor ? { _id: { $gt: new ObjectId(cursor) } } : {};

  const posts = await CodePost.find(query)
    .sort({ _id: 1 })
    .limit(PAGE_SIZE)
    .exec();

  return posts;
}

// Export the GET function for fetching posts (with pagination)
export async function GET(req: NextRequest) {
  const url = new URL(req.url); // Parse the URL
  const cursor = url.searchParams.get("cursor"); // Extract query parameter

  try {
    const posts = await getPostsForYou(cursor);
    const nextCursor =
      posts.length === PAGE_SIZE
        ? posts[posts.length - 1]._id.toString()
        : null;

    return NextResponse.json({
      posts,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while fetching posts." },
      { status: 500 }
    );
  }
}

// Export the POST function for creating a new code post
export async function POST(req: Request) {
  try {
    await dbConnect();

    // Parse JSON body
    const body = await req.json();

    console.log("Creating code post with body:", body.github);

    const newPost = new CodePost(body);
    await newPost.save();

    return NextResponse.json({
      success: true,
      message: "Code post created successfully.",
    });
  } catch (error) {
    console.error("Error creating code post:", error);
    return NextResponse.json(
      { message: "Error creating code post." },
      { status: 500 }
    );
  }
}
