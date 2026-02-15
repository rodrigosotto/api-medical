import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { AuthService } from "../services/auth.service.js";
import { UsersService } from "../services/users.service.js";
import { DoctorsService } from "../services/doctors.service.js";
import { PatientsService } from "../services/patients.service.js";
import type {
  DoctorRegistrationData,
  PatientRegistrationData,
} from "../types/registration.types.js";

export class AuthController {
  private authService: AuthService;
  private usersService: UsersService;
  private doctorsService: DoctorsService;
  private patientsService: PatientsService;

  constructor(fastify: FastifyInstance) {
    this.authService = new AuthService(fastify.prisma);
    this.usersService = new UsersService(fastify.prisma);
    this.doctorsService = new DoctorsService(fastify.prisma);
    this.patientsService = new PatientsService(fastify.prisma);
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, userType } = request.body as {
      name: string;
      email: string;
      password: string;
      userType?: string;
    };

    try {
      const existingUser = await this.usersService.findByEmail(email);

      if (existingUser) {
        return reply.status(409).send({ error: "Email já cadastrado" });
      }

      const user = await this.usersService.create({
        name,
        email,
        password,
        type: userType || "patient",
      });

      const token = request.server.jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      });

      return reply.status(201).send({ token });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao criar usuário" });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      // Log de tentativa de login falha
      request.log.warn({
        message: "Tentativa de login falhou",
        email,
        ip: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return reply.status(401).send({
        error: "Credenciais inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = request.server.jwt.sign(user);
    // Gerar refresh token com expiração maior
    const refreshToken = request.server.jwt.sign(user, { expiresIn: "7d" });

    // Log de login bem-sucedido
    request.log.info({
      message: "Login realizado com sucesso",
      userId: user.id,
      email: user.email,
      ip: request.ip,
    });

    return reply.send({
      user,
      token,
      refreshToken,
    });
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const userId = user.id;

    const profile = await this.usersService.findById(userId);

    if (!profile) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    return reply.send(profile);
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const userId = user.id;
    const { name, type } = request.body as { name?: string; type?: string };

    const updatedUser = await this.usersService.update(userId, { name, type });

    return reply.send(updatedUser);
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, type } = request.body as {
      name: string;
      email: string;
      password: string;
      type: string;
    };

    // Verificar se o email já existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return reply.status(409).send({ error: "Email já cadastrado" });
    }

    // Criar novo usuário
    const newUser = await this.usersService.create({
      name,
      email,
      password,
      type,
    });

    const token = request.server.jwt.sign({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      type: newUser.type,
    });

    const refreshToken = request.server.jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
      },
      { expiresIn: "7d" },
    );

    return reply.status(201).send({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
        createdAt: newUser.createdAt,
      },
      token,
      refreshToken,
    });
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as { refreshToken: string };

    try {
      const decoded = request.server.jwt.verify(refreshToken) as any;

      const user = await this.usersService.findById(decoded.id);
      if (!user) {
        return reply.status(401).send({ error: "Usuário não encontrado" });
      }

      const newToken = request.server.jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      });

      const newRefreshToken = request.server.jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
        { expiresIn: "7d" },
      );

      return reply.send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          createdAt: user.createdAt,
        },
        token: newToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return reply.status(401).send({ error: "Token inválido ou expirado" });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    // Para logout, podemos simplesmente retornar sucesso
    // O cliente irá remover o token do localStorage
    return reply.send({ message: "Logout realizado com sucesso" });
  }

  async registerDoctor(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as DoctorRegistrationData;

    try {
      // Verificar se o email já existe
      const existingUser = await this.usersService.findByEmail(data.email);
      if (existingUser) {
        return reply.status(409).send({ error: "Email já cadastrado" });
      }

      // Verificar se CPF já existe
      const existingCpf = await this.doctorsService.findByCpf(data.cpf);
      if (existingCpf) {
        return reply.status(409).send({ error: "CPF já cadastrado" });
      }

      // Verificar se CRM já existe
      const existingCrm = await this.doctorsService.findByCrm(data.crm);
      if (existingCrm) {
        return reply.status(409).send({ error: "CRM já cadastrado" });
      }

      // Criar usuário
      const newUser = await this.usersService.create({
        name: data.fullName,
        email: data.email,
        password: data.password,
        type: "medico",
      });

      // Criar registro de médico
      const doctor = await this.doctorsService.create({
        userId: newUser.id,
        fullName: data.fullName,
        cpf: data.cpf,
        crm: data.crm,
        specialty: data.specialty,
        phone: data.phone,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      });

      request.log.info({
        message: "Médico registrado com sucesso - aguardando aprovação",
        userId: newUser.id,
        doctorId: doctor.id,
        email: newUser.email,
      });

      return reply.status(201).send({
        message:
          "Cadastro realizado com sucesso! Seu cadastro está em análise e você será notificado em breve.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
        },
        doctor: {
          id: doctor.id,
          status: doctor.status,
        },
      });
    } catch (error) {
      request.log.error({
        message: "Erro ao registrar médico",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return reply.status(500).send({ error: "Erro ao processar cadastro" });
    }
  }

  async registerPatient(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as PatientRegistrationData;

    try {
      // Verificar se o email já existe
      const existingUser = await this.usersService.findByEmail(data.email);
      if (existingUser) {
        return reply.status(409).send({ error: "Email já cadastrado" });
      }

      // Criar usuário
      const newUser = await this.usersService.create({
        name: data.fullName,
        email: data.email,
        password: data.password,
        type: "paciente",
      });

      // Criar registro de paciente
      const patient = await this.patientsService.create({
        userId: newUser.id,
        fullName: data.fullName,
        phone: data.phone,
        photo: data.photo,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        hasInsurance: data.hasInsurance,
        insuranceName: data.insuranceName,
      });

      const token = request.server.jwt.sign({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
      });

      const refreshToken = request.server.jwt.sign(
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
        },
        { expiresIn: "7d" },
      );

      request.log.info({
        message: "Paciente registrado com sucesso",
        userId: newUser.id,
        patientId: patient.id,
        email: newUser.email,
      });

      return reply.status(201).send({
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
          createdAt: newUser.createdAt,
        },
        patient: {
          id: patient.id,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      request.log.error({
        message: "Erro ao registrar paciente",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return reply.status(500).send({ error: "Erro ao processar cadastro" });
    }
  }
}
