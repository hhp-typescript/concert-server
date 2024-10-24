import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { appendFile, existsSync, mkdirSync } from 'fs';
import { Observable, tap } from 'rxjs';
import { User } from 'src/domain/user/domain/model/user';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    //로그 directory
    const logDirectory = './logs';

    if (!existsSync(logDirectory)) {
      mkdirSync(logDirectory, { recursive: true });
    }
    const accessLogPath = `${logDirectory}/access.log`;

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const { ip, method, originalUrl } = request;

    const userAgent = request.headers['user-agent'] || '';
    const user = request.user as User;
    const userId = user?.id || 'Anonymous';

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - start;
        const logMessage = `${new Date().toISOString()} ${method} ${originalUrl} Agent: ${userAgent} - IP: ${ip} - User: ${userId} - Status: ${response.statusCode} - ${elapsedTime}ms \n`;

        appendFile(accessLogPath, logMessage, (err) => {
          if (err) {
            this.logger.error(`Failed to write to access log: ${err.message}`);
          } else {
            this.logger.log(logMessage);
          }
        });
      }),
    );
  }
}
