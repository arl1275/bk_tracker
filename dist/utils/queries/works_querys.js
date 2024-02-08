"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_dec_env = void 0;
const generate_dec_env = () => {
    return `INSERT INTO declaracion_envios (created_at, declaracionenvio, id_status, id_camion, id_usuario) 
    VALUES (
        CURRENT_TIMESTAMP, 
        (
            SELECT num
            FROM (
                SELECT generate_series(1, 100000) AS num
            ) AS numbered_rows
            ORDER BY random()
            LIMIT 1
        ), 
        1,
        (SELECT id FROM camiones WHERE placa = $1), 
        (SELECT id FROM users WHERE nombre = $2)
    )
    RETURNING id;
    `;
};
exports.generate_dec_env = generate_dec_env;
//# sourceMappingURL=works_querys.js.map