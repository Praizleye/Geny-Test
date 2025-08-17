"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterMetrics = RegisterMetrics;
const prom_client_1 = require("prom-client");
function RegisterMetrics(app) {
    (0, prom_client_1.collectDefaultMetrics)();
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.getInstance().get('/metrics', async (_req, res) => {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    });
}
//# sourceMappingURL=register.js.map