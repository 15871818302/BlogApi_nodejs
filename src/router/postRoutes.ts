import { Router } from "express";
import { PostController } from "@/controller/PostController";
import { authMiddleware } from "@/middleware/auth";

const router = Router();

router.post("/create", authMiddleware, PostController.createPost);

export default router;
