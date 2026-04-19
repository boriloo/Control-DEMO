import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

console.log("PRISMA - DATABASE_URL:", connectionString ? "OK ✅" : "UNDEFINED ❌");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default { prisma };