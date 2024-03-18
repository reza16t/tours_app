export class ErrorHandler extends Error {
   statusCode?: number;
   status?: string;
   isOperational?: boolean;
   constructor(message, statusCode) {
      super(message);

      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
   }
}
