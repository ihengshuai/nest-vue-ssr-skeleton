import { Controller, Get } from "@nestjs/common";

@Controller({
  path: "mock",
  host: "localhost"
})
export class MockController {
  @Get("/user")
  getMockUser() {
    return {
      code: 200,
      data: {
        name: "mock",
        age: 18
      }
    };
  }
}
