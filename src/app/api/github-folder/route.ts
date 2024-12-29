import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiUrl = searchParams.get("url"); // The GitHub API URL from the query parameter

  console.log(apiUrl);
  if (!apiUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Use the GitHub token
      },
    });
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return new Response("Error fetching GitHub data", { status: 500 });
  }
}
