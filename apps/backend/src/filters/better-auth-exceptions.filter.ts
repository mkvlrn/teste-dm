import { type ArgumentsHost, Catch, type ExceptionFilter } from "@nestjs/common";
import { APIError } from "better-auth/api";

@Catch()
export class BetterAuthExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log("Exception type:", exception.constructor.name);
    console.log("Exception:", exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Your custom error handling logic
    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      message: exception.body?.message,
      // Add custom fields as needed
      timestamp: new Date().toISOString(),
    });
  }
}
