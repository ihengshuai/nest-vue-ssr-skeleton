import { Module } from "@nestjs/common";
import { AppsModule } from "./modules/apps/apps.module";
import { TryExceptionFilter } from "./app.filter";
import { APP_FILTER } from "@nestjs/core";
import { MockModule } from "./modules/mock/mock.module";

@Module({
  imports: [AppsModule, MockModule],
  providers: [
    { provide: APP_FILTER, useClass: TryExceptionFilter }
  ]
})
export class MainAppModule {}
