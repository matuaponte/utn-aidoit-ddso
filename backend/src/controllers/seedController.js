import { seedService } from '../services/SeedService.js';

export function seed(req, res) {
  const result = seedService.execute();
  res.json(result);
}
