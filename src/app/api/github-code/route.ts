/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get("url");

  if (!repoUrl) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  // Parse the owner and repo name from the GitHub URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
  }

  const [_, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Use Bearer token
      },
      timeout: 10000, // Set the timeout to 10 seconds
    });

    if (response.status !== 200) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = response.data;
    return NextResponse.json({ tree: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { error: "Error fetching GitHub data" },
      { status: 500 }
    );
  }
}
