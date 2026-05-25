import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { verifyAdminRequest } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("GET /api/achievements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tagsRaw = formData.get("tags") as string;
    const coverImageFile = formData.get("coverImage") as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const tags = tagsRaw
      ? JSON.stringify(tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean))
      : "[]";

    let slug = slugify(title);
    // ensure unique slug
    const existing = await prisma.achievement.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    let coverImage = "/images/galary-school.png";
    if (coverImageFile && coverImageFile.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const bytes = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${coverImageFile.name.replace(/\s+/g, "-")}`;
      await writeFile(path.join(uploadsDir, filename), buffer);
      coverImage = `/uploads/${filename}`;
    }

    // Handle gallery images
    const galleryFiles: string[] = [];
    const galleryEntries = formData.getAll("galleryImages");
    for (const entry of galleryEntries) {
      if (entry instanceof File && entry.size > 0) {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const bytes = await entry.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${entry.name.replace(/\s+/g, "-")}`;
        await writeFile(path.join(uploadsDir, filename), buffer);
        galleryFiles.push(`/uploads/${filename}`);
      }
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        slug,
        description,
        tags,
        coverImage,
        galleryImages: JSON.stringify(galleryFiles),
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error("POST /api/achievements error:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}
