import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/server.ts",
      exportName: "default",
      tsCompiler: "swc",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@config": resolve(__dirname, "./src/config"),
      "@controllers": resolve(__dirname, "./src/controllers"),
      "@models": resolve(__dirname, "./src/models"),
      "@services": resolve(__dirname, "./src/services"),
      "@repositories": resolve(__dirname, "./src/repositories"),
      "@middlewares": resolve(__dirname, "./src/middlewares"),
      "@routes": resolve(__dirname, "./src/routes"),
      "@types": resolve(__dirname, "./src/types"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/server.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      // 标记为外部依赖，不参与打包
      external: [
        /node_modules/,
        "mock-aws-s3",
        "aws-sdk",
        "nock",
        "@mapbox/node-pre-gyp",
      ],
      output: {
        entryFileNames: "[name].js",
      },
    },
    ssr: true,
    target: "node18",
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
