import { PrismaClient, Role, ResourceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("password123", 10);

  const [admin, recep, emp] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@vms.local" },
      update: {},
      create: { name: "System Admin", email: "admin@vms.local", password: pass, role: Role.ADMIN, department: "IT" },
    }),
    prisma.user.upsert({
      where: { email: "reception@vms.local" },
      update: {},
      create: { name: "Front Desk", email: "reception@vms.local", password: pass, role: Role.RECEPTIONIST, department: "Operations" },
    }),
    prisma.user.upsert({
      where: { email: "john@vms.local" },
      update: {},
      create: { name: "John Doe", email: "john@vms.local", password: pass, role: Role.EMPLOYEE, department: "Engineering" },
    }),
  ]);

  const resources = [
    { name: "Boardroom A", type: ResourceType.BOARDROOM, capacity: 20, location: "Floor 3" },
    { name: "Boardroom B", type: ResourceType.BOARDROOM, capacity: 10, location: "Floor 2" },
    { name: "Meeting Room 1", type: ResourceType.MEETING_ROOM, capacity: 8, location: "Floor 1" },
    { name: "Projector #1", type: ResourceType.PROJECTOR, capacity: 1 },
    { name: "HDMI Kit", type: ResourceType.HDMI, capacity: 1 },
    { name: "Smart TV", type: ResourceType.SMART_TV, capacity: 1, location: "Boardroom A" },
    { name: "Whiteboard", type: ResourceType.WHITEBOARD, capacity: 1 },
  ];
  for (const r of resources) {
  const existing = await prisma.resource.findFirst({
    where: { name: r.name }
  });

  if (!existing) {
    await prisma.resource.create({
      data: r
    });
  }
}
    ;
  

  console.log("Seeded:", { admin: admin.email, recep: recep.email, emp: emp.email });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());