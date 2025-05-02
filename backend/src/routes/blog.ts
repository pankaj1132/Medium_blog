import { Hono } from "hono";
import { sign } from "hono/jwt";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRoutes.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";

  const response = await verify(authHeader, c.env.JWT_SECRET);
  if (response) {
    c.set("userId", response.id as string);
    await next();
  } else {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }
});
blogRoutes.get("/bulk", async (c) => {
  const body = c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogs = await prisma.post.findMany();
    return c.json(blogs);
  } catch (e) {
    c.status(404);
    return c.json({ error: "blogs not found" });
  }
});

blogRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  console.log(id);
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blog = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    return c.json(blog);
  } catch (e) {
    c.status(404);
    return c.json({ error: "blog not found" });
  }
});

blogRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });
  return c.json(blog);
});

blogRoutes.put("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
      authorId: body.authorId,
    },
  });
  return c.json(blog);
});
