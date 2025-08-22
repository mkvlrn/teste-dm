import { type ArgumentsHost, Catch, type ExceptionFilter } from "@nestjs/common";
import { AppError } from "#/app/app-error";

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      message: exception.message,
      // Add custom fields as needed
      timestamp: new Date().toISOString(),
    });
  }
}
