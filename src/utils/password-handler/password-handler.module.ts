import { Global, Module } from "@nestjs/common";
import { PasswordHandler } from "./password-handler.service";

@Global()
@Module({
  providers: [
    PasswordHandler
  ],
  exports: [PasswordHandler],
})
export class PasswordHandlerModule { }