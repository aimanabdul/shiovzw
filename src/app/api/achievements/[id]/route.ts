import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { verifyAdminRequest } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const achievement = await prisma.achievement.findUnique({
      where: { id: idNum },
    });
    if (!achievement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(achievement);
  } catch (error) {
    console.error("GET /api/achievements/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tagsRaw = formData.get("tags") as string;
    const coverImageFile = formData.get("coverImage") as File | null;

    const existing = await prisma.achievement.findUnique({ where: { id: idNum } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const tags = tagsRaw
      ? JSON.stringify(tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean))
      : existing.tags;

    let slug = title ? slugify(title) : existing.slug;
    // Check if slug conflicts with another record
    const slugConflict = await prisma.achievement.findUnique({ where: { slug } });
    if (slugConflict && slugConflict.id !== idNum) {
      slug = `${slug}-${Date.now()}`;
    }

    let coverImage = existing.coverImage;
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
    let galleryImages = existing.galleryImages;
    const galleryEntries = formData.getAll("galleryImages");
    const newGalleryFiles: string[] = [];
    for (const entry of galleryEntries) {
      if (entry instanceof File && entry.size > 0) {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const bytes = await entry.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${entry.name.replace(/\s+/g, "-")}`;
        await writeFile(path.join(uploadsDir, filename), buffer);
        newGalleryFiles.push(`/uploads/${filename}`);
      }
    }
    if (newGalleryFiles.length > 0) {
      galleryImages = JSON.stringify(newGalleryFiles);
    }

    const updated = await prisma.achievement.update({
      where: { id: idNum },
      data: {
        title: title || existing.title,
        slug,
        description: description || existing.description,
        tags,
        coverImage,
        galleryImages,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/achievements/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.achievement.delete({ where: { id: idNum } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/achievements/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
