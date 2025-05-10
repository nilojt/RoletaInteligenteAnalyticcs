import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoundSchema, User } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // API Routes for the roulette application
  const apiRouter = app.route('/api');

  // Get all rounds (limited to 20 newest)
  app.get('/api/rounds', async (req, res) => {
    try {
      const rounds = await storage.getAllRounds();
      res.json(rounds);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch rounds' });
    }
  });

  // Create a new round
  app.post('/api/rounds', async (req, res) => {
    try {
      const validatedRound = insertRoundSchema.parse(req.body);
      const newRound = await storage.createRound(validatedRound);
      res.status(201).json(newRound);
    } catch (error) {
      res.status(400).json({ message: 'Invalid round data' });
    }
  });

  // Clear all rounds
  app.delete('/api/rounds', async (req, res) => {
    try {
      await storage.clearRounds();
      res.status(200).json({ message: 'All rounds cleared' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear rounds' });
    }
  });

  // Get a specific round by ID
  app.get('/api/rounds/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const round = await storage.getRound(id);
      if (!round) {
        return res.status(404).json({ message: 'Round not found' });
      }
      
      res.json(round);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch round' });
    }
  });

  // === Rotas de Administração ===
  
  // Listar todos os usuários (apenas para admin)
  app.get('/api/admin/users', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const user = req.user as User;
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
    }
    
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  });
  
  // Excluir um usuário (apenas para admin)
  app.delete('/api/admin/users/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const user = req.user as User;
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
    }
    
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuário inválido' });
    }
    
    // Impedir que o admin exclua sua própria conta
    if (userId === user.id) {
      return res.status(400).json({ message: 'Não é possível excluir sua própria conta de administrador' });
    }
    
    try {
      await storage.deleteUser(userId);
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
