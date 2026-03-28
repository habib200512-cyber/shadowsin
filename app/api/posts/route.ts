import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1).max(2000),
  tags: z.array(z.string()).default([]),
  isAnonymous: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  price: z.number().nullable().optional(),
  media: z.object({
    url: z.string(),
    publicId: z.string(),
    type: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    duration: z.number().optional(),
  }).nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;
    const data = schema.parse(await req.json());

    const post = await prisma.post.create({
      data: {
        userId,
        content: data.content,
        tags: data.tags,
        isAnonymous: data.isAnonymous,
        isPremium: data.isPremium,
        price: data.price,
        ...(data.media && {
          media: {
            create: {
              userId,
              url: data.media.url,
              publicId: data.media.publicId,
              type: data.media.type,
              width: data.media.width,
              height: data.media.height,
              duration: data.media.duration,
              size: 0,
            },
          },
        }),
      },
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
        media: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
