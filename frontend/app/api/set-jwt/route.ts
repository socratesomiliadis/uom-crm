import { serialize } from "cookie";

export async function POST(request: Request) {
  const body = await request.json();

  const { token } = body;

  const seralized = serialize(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!, token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 86400,
    path: "/",
  });

  const response = {
    message: "Authenticated!",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": seralized },
  });
}
