const { PrismaClient } = await import('@prisma/client');

import { withAccelerate } from '@prisma/extension-accelerate';

const db = new PrismaClient().$extends(withAccelerate());
export default db;
