import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { isDev } from '../config/env.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, val.message])
    );
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  } else if ((err as { code?: number }).code === 11000) {
    statusCode = 409;
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    message = `Duplicate value for: ${Object.keys(keyValue ?? {}).join(', ') || 'unique field'}`;
  } else if (err instanceof MulterError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof Error) {
    message = isDev ? err.message : message;
  }

  if (statusCode >= 500) {
    console.error('🔥 Unhandled error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(isDev && err instanceof Error ? { stack: err.stack } : {}),
  });
}
