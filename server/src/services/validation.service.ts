import { ValidationError, validationResult } from "express-validator";
import { Request, Response } from 'express';

class ValidationService {
    static handleValidationErrors = (request: Request, response: Response, next: Function) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
          return response.status(200).json({
            statusCode: 400,
            statusText: 'Request body is incorrect.',
            totalCount: 0,
            page: 0,
            data: errors.array().map((item: ValidationError) => JSON.parse(item.msg))
        }) ;
      }
      next();
  };
};
  
  export default ValidationService;