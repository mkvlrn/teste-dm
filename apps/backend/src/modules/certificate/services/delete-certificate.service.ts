import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class DeleteCertificateService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(id: string): AsyncResult<void, AppError> {
    try {
      const certificate = await this.prisma.certificate.findUnique({
        where: { id },
      });

      if (!certificate) {
        const error = new AppError(
          "NotFoundError",
          ErrorCodes.domain.certificate.notFound,
          HttpStatus.NOT_FOUND,
        );
        return R.error(error);
      }

      await this.prisma.certificate.delete({
        where: { id },
      });

      return R.ok(undefined);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
