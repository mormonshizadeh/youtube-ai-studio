import { GET as startGoogleOAuth } from '../route';

export async function GET(request) {
  return startGoogleOAuth(request);
}
