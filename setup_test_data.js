import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Test Data Setup ---');

  // 1. Get Users
  const admin = await prisma.user.findUnique({ where: { email: 'admin@smarttrack.com' } });
  const staff = await prisma.user.findUnique({ where: { email: 'staff@smarttrack.com' } });
  const student = await prisma.user.findUnique({ where: { email: 'student@smarttrack.com' } });

  if (!staff || !student) {
    throw new Error('Staff or Student user not found. Please run seed first.');
  }

  // 2. Set Student Location (needed for location-based attendance)
  // Let's set it to Bangalore coordinates
  const studentLat = 12.9716;
  const studentLng = 77.5946;
  await prisma.user.update({
    where: { id: student.id },
    data: {
      latitude: studentLat,
      longitude: studentLng,
      radius: 1000 // 1km radius
    }
  });
  console.log('Updated student location to Bangalore (12.9716, 77.5946)');

  // 3. Create Classes
  const classesData = [
    { name: 'Computer Science 101', code: 'CS101', subject: 'Computer Science', room: 'Room 301', staffId: staff.id },
    { name: 'Mathematics 201', code: 'MA201', subject: 'Mathematics', room: 'Hall A', staffId: staff.id },
    { name: 'Physics 102', code: 'PH102', subject: 'Physics', room: 'Lab 2', staffId: staff.id }
  ];

  const createdClasses = [];
  for (const data of classesData) {
    const cls = await prisma.class.upsert({
      where: { code: data.code },
      update: {
        students: { connect: [{ id: student.id }] }
      },
      create: {
        ...data,
        students: { connect: [{ id: student.id }] }
      }
    });
    createdClasses.push(cls);
    console.log(`Class created/updated: ${cls.name} (${cls.code})`);
  }

  // 4. Create an Active Session for CS101
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour from now

  const session = await prisma.session.create({
    data: {
      classId: createdClasses[0].id,
      startTime,
      endTime,
      status: 'ACTIVE'
    }
  });
  console.log(`Active session created for ${createdClasses[0].name}, ID: ${session.id}`);

  // 5. Mark Attendance via Location (simulating GPS)
  // We use the same coordinates as the student's assigned location
  const attendance = await prisma.attendance.create({
    data: {
      userId: student.id,
      sessionId: session.id,
      status: 'PRESENT',
      method: 'GPS',
      latitude: studentLat,
      longitude: studentLng,
      deviceInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      ipAddress: '127.0.0.1'
    }
  });
  console.log(`Attendance marked for ${student.name} in ${createdClasses[0].name} via GPS`);

  console.log('--- Test Data Setup Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
