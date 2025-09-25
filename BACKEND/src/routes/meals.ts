import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex'; 
import { checkSessionIdExists } from '../middlewares/check-session-id';

export async function mealsRoutes(app: FastifyInstance) {
  
  
  app.addHook('preHandler', checkSessionIdExists); 

  const mealBodySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    dateTime: z.string().datetime(), 
    isOnDiet: z.boolean(),
  });
  
  const mealParamsSchema = z.object({
    id: z.string().uuid(),
  });

  [cite_start]
  app.post('/', async (request, reply) => {
    const { name, description, dateTime, isOnDiet } = mealBodySchema.parse(
      request.body,
    );

    await knexInstance('meals').insert({
      id: randomUUID(),
      name,
      description,
      date_time: dateTime,
      is_on_diet: isOnDiet,
      user_id: request.user.id, 
    });

    return reply.status(201).send();
  });

  [cite_start]
  app.get('/', async (request) => {
    const meals = await knexInstance('meals')
      .where('user_id', request.user.id) 
      .orderBy('date_time', 'desc');

    return { meals };
  });

  [cite_start]
  app.get('/:id', async (request, reply) => {
    const { id } = mealParamsSchema.parse(request.params);

    const meal = await knexInstance('meals')
      .where({
        id,
        [cite_start]user_id: request.user.id, 
      })
      .first();

    if (!meal) {
      return reply.status(404).send({ error: 'Refeição não encontrada ou acesso negado.' });
    }

    return { meal };
  });
  
  [cite_start]
  app.put('/:id', async (request, reply) => {
    const { id } = mealParamsSchema.parse(request.params);
    const updates = mealBodySchema.parse(request.body);

    const updated = await knexInstance('meals')
      .where({
        id,
        [cite_start]user_id: request.user.id, 
      })
      .update({
        name: updates.name,
        description: updates.description,
        date_time: updates.dateTime,
        is_on_diet: updates.isOnDiet,
        updated_at: knexInstance.fn.now(),
      });

    if (updated === 0) {
      return reply.status(404).send({ error: 'Refeição não encontrada ou acesso negado.' });
    }

    return reply.status(204).send();
  });
  
  [cite_start]// --- 5. CRUD: Apagar (DELETE /:id) [cite: 25] ---
  app.delete('/:id', async (request, reply) => {
    const { id } = mealParamsSchema.parse(request.params);

    const deleted = await knexInstance('meals')
      .where({
        id,
        [cite_start]user_id: request.user.id, 

    if (deleted === 0) {
      return reply.status(404).send({ error: 'Refeição não encontrada ou acesso negado.' });
    }

    return reply.status(204).send();
  });

  [cite_start]
  app.get('/metrics', async (request) => {
    
    
    const [totalMeals, dietMeals, outDietMeals] = await Promise.all([
      [cite_start]knexInstance('meals').where('user_id', request.user.id).count('id as total').first(), 
      [cite_start]knexInstance('meals').where({ user_id: request.user.id, is_on_diet: true }).count('id as total').first(), 
      [cite_start]knexInstance('meals').where({ user_id: request.user.id, is_on_diet: false }).count('id as total').first(), 
    ]);

    [cite_start]
    const meals = await knexInstance('meals')
      .where('user_id', request.user.id)
      .orderBy('date_time', 'asc'); 

    let currentSequence = 0;
    let bestSequence = 0;

    for (const meal of meals) {
      if (meal.is_on_diet) {
        currentSequence++;
      } else {
        currentSequence = 0; 
      }
      
      if (currentSequence > bestSequence) {
        bestSequence = currentSequence;
      }
    }

    return {
      totalMeals: Number(totalMeals?.total) || 0,
      totalOnDiet: Number(dietMeals?.total) || 0,
      totalOffDiet: Number(outDietMeals?.total) || 0,
      bestDietSequence: bestSequence, 
  });
}