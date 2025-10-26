import { Router } from 'express';
import {
  createGroupHandler,
  deleteGroupHandler,
  addGroupMemberHandler,
  removeGroupMemberHandler,
} from '../controllers/group.controller';
import { verifyUser } from '../middlewares/verifyUser.middleware';

const groupRouter = Router();

// Create a new group (community)
groupRouter.post('/', verifyUser, createGroupHandler);

// Delete a group (community)
groupRouter.delete('/:groupId', verifyUser, deleteGroupHandler);

// Add a user/member to a group
groupRouter.post('/:groupId/members', verifyUser, addGroupMemberHandler);

// Remove a user/member from a group
groupRouter.delete('/:groupId/members/:userId', verifyUser, removeGroupMemberHandler);

export default groupRouter;
