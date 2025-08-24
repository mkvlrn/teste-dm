import { Module } from "@nestjs/common";
import { SearchService } from "#/modules/who/services/search.service";
import { WhoController } from "#/modules/who/who.controller";

@Module({
  imports: [],
  exports: [],
  providers: [SearchService],
  controllers: [WhoController],
})
export class WhoModule {}
