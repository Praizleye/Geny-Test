"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const register_1 = require("./metrics/register");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    (0, register_1.RegisterMetrics)(app);
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Booking service listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map