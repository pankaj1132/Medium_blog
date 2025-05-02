import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { signupInput, signinInput } from "@pankaj1109/medium-blog";

export const userRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();







userRoutes.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log(body);
  const result = signupInput.safeParse(body);
  console.log(result);
  if (!result.success) { // Check result.success instead of just result
    c.status(400);
    return c.json({ error: "invalid input", details: result.error });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "user already exists" });
  }
});




userRoutes.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const result = signinInput.safeParse(body);
  if (!result) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

