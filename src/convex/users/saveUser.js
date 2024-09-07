import { mutation } from "../_generated/server";

export default mutation(async ({ db }, user) => {
  const existingUser = await db.table('users').filter({ sub: user.sub }).first();
  if (!existingUser) {
    await db.table('users').insert(user);
  }
});