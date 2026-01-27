import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Criar usuário médico
    const medicoPassword = await bcrypt.hash("senha123", 8);
    const medico = await prisma.user.upsert({
      where: { email: "medico@medical.com" },
      update: {},
      create: {
        name: "Dr. João Silva",
        email: "medico@medical.com",
        password: medicoPassword,
        type: "medico",
      },
    });
    console.log("✅ Médico criado:", medico.email);

    // Criar usuário paciente
    const pacientePassword = await bcrypt.hash("senha123", 8);
    const paciente = await prisma.user.upsert({
      where: { email: "paciente@medical.com" },
      update: {},
      create: {
        name: "Maria Santos",
        email: "paciente@medical.com",
        password: pacientePassword,
        type: "paciente",
      },
    });
    console.log("✅ Paciente criado:", paciente.email);

    console.log("\n🎉 Seed concluído com sucesso!");
    console.log("\n📝 Credenciais de teste:");
    console.log("Médico:");
    console.log("  Email: medico@medical.com");
    console.log("  Senha: senha123");
    console.log("\nPaciente:");
    console.log("  Email: paciente@medical.com");
    console.log("  Senha: senha123");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
