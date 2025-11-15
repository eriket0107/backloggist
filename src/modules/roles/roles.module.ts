import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { AdminOrSelfGuard } from "./admin-or-self.guard";

@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AdminOrSelfGuard,
  ],
})
export class RolesModule { }
