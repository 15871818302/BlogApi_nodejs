import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "博客api文档",
      version,
      description: "博客api接口文档",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    contact: {
      name: "API 支持",
      url: "https://github.com/yourusername/BlogApi_nodejs",
      email: "your-email@example.com",
    },
    servers: [
      {
        url: "/api",
        description: "API 服务器",
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
      schemas: {
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "用户ID",
            },
            username: {
              type: "string",
              description: "用户名",
            },
            email: {
              type: "string",
              format: "email",
              description: "邮箱",
            },
            displayName: {
              type: "string",
              description: "显示名称",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "guest"],
              description: "角色",
            },
            avatar: {
              type: "string",
              description: "头像URL",
            },
          },
        },
        Post: {
          type: "object",
          required: ["title", "content", "author"],
          properties: {
            _id: {
              type: "string",
              description: "文章ID",
            },
            title: {
              type: "string",
              description: "文章标题",
            },
            content: {
              type: "string",
              description: "文章内容",
            },
            slug: {
              type: "string",
              description: "URL友好的标识符",
            },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
              description: "文章状态",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
            },
            code: {
              type: "integer",
            },
          },
        },
      },
    },
  },
  apis: [
    "../../src/controller/*.ts",
    "../../src/models/*.ts",
    "../../src/router/*.ts",
  ],
};

export const specs = swaggerJSDoc(options);
