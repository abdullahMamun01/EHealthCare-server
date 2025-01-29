import { ZodError } from "zod";


export type ZodErrorPaths = Array<{ path: string, error: string }>;

export function extractErrorPaths(error: ZodError): ZodErrorPaths {
    return error.errors.map((issue) => ({
      path: issue.path.join("."), // Join the path segments with a dot
      error: issue.message,
    }));
  }