var gulp = require("gulp"),
    nodemon = require("gulp-nodemon");

gulp.task("default", function () {
    nodemon({
        script: "server.js",
        ext: "js",
        env: {PORT: 8080, SSLPORT: 8443},
        ignore: ['./node_modules/**', './public/']
    })
        .on('restart', function () {
            console.log("restarted from gulp")
        });
});
