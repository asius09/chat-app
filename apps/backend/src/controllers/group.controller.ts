import { Request, Response } from 'express';
import { GroupModel } from '../models/group.model';
import { Types } from 'mongoose';

/**
 * Handler to create a new group (community).
 * Expects: { name: string, description?: string } in req.body.
 * Requires: req.user._id (the user creating the group, set by authentication middleware).
 * Returns: The newly created group document.
 */
export const createGroupHandler = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required.' });
    }

    // Extract user id from req.user (middleware must set req.user for authentication)
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }

    const group = await GroupModel.create({
      name,
      description: description || '',
      members: [],
      createdBy: userId,
    });

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};

/**
 * Handler to delete a group (community) by its ID.
 * Expects: groupId as a URL parameter.
 * Requires: Only creator (createdBy) can delete the group (optionally enforced here).
 * Returns: 204 No Content on success, or 404 if group not found.
 */
export const deleteGroupHandler = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    if (!Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId.' });
    }

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Optionally require only the group creator to delete (uncomment if needed)
    // const userId = (req as any).user?._id;
    // if (!userId || group.createdBy.toString() !== userId.toString()) {
    //   return res.status(403).json({ message: 'Forbidden. Only the group creator can delete this group.' });
    // }

    await GroupModel.findByIdAndDelete(groupId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};

/**
 * Handler to add a user/member to an existing group.
 * Expects: groupId as a URL parameter, and { userId: string } in req.body.
 * Returns: Updated group details, or errors if not found or already added.
 */
export const addGroupMemberHandler = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Valid User ID is required.' });
    }

    if (!Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId.' });
    }

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Check if the user is already a member
    if (group.members.some((id) => id.toString() === userId)) {
      return res.status(400).json({ message: 'User already a member of the group.' });
    }

    group.members.push(userId);
    await group.save();

    return res.status(200).json({ message: 'User added to group.', group });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};

/**
 * Handler to remove a user/member from a group.
 * Expects: groupId and userId as URL parameters.
 * Returns: Updated group details, or errors if not found or user not a member.
 */
export const removeGroupMemberHandler = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.params;

    if (!Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid groupId.' });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const memberIndex = group.members.findIndex(
      (memberId) => memberId.toString() === userId
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'User not a member of the group.' });
    }

    group.members.splice(memberIndex, 1);
    await group.save();

    return res.status(200).json({ message: 'User removed from group.', group });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};
