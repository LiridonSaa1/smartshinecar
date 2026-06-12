import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import bcrypt from "bcryptjs";
import { servicesTable } from "./schema/services";
import { bookingsTable } from "./schema/bookings";
import { reviewsTable } from "./schema/reviews";
import { settingsTable } from "./schema/settings";
import { usersTable } from "./schema/users";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── SERVICES ────────────────────────────────────────────────────────────────
const existingServices = await db.select().from(servicesTable).limit(1);
if (existingServices.length === 0) {
  await db.insert(servicesTable).values([
    { name: "Mini Valet", description: "A quick clean inside and out. Exterior wash, interior vacuum and wipe down.", price: "45.00", duration: 60, isActive: true },
    { name: "Full Valet", description: "A thorough clean covering every inch of your vehicle inside and out.", price: "120.00", duration: 180, isActive: true },
    { name: "Machine Polish", description: "Removes light scratches and swirl marks, restoring paintwork to a high shine.", price: "200.00", duration: 240, isActive: true },
    { name: "Full Detail", description: "Our premium service — full decontamination, machine polish, ceramic coating prep.", price: "350.00", duration: 480, isActive: true },
    { name: "Commercial Vehicle Valet", description: "Full interior and exterior valet for vans, minibuses and commercial vehicles.", price: "180.00", duration: 240, isActive: true },
    { name: "Exterior Wash & Wax", description: "Hand wash, clay bar treatment and hand wax for a showroom finish.", price: "75.00", duration: 90, isActive: true },
  ]);
  console.log("✅ Seeded 6 services");
} else {
  console.log("⏭  Services already exist, skipping");
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
const existingBookings = await db.select().from(bookingsTable).limit(1);
if (existingBookings.length === 0) {
  await db.insert(bookingsTable).values([
    { customerName: "James Harrington", customerPhone: "07700 900123", customerEmail: "james.h@gmail.com", serviceId: 2, serviceName: "Full Valet", servicePrice: "120.00", date: "2026-06-12", time: "09:00", status: "confirmed", notes: "BMW 3 Series — silver" },
    { customerName: "Sophie Clarke", customerPhone: "07700 900456", customerEmail: "sophie.c@hotmail.com", serviceId: 1, serviceName: "Mini Valet", servicePrice: "45.00", date: "2026-06-12", time: "11:00", status: "pending", notes: "" },
    { customerName: "David Okafor", customerPhone: "07700 900789", customerEmail: "d.okafor@outlook.com", serviceId: 4, serviceName: "Full Detail", servicePrice: "350.00", date: "2026-06-13", time: "08:30", status: "confirmed", notes: "Audi Q5 — black, needs clay bar" },
    { customerName: "Emma Watson", customerPhone: "07700 900321", customerEmail: "emmaw@gmail.com", serviceId: 6, serviceName: "Exterior Wash & Wax", servicePrice: "75.00", date: "2026-06-13", time: "13:00", status: "pending", notes: "Toyota Yaris — white" },
    { customerName: "Robert Singh", customerPhone: "07700 900654", customerEmail: "rsingh@yahoo.co.uk", serviceId: 3, serviceName: "Machine Polish", servicePrice: "200.00", date: "2026-06-14", time: "10:00", status: "confirmed", notes: "Mercedes C-Class — deep blue" },
    { customerName: "Lucy Fernandez", customerPhone: "07700 900987", customerEmail: "lucy.f@gmail.com", serviceId: 5, serviceName: "Commercial Vehicle Valet", servicePrice: "180.00", date: "2026-06-14", time: "08:00", status: "pending", notes: "Ford Transit — white, high roof" },
    { customerName: "Tom Bradley", customerPhone: "07700 900111", customerEmail: "tombrad@gmail.com", serviceId: 1, serviceName: "Mini Valet", servicePrice: "45.00", date: "2026-06-10", time: "14:00", status: "completed", notes: "VW Golf — grey" },
    { customerName: "Priya Patel", customerPhone: "07700 900222", customerEmail: "priya.p@gmail.com", serviceId: 2, serviceName: "Full Valet", servicePrice: "120.00", date: "2026-06-09", time: "09:30", status: "completed", notes: "Honda Jazz — red" },
    { customerName: "Mark Thompson", customerPhone: "07700 900333", customerEmail: "mark.t@outlook.com", serviceId: 4, serviceName: "Full Detail", servicePrice: "350.00", date: "2026-06-08", time: "08:00", status: "completed", notes: "Porsche Cayenne — white" },
    { customerName: "Natalie Brooks", customerPhone: "07700 900444", customerEmail: "nbrooks@gmail.com", serviceId: 6, serviceName: "Exterior Wash & Wax", servicePrice: "75.00", date: "2026-06-07", time: "11:30", status: "cancelled", notes: "" },
  ]);
  console.log("✅ Seeded 10 bookings");
} else {
  console.log("⏭  Bookings already exist, skipping");
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
const existingReviews = await db.select().from(reviewsTable).limit(1);
if (existingReviews.length === 0) {
  await db.insert(reviewsTable).values([
    { customerName: "James Harrington", rating: 5, comment: "Absolutely brilliant service. My BMW came back looking better than when I bought it. Will definitely be back!", serviceName: "Full Valet" },
    { customerName: "Sophie Clarke", rating: 5, comment: "Quick, professional and great value. The interior was spotless. Highly recommend for anyone in Guildford.", serviceName: "Mini Valet" },
    { customerName: "David Okafor", rating: 5, comment: "The full detail on my Q5 was outstanding. Deep scratches I thought were permanent are completely gone. Worth every penny.", serviceName: "Full Detail" },
    { customerName: "Mark Thompson", rating: 5, comment: "Smart Shine have been looking after my cars for 5 years. Consistently excellent work, friendly staff and fair prices.", serviceName: "Full Detail" },
    { customerName: "Priya Patel", rating: 4, comment: "Really pleased with the results. The car was ready on time and the team were very professional throughout.", serviceName: "Full Valet" },
    { customerName: "Robert Singh", rating: 5, comment: "The machine polish on my Mercedes is incredible. Paint looks like new. These guys really know their stuff.", serviceName: "Machine Polish" },
    { customerName: "Emma Watson", rating: 4, comment: "Great exterior wash and wax — my Yaris is gleaming. Easy to book and very accommodating with timing.", serviceName: "Exterior Wash & Wax" },
    { customerName: "Tom Bradley", rating: 5, comment: "Used Smart Shine for my Golf and the results were amazing. Best car valet I've ever had. Highly recommended!", serviceName: "Mini Valet" },
  ]);
  console.log("✅ Seeded 8 reviews");
} else {
  console.log("⏭  Reviews already exist, skipping");
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
const existingSettings = await db.select().from(settingsTable).limit(1);
if (existingSettings.length === 0) {
  await db.insert(settingsTable).values({
    businessName: "Smart Shine Car Valeting Centre",
    address: "Guildford, Surrey, GU1 1AA",
    phone: "+44 7717 310046",
    email: "info@smartshine.co.uk",
    openTime: "08:00",
    closeTime: "19:00",
    slotDuration: 60,
    workingDays: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
  });
  console.log("✅ Seeded settings");
} else {
  console.log("⏭  Settings already exist, skipping");
}

// ─── ADMIN USER ───────────────────────────────────────────────────────────────
const existingAdmin = await db.select().from(usersTable).limit(1);
if (existingAdmin.length === 0) {
  const passwordHash = await bcrypt.hash("SmartShine2026!", 12);
  await db.insert(usersTable).values({
    name: "Admin",
    email: "admin@smartshine.co.uk",
    passwordHash,
    role: "admin",
  });
  console.log("✅ Seeded admin user");
} else {
  console.log("⏭  Admin user already exists, skipping");
}

await pool.end();
console.log("\n🎉 Seed complete!");
