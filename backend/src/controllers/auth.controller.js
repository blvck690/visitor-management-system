import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/db.js";
import { signToken } from "../utils/jwt.js";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
  });
};

export const me = async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role, department: u.department });
};

export const logout = async (_req, res) => res.json({ ok: true });