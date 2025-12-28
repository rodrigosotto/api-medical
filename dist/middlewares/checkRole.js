export function checkRole(allowedRoles) {
    return async (request, reply) => {
        const user = request.user;
        if (!user || !allowedRoles.includes(user.type)) {
            return reply.status(403).send({
                error: `Acesso negado. Apenas ${allowedRoles.join(" ou ")} podem acessar esta rota.`,
            });
        }
    };
}
