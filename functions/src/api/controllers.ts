/* API Controllers */

import { NextFunction, Request, Response } from "express";
import postController from '../components/posts/controller';

/**
 * @method POST
 * Función que envia los post semanalmente
 */
async function sendWeeklyPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { data: { topic } } = req.body;

    await postController.sendWeeklyPosts(topic);
    res.status(200).json({
      result: true,
    });

  } catch (error) {
    return next(new Error(error.toString()));
  }
}


export {
  sendWeeklyPosts,
};