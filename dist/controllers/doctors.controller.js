export class DoctorsController {
    async getDashboard(request, reply) {
        const user = request.user;
        return reply.send({
            message: "Bem-vindo ao dashboard médico!",
            user: {
                id: user.id,
                name: user.name,
                type: user.type,
            },
        });
    }
}
