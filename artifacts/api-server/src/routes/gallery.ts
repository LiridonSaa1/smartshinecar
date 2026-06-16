import { Router } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { adminAuth } from "../lib/adminAuth";

const router = Router();
const GALLERY_KEY = "gallery_cars";

const DEFAULT_CARS = [
  { id: "1", make: "BMW", model: "Z4 Roadster", year: 2006, image: "/gallery/bmw-z4.jpg", service: "Full Exterior Detail" },
  { id: "2", make: "Volvo", model: "XC60", year: 2012, image: "/gallery/volvo-xc60.jpg", service: "Full Valet" },
  { id: "3", make: "Ford", model: "Mondeo Estate", year: 2015, image: "/gallery/ford-mondeo.jpg", service: "Exterior Wash & Polish" },
  { id: "4", make: "Volkswagen", model: "Golf GTI Mk8", year: 2021, image: "/gallery/vw-golf-gti-mk8.jpg", service: "Paint Correction" },
  { id: "5", make: "Land Rover", model: "Defender 110", year: 2005, image: "/gallery/landrover-defender.jpg", service: "Full Valet" },
  { id: "6", make: "Vauxhall", model: "Nova Spin", year: 1992, image: "/gallery/vauxhall-nova.jpg", service: "Full Detail & Polish" },
  { id: "7", make: "Mercedes", model: "A-Class", year: 2016, image: "/gallery/mercedes-a-class.jpg", service: "Executive Valet" },
  { id: "8", make: "Kia", model: "Sportage", year: 2014, image: "/gallery/kia-sportage.jpg", service: "Full Valet" },
  { id: "9", make: "Toyota", model: "Hilux", year: 2002, image: "/gallery/toyota-hilux.jpg", service: "Exterior Wash" },
  { id: "10", make: "Citroën", model: "Berlingo", year: 2013, image: "/gallery/citroen-berlingo.jpg", service: "Commercial Valet" },
  { id: "11", make: "Volkswagen", model: "Polo", year: 2014, image: "/gallery/vw-polo.jpg", service: "Mini Valet" },
  { id: "12", make: "Jaguar", model: "XK8 Coupe", year: 2002, image: "/gallery/jaguar-xk8.jpg", service: "Paint Correction & Polish" },
  { id: "13", make: "Volkswagen", model: "Golf GTI Mk5", year: 2007, image: "/gallery/vw-golf-mk5.jpg", service: "Machine Polish" },
  { id: "14", make: "Jaguar", model: "XJ", year: 1997, image: "/gallery/jaguar-xj.jpg", service: "Classic Car Detail" },
  { id: "15", make: "Audi", model: "A3 Sportback", year: 2016, image: "/gallery/audi-a3.jpg", service: "Full Exterior Detail" },
  { id: "16", make: "Porsche", model: "911 Carrera (992)", year: 2020, image: "/gallery/porsche-911.jpg", service: "Ceramic Coating" },
  { id: "17", make: "Suzuki", model: "Grand Vitara", year: 2009, image: "/gallery/suzuki-grand-vitara.jpg", service: "Full Valet" },
  { id: "18", make: "Ford", model: "Kuga", year: 2017, image: "/gallery/ford-kuga.jpg", service: "Full Interior & Exterior" },
  { id: "19", make: "BMW", model: "3 Series Touring (E91)", year: 2010, image: "/gallery/bmw-3-series.jpg", service: "Paint Correction" },
  { id: "20", make: "Audi", model: "Q5", year: 2018, image: "/gallery/audi-q5.jpg", service: "Executive Valet" },
];

async function getGalleryCars() {
  const rows = await db.select({ data: siteContentTable.data }).from(siteContentTable).where(eq(siteContentTable.key, GALLERY_KEY)).limit(1);
  return (rows[0]?.data as typeof DEFAULT_CARS) ?? DEFAULT_CARS;
}

async function saveGalleryCars(cars: typeof DEFAULT_CARS) {
  const existing = await db.select({ id: siteContentTable.id }).from(siteContentTable).where(eq(siteContentTable.key, GALLERY_KEY)).limit(1);
  if (existing.length > 0) {
    await db.update(siteContentTable).set({ data: cars, updatedAt: new Date() }).where(eq(siteContentTable.key, GALLERY_KEY));
  } else {
    await db.insert(siteContentTable).values({ key: GALLERY_KEY, data: cars });
  }
}

router.get("/gallery", async (_req, res) => {
  try {
    const cars = await getGalleryCars();
    return res.json(cars);
  } catch (err) {
    logger.error({ err }, "Get gallery error");
    return res.json(DEFAULT_CARS);
  }
});

router.put("/gallery", adminAuth, async (req, res) => {
  try {
    const cars = req.body;
    await saveGalleryCars(cars);
    return res.json(cars);
  } catch (err) {
    logger.error({ err }, "Update gallery error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery", adminAuth, async (req, res) => {
  try {
    const cars = await getGalleryCars();
    const newCar = { ...req.body, id: Date.now().toString() };
    const updated = [...cars, newCar];
    await saveGalleryCars(updated as typeof DEFAULT_CARS);
    return res.json(newCar);
  } catch (err) {
    logger.error({ err }, "Add gallery car error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/:id", adminAuth, async (req, res) => {
  try {
    const cars = await getGalleryCars();
    const updated = cars.filter((c) => c.id !== req.params.id);
    await saveGalleryCars(updated);
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Delete gallery car error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
