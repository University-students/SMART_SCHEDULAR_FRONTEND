import mongoose from 'mongoose';
import { ZodError } from 'zod';

export function notFound(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The requested endpoint was not found.' } });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request body exceeds the allowed size.' } });
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'The request body must be valid JSON.' } });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Check the submitted fields and try again.',
        details: error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message })),
      },
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ error: { code: 'DUPLICATE', message: 'A record with those details already exists.' } });
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Check the submitted fields and try again.' } });
  }

  console.error('Unhandled API error', error);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'The server could not complete the request.' } });
}
