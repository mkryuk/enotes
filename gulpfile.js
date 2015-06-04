var gulp = require("gulp"),
    nodemon = require("gulp-nodemon"),
    jshint = require("gulp-jshint"),
    stylish = require("jshint-stylish");

gulp.task("default",['lint'], function () {
    nodemon({
        script: "server.js",
        ext: "js",
        env: {PORT: 8080, SSLPORT: 8443},//TESTDB: "mongodb://localhost/test"
        ignore: ['./node_modules/**', './public/', './test/']})
        .on('restart', function () {
            console.log("restarted from gulp");
        });
});

gulp.task('lint', function () {
    return gulp.src(['./*.js','./app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});
