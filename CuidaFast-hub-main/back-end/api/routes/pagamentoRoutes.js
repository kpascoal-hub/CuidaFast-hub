import express from "express";
import { criarPagamento } from "../controllers/pagamentoController.js";

const router = express.Router();

router.post("/create", criarPagamento);

export default router;
