export const swaggerConfig = {
    openapi: {
        info: {
            title: "API Medical",
            description: "API para gerenciamento de médicos e pacientes",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de desenvolvimento",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
};
export const scalarConfig = {
    routePrefix: "/docs",
    configuration: {
        theme: "purple",
        title: "API Medical - Documentação",
    },
};
