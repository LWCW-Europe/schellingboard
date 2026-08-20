import { resetDatabase } from "@/scripts/seed/seed-database";

async function globalSetup() {
  console.log("🚀 Setting up test environment...");

  // Reset and seed the database with test data. Always the small profile:
  // the suite pins on the curated fixtures and must never see bulk data.
  await resetDatabase("small");

  console.log("✅ Test environment ready!");
}

export default globalSetup;
