import { Router } from "express";
import multer from "multer";
import { importContacts } from "../controllers/import.contoller";

const router = Router();

// Store uploaded file in memory (not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/import", upload.single("file"), importContacts);

export default router;