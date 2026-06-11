import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { servicesTable } from "./schema/services";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const existing = await db.select().from(servicesTable).limit(1);
if (existing.length === 0) {
  await db.insert(servicesTable).values([
    { name: "Mini Valet", description: "A quick clean inside and out. Exterior wash, interior vacuum and wipe down.", price: "45.00", duration: 60, isActive: true },
    { name: "Full Valet", description: "A thorough clean covering every inch of your vehicle inside and out.", price: "120.00", duration: 180, isActive: true },
    { name: "Machine Polish", description: "Removes light scratches and swirl marks, restoring paintwork to a high shine.", price: "200.00", duration: 240, isActive: true },
    { name: "Full Detail", description: "Our premium service — full decontamination, machine polish, ceramic coating prep.", price: "350.00", duration: 480, isActive: true },
    { name: "Commercial Vehicle Valet", description: "Full interior and exterior valet for vans, minibuses and commercial vehicles.", price: "180.00", duration: 240, isActive: true },
    { name: "Exterior Wash & Wax", description: "Hand wash, clay bar treatment and hand wax for a showroom finish.", price: "75.00", duration: 90, isActive: true },
  ]);
  console.log("Seeded 6 services successfully");
} else {
  console.log("Services already exist, skipping seed");
}
await pool.end();
