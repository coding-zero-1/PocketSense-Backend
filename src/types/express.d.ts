// src/types/express.d.ts

// This is crucial. It tells TypeScript that we are augmenting the 'express' module.
import "express";

// Declare global namespace for Express to augment its interfaces
declare global {
  namespace Express {
    // Extend the Request interface to include Clerk's 'auth' object
    // and our custom 'clerkId' property
    interface Request {
      clerkId?: string | null;
    }
  }
}
