import { supabase } from './client.js';

export class QuestionsService {
  static async getAllQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return this.groupByRound(data);
  }

  static async getQuestionsByRound(round) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('round', round)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async addCustomQuestion(questionData) {
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        ...questionData,
        is_custom: true,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async deleteCustomQuestion(id) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)
      .eq('is_custom', true);
    
    if (error) throw error;
  }

  static groupByRound(questions) {
    return questions.reduce((acc, q) => {
      const round = q.round || 'default';
      if (!acc[round]) acc[round] = [];
      acc[round].push(q);
      return acc;
    }, {});
  }
}

export class SessionsService {
  static async createSession(userId, gameData) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        user_id: userId,
        game_data: gameData,
        started_at: new Date().toISOString(),
        status: 'active'
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async updateSession(sessionId, updates) {
    const { data, error } = await supabase
      .from('sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async getSession(sessionId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async endSession(sessionId, finalScore) {
    const { data, error } = await supabase
      .from('sessions')
      .update({
        status: 'completed',
        final_score: finalScore,
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select();
    
    if (error) throw error;
    return data[0];
  }
}

export class UserProgressService {
  static async saveAnswer(sessionId, questionId, answer, isCorrect) {
    const { data, error } = await supabase
      .from('answers')
      .insert([{
        session_id: sessionId,
        question_id: questionId,
        answer: answer,
        is_correct: isCorrect,
        answered_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async getSessionAnswers(sessionId) {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('session_id', sessionId)
      .order('answered_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
}
