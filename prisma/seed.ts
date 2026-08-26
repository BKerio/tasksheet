import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set to run the seed.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding AttachTrack database...");

  await prisma.taskReport.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      id: "user-admin-1",
      name: "System Administrator",
      email: "admin@university.ac.ke",
      password: "admin123",
      role: "ADMIN",
      department: "Attachment Coordination Office",
      title: "System Administrator",
    },
  });

  const drSarah = await prisma.user.create({
    data: {
      id: "user-sup-1",
      name: "Dr. Sarah Wambui",
      email: "sarah.wambui@university.ac.ke",lll
      password: "adminpassword",
      role: "SUPERVISOR",
      department: "Information Technology",
      title: "Senior Industrial Supervisor",
    },
  });

  const profKamau = await prisma.user.create({
    data: {
      id: "user-sup-2",
      name: "Prof. David Kamau",
      email: "david.kamau@university.ac.ke",
      password: "adminpassword",
      role: "ADMIN",
      department: "Computer Science",
      title: "Head of Attachment Coordination",
    },
  });

  const ian = await prisma.user.create({
    data: {
      id: "user-std-1",
      registrationNo: "24-3769",
      name: "Ian Kipkorir Metto",
      email: "ian.metto@student.university.ac.ke",
      password: "password123",
      role: "STUDENT",
      course: "DICT 240 – Software Project Proposal",
      department: "Department of Information Technology",
      organization: "FinTech Innovations Lab",
      supervisorName: "Dr. Sarah Wambui",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
    },
  });

  const faith = await prisma.user.create({
    data: {
      id: "user-std-2",
      registrationNo: "24-3810",
      name: "Faith Chebet",
      email: "faith.chebet@student.university.ac.ke",
      password: "password123",
      role: "STUDENT",
      course: "DICT 240 – Software Project Proposal",
      department: "Department of Computer Science",
      organization: "Nairobi Data Systems",
      supervisorName: "Dr. Sarah Wambui",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
    },
  });

  await prisma.user.create({
    data: {
      id: "user-std-3",
      registrationNo: "24-3945",
      name: "Kevin Ochieng",
      email: "kevin.ochieng@student.university.ac.ke",
      password: "password123",
      role: "STUDENT",
      course: "DICT 240 – Software Project Proposal",
      department: "Department of Information Technology",
      organization: "CloudNet Solutions",
      supervisorName: "Prof. David Kamau",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
    },
  });

  await prisma.attendance.createMany({
    data: [
      {
        studentId: ian.id,
        date: "2026-07-28",
        status: "Present",
        checkInTime: "08:15 AM",
        checkOutTime: "05:00 PM",
        workMode: "On-site",
        location: "Head Office - Room 3B",
        notes: "Signed physical register and completed morning standup.",
        verifiedBySupervisor: true,
      },
      {
        studentId: ian.id,
        date: "2026-07-27",
        status: "Present",
        checkInTime: "08:30 AM",
        checkOutTime: "05:15 PM",
        workMode: "On-site",
        location: "Head Office - Room 3B",
        notes: "Sprint planning and maintenance.",
        verifiedBySupervisor: true,
      },
      {
        studentId: faith.id,
        date: "2026-07-28",
        status: "Present",
        checkInTime: "08:20 AM",
        checkOutTime: "05:05 PM",
        workMode: "On-site",
        verifiedBySupervisor: true,
      },
    ],
  });

  await prisma.taskReport.createMany({
    data: [
      {
        studentId: ian.id,
        supervisorId: drSarah.id,
        supervisorName: drSarah.name,
        date: "2026-07-28",
        title: "Constructed Prisma ORM Data Schema & Student CRUD Management",
        description:
          "Implemented relational database schemas for Users, Attendance, and Task_Reports in PostgreSQL via Prisma 7. Added Student CRUD control hub.",
        category: "Software Development",
        hoursSpent: 7.5,
        learnings:
          "Mastered relational model mappings, foreign key cascading deletes, and Prisma seeding.",
        challenges:
          "Configuring database seed scripts with Prisma Client 7.9 configuration.",
        status: "Approved",
        feedback:
          "Excellent work, Ian! The Student CRUD management tool is intuitive and well structured.",
        rating: 96,
        reviewedAt: "2026-07-28 09:30",
      },
      {
        studentId: ian.id,
        supervisorId: drSarah.id,
        supervisorName: drSarah.name,
        date: "2026-07-27",
        title: "REST API Authentication & User Role Middleware Implementation",
        description:
          "Integrated JWT token-based auth middleware to separate Student user routes from Supervisor Admin endpoints.",
        category: "Software Development",
        hoursSpent: 8.0,
        learnings:
          "Understood bearer token validation and security practices for Web applications.",
        status: "Approved",
        feedback: "Good end-to-end endpoint security separation.",
        rating: 92,
        reviewedAt: "2026-07-27 17:30",
      },
      {
        studentId: faith.id,
        date: "2026-07-28",
        title: "Server Infrastructure Monitoring and Log Analytics",
        description:
          "Configured automated monitoring scripts to aggregate server logs and detect network bottlenecks.",
        category: "IT Support & Networking",
        hoursSpent: 7.0,
        learnings: "Mastered syslog parsing and Grafana dashboard visualization.",
        status: "Pending",
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin login:");
  console.log(`  email:    ${admin.email}`);
  console.log("  password: admin123");
  console.log("Supervisor login:");
  console.log(`  email:    ${drSarah.email}`);
  console.log("  password: adminpassword");
  console.log(`Also seeded ADMIN: ${profKamau.email}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
