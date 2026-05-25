import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const passwordHash = await bcrypt.hash("shio2024admin", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@shio.be" },
    update: { passwordHash },
    create: {
      email: "admin@shio.be",
      passwordHash,
    },
  });
  console.log("Admin user created: admin@shio.be / shio2024admin");

  // Create achievements
  const achievements = [
    {
      title: "A School for the Next Generation",
      slug: "a-school-for-the-next-generation",
      description:
        "Building a school in Sudan to improve the learning environment for children. This project provides hundreds of students with a proper educational facility, complete with classrooms, sanitation, and educational materials.",
      tags: JSON.stringify(["Education", "Children", "Sudan"]),
      coverImage: "/images/galary-school.png",
      galleryImages: JSON.stringify(["/images/galary-school.png"]),
    },
    {
      title: "Iftar — Al Qadarif",
      slug: "iftar-al-qadarif",
      description:
        "Organized an Iftar event in Al Qadarif during Ramadan to strengthen community bonds. We brought together hundreds of community members for a shared meal, fostering unity and support during the holy month.",
      tags: JSON.stringify(["Community", "Ramadan", "Sudan"]),
      coverImage: "/images/iftar-gadarif.png",
      galleryImages: JSON.stringify(["/images/iftar-gadarif.png", "/images/iftar-th.jpeg"]),
    },
    {
      title: "Supporting Orphans",
      slug: "supporting-orphans",
      description:
        "Provided clothing and basic necessities to orphaned children in Sudan. This initiative ensures that vulnerable children have access to essential items they need for their daily lives and development.",
      tags: JSON.stringify(["Community", "Children", "Sudan"]),
      coverImage: "/images/orphans-support.png",
      galleryImages: JSON.stringify(["/images/orphans-support.png"]),
    },
    {
      title: "Back to School",
      slug: "back-to-school",
      description:
        "Supplied school materials to orphans at the start of the school year. We distributed backpacks, notebooks, pens, and other essential school supplies to ensure every child can participate fully in their education.",
      tags: JSON.stringify(["Education", "Children", "Sudan"]),
      coverImage: "/images/school-pags-for-kids.png",
      galleryImages: JSON.stringify(["/images/school-pags-for-kids.png"]),
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
    console.log(`Achievement created: ${achievement.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
