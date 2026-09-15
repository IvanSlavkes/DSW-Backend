import { Router } from 'express';
import {
  listMatches,
  getMatchHandler,
  createMatchHandler,
  updateMatchHandler,
  deleteMatchHandler,
} from '../controllers/match.controller.js';

const router = Router();

router.get('/', listMatches);
router.get('/:id', getMatchHandler);
router.post('/', createMatchHandler);
router.put('/:id', updateMatchHandler);
router.delete('/:id', deleteMatchHandler);

export default router;
