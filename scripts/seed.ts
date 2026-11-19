import { auth } from "@/lib/auth";
import { db, client } from "@/lib/mongodb";

const people = [
  { name: "FixMate Admin", email: "admin@fixmate.com", password: "Admin123", role: "admin" },
  {
    name: "Rahim Uddin", email: "rahim@fixmate.com", password: "Tech1234", role: "technician",
    area: "Barishal Sadar", image: "https://i.pravatar.cc/150?img=12",
    bio: "8 years of experience in mobile, laptop and TV repair.",
  },
  {
    name: "Karim Hossain", email: "karim@fixmate.com", password: "Tech1234", role: "technician",
    area: "Dhanmondi, Dhaka", image: "https://i.pravatar.cc/150?img=33",
    bio: "Home appliance specialist for AC, refrigerator, washing machine and wiring.",
  },
  { name: "Nusrat Jahan", email: "customer@fixmate.com", password: "Customer123", role: "customer", area: "Barishal" },
];

type Row = [string, string, number, string, "Home Visit" | "Shop Drop-off", number, ("approved" | "pending")?];
// [title, category, price, duration, mode, techIndex(1|2 = people index), approval]
const rows: Row[] = [
  ["iPhone Screen Replacement", "Smartphone", 45, "2-3 hours", "Shop Drop-off", 1],
  ["Android Battery Replacement", "Smartphone", 20, "1 hour", "Shop Drop-off", 1],
  ["Laptop Full Servicing", "Laptop & PC", 25, "1 day", "Shop Drop-off", 1],
  ["Laptop Screen and Keyboard Fix", "Laptop & PC", 55, "1-2 days", "Shop Drop-off", 1],
  ["AC Gas Refill", "AC", 30, "2 hours", "Home Visit", 2],
  ["AC Deep Cleaning", "AC", 22, "2-3 hours", "Home Visit", 2],
  ["Refrigerator Compressor Repair", "Refrigerator", 60, "1 day", "Home Visit", 2],
  ["Fridge Cooling Problem Fix", "Refrigerator", 28, "3 hours", "Home Visit", 2],
  ["LED TV Panel Repair", "TV", 70, "2 days", "Shop Drop-off", 1],
  ["Smart TV Software Fix", "TV", 18, "1 hour", "Home Visit", 1],
  ["Washing Machine Motor Repair", "Washing Machine", 40, "1 day", "Home Visit", 2],
  ["House Electrical Wiring Check", "Electrical", 35, "3-4 hours", "Home Visit", 2],
  // admin approval test korar jonno ekta pending
  ["Geyser Repair and Check", "Electrical", 26, "2 hours", "Home Visit", 2, "pending"],
];

async function main() {
  const users = db.collection("user");

  for (const p of people) {
    if (!(await users.findOne({ email: p.email }))) {
      await auth.api.signUpEmail({
        body: { name: p.name, email: p.email, password: p.password, role: p.role },
      });
    }
    await users.updateOne(
      { email: p.email },
      { $set: { role: p.role, ...(p.area && { area: p.area }), ...(p.bio && { bio: p.bio }), ...(p.image && { image: p.image }) } }
    );
  }

  const services = db.collection("services");
  const day = 86400000;

  for (let i = 0; i < rows.length; i++) {
    const [title, category, basePrice, estimatedDuration, serviceMode, t, approval = "approved"] = rows[i];
    const tech = people[t];

    await services.updateOne(
      { title, technicianEmail: tech.email },
      {
        $set: {
          title, category, basePrice, estimatedDuration, serviceMode,
          description: `${title} by an experienced technician. Includes diagnosis, testing after repair, and a clear explanation of the work done. Final amount is confirmed after the job is completed.`,
          image: `https://picsum.photos/seed/fixmate-${i + 1}/800/500`,
          serviceArea: tech.area,
          technicianName: tech.name,
          technicianEmail: tech.email,
          approvalStatus: approval,
          isAvailable: true,
        },
        $setOnInsert: { createdAt: new Date(Date.now() - (rows.length - i) * day) },
      },
      { upsert: true }
    );
  }

  console.log("Seed done: 1 admin, 2 technicians, 1 customer, 12 approved + 1 pending service");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});