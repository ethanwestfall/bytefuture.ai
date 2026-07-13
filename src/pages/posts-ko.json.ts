import { getPostsManifest, jsonResponse } from '../lib/posts-manifest';

export async function GET() {
  return jsonResponse(await getPostsManifest('ko'));
}
