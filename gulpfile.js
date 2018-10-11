const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const gulpSequence = require("gulp-sequence");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");

const packages = {
    cms: ts.createProject("src/tsconfig.json")
};
const modules = Object.keys(packages);
const source = "src";
const dist = "package";

gulp.task("default", function() {
    modules.forEach(module => {
        gulp.watch(
            [
                `${source}/**/*.graphql`,
                `${source}/*.graphql`,
                `${source}/**/*.ts`,
                `${source}/*.ts`,
                `${source}/*.ts`,
            ],
            [module]
        );
    });
});

gulp.task("copy:ts", function() {
    return gulp.src(["src/**/*.ts"]).pipe(gulp.dest("./lib"));
});

gulp.task("clean:lib", function() {
    return gulp
        .src(["lib/**/*.js.map", "lib/**/*.ts", "!lib/**/*.d.ts"], { read: false })
        .pipe(clean());
});

modules.forEach(module => {
    gulp.task(module, () => {
        gulp.src([
            `${source}/**/*.original.graphql`,
            `${source}/*.original.graphql`,
        ]).pipe(rename(function (path) {
            path.basename = path.basename.replace(".original", ".types");
        })).pipe(gulp.dest(`${dist}`));

        return packages[module]
            .src()
            .pipe(tslint({
                formatter: "verbose",
            }))
            .pipe(tslint.report({
                emitError: false,
                summarizeFailureOutput: true,
            }))
            .pipe(sourcemaps.init())
            .pipe(packages[module]())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(`${dist}`));
    });
});

modules.forEach(module => {
    gulp.task(module + ":dev", () => {
        return packages[module]
            .src()
            .pipe(sourcemaps.init())
            .pipe(packages[module]())
            .pipe(sourcemaps.mapSources(sourcePath => "./" + sourcePath.split("/").pop()))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(`${dist}`));
    });
});

gulp.task("build", function(cb) {
    gulpSequence("cms", modules.filter(module => module !== "cms"), cb);
});

gulp.task("build:dev", function(cb) {
    gulpSequence(
        "common:dev",
        modules
            .filter(module => module !== "common")
        .map(module => module + ":dev"),
    "copy:ts",
        cb
);
});

function getFolders(dir) {
    return fs.readdirSync(dir).filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}
gulp.task("move", function() {
    const getDirs = (base) => getFolders(base)
        .map((path) => `${base}/${path}`);

    const examplesDirs = getDirs("examples");
    const integrationDirs = getDirs("integration");
    const directories = examplesDirs.concat(integrationDirs);

    let stream = gulp
        .src(["node_modules/@nestjs/**/*"]);

    directories.forEach((dir) => {
        stream = stream.pipe(gulp.dest(dir + "/node_modules/@nestjs"));
    });
});
