/* Error Handler Module */

import { NextFunction, Request, Response } from "express";


/**
 * Express middleware error handler
 * @param error Error
 * @param req Contexto del request
 * @param res Objeto de respuesta
 * @param next Siguiente función en express
 */
function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error) {
    return res.status(500).json({
      responseError: error.message,
    })
  }

  return console.error(`${error}`);
};


export default errorHandler;