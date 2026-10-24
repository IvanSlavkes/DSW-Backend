import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Uso: npm run create:admin -- <email> <password>');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('La contraseña debe tener al menos 6 caracteres');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({ where: { email }, data: { role: 'admin' } });
    console.log(
      `${email} ahora es admin (ya existía; su contraseña no se tocó).`,
    );
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        lastName: 'Sistema',
        email,
        password: hashed,
        position: 'Admin',
        birthDate: new Date('2000-01-01'),
        role: 'admin',
      },
    });
    console.log(`Admin creado: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  
  .finally(() => prisma.$disconnect());
