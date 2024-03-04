
import { Controller } from "@nestjs/common";
import { AppController } from "../../app.controller";

@Controller({
  host: "testing-dev-home.ihengshuai.com"
})
export class AppsController extends AppController {}
