import { Router } from "express";
import multer from "multer";
import { importContacts, importRecords } from "../controllers/import.contoller";

const router = Router();

// Store uploaded file in memory (not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/import", upload.single("file"), importContacts);

router.post("/import/records", upload.single("file"), importRecords);

export default router;