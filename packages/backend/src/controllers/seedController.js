import { seedService } from '../services/SeedService.js';

export async function seed(req, res, next) {
  try {
    const result = await seedService.execute();
    res.json(result);
  } catch (error) {
    next(error);
  }
}
