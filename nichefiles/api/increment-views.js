import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { postId } = req.body;
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const serverClient = createClient({
    projectId: "loxotint",
    dataset: "production",
    useCdn: false,
    apiVersion: "2024-04-07",
    token: process.env.SANITY_API_TOKEN,
  });

  try {
    await serverClient
      .patch(postId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return res.status(200).json({ message: "View count updated securely" });
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ message: "Failed to update views" });
  }
}
