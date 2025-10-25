import { Request, Response, NextFunction } from 'express';
import { ZodType, z, ZodError } from 'zod';
import { ResponseBuilder } from '../helpers/createResponse';

/**
 * Higher-order middleware generator for validating request data with a Zod schema.
 * By default, validates req.body; can optionally validate req.query or req.params.
 * Checks if provided schema is a Zod schema before attempting validation.
 * On error, responds with 400 and structured error detail, using z.treeifyError.
 * On success, attaches validated data to req.validated or req[dest].
 *
 * @param schema Zod schema to validate against
 * @param options Optional object:
 *   - source: "body" | "query" | "params" (defaults to "body")
 *   - dest: string (defaults to "validated" on req)
 */
export function validate(
  schema: unknown,
  options?: { source?: "body" | "query" | "params"; dest?: string }
) {
  const { source = "body", dest = "validated" } = options || {};

  // Check that the schema is a Zod schema before proceeding
  if (!(schema && typeof schema === 'object' && (schema as ZodType<any>).def)) {
    throw new TypeError(
      "validateSchema: schema must be a Zod schema instance (e.g., from z.object({...}))"
    );
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = (req as any)[source];

    // Defensive: check again at runtime in middleware for dynamic usage
    if (!(schema && typeof schema === 'object' && (schema as ZodType<any>).def)) {
      return res
        .status(500)
        .json(
          ResponseBuilder.fail(
            "Validator misconfiguration",
            "Invalid schema provided to validator"
          )
        );
    }

    const result = (schema as ZodType<any>).safeParse(dataToValidate);

    if (!result.success) {
      // Use z.treeifyError instead of deprecated flatten
      const errorTree = z.treeifyError(result.error as ZodError<any>);
      return res
        .status(400)
        .json(
          ResponseBuilder.validationError("Invalid request", errorTree)
        );
    }

    (req as any)[dest] = result.data;
    next();
  };
}
