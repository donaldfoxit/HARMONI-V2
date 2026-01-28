import express from 'express';
import { QuestionsService, SessionsService, UserProgressService } from '../supabase/services.js';
import { fallbackQuestions, fallbackRiskyQuestions } from '../data/fallback-questions.js';
import { bondingPrompts } from '../data/bonding-prompts.js';

const router = express.Router();

// Questions endpoints
router.get('/questions', async (req, res) => {
  try {
    const questions = await QuestionsService.getAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions from Supabase, using fallback:', error.message);
    // Return fallback questions if Supabase is not available
    res.json({
      ...fallbackQuestions,
      risky: fallbackRiskyQuestions
    });
  }
});

// Bonding Prompts endpoint
router.get('/bonding-prompts', (req, res) => {
  res.json(bondingPrompts);
});

router.get('/questions/round/:round', async (req, res) => {
  try {
    const questions = await QuestionsService.getQuestionsByRound(req.params.round);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching round questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions for round' });
  }
});

router.post('/questions/custom', async (req, res) => {
  try {
    const question = await QuestionsService.addCustomQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding custom question:', error);
    res.status(500).json({ error: 'Failed to add custom question' });
  }
});

router.delete('/questions/custom/:id', async (req, res) => {
  try {
    await QuestionsService.deleteCustomQuestion(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Sessions endpoints
router.post('/sessions', async (req, res) => {
  try {
    const session = await SessionsService.createSession(req.body.userId, req.body.gameData);
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.put('/sessions/:id', async (req, res) => {
  try {
    const session = await SessionsService.updateSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await SessionsService.getSession(req.params.id);
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

router.post('/sessions/:id/end', async (req, res) => {
  try {
    const session = await SessionsService.endSession(req.params.id, req.body.finalScore);
    res.json(session);
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Answers endpoints
router.post('/answers', async (req, res) => {
  try {
    const answer = await UserProgressService.saveAnswer(
      req.body.sessionId,
      req.body.questionId,
      req.body.answer,
      req.body.isCorrect
    );
    res.status(201).json(answer);
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

router.get('/sessions/:sessionId/answers', async (req, res) => {
  try {
    const answers = await UserProgressService.getSessionAnswers(req.params.sessionId);
    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// Config endpoint
router.get('/config', (req, res) => {
  res.json({
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
