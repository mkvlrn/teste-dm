import { HttpStatus, Injectable, type PipeTransform } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { ZodType } from "zod";
import { AppError } from "#/app/app-error";

@Injectable()
export class ZodValidator implements PipeTransform {
  private readonly schema: ZodType;

  constructor(schema: ZodType) {
    this.schema = schema;
  }

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw new AppError(
        "ValidationError",
        `${ErrorCodes.validation.default}: ${errors.join(", ")}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return result.data;
  }
}
