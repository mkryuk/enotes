module.exports = {
    db: process.env.DB || "mongodb://localhost/notes",
    testDb: process.env.TESTDB || "mongodb://localhost/test",
    port: process.env.PORT || 8000,
    sslPort: process.env.SSLPORT || 8003,
    secretKey: "mySuperPuperSecretKey123",
    server_key: './ssl/server.key',
    public_key: './ssl/server.crt'
};
