const browserSync = require("browser-sync").create();

const gulp = require("gulp");
const sass = require('gulp-sass')(require('node-sass'));
const autoprefixer = require("gulp-autoprefixer");
const terser = require("gulp-terser");
const svgmin = require("gulp-svgmin");

const packageFile = require("./package");
const gulppath = require("./gulppath");

const isProductionEnviroment = process.env.NODE_ENV === "production";

const tasksArr = [];
const taskObjectArr = Object.entries(gulppath.tasks);

for (let key in taskObjectArr) {
  if (taskObjectArr[key][1] !== null) tasksArr.push(taskObjectArr[key][0]);
}

async function ltco_styles() {
  const { srcPath, destPath } = gulppath.tasks.ltco_styles;

  if (!srcPath || !destPath) return;

  return gulp
    .src(srcPath)
    .pipe(
      sass({
        outputStyle: isProductionEnviroment ? "compressed" : "expanded", // expanded / nested / compact / compressed
      })
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.stream());
}

gulp.task("ltco_styles", ltco_styles);

async function ltco_scripts() {
  const { srcPath, destPath } = gulppath.tasks.ltco_scripts;

  if (!srcPath || !destPath) return;

  return gulp
    .src(srcPath, { sourcemaps: true })
    .pipe(terser())
    .pipe(gulp.dest(destPath, { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

gulp.task("ltco_scripts", ltco_scripts);

async function ltco_plugins_styles() {
  const { srcPath, destPath } = gulppath.tasks.ltco_plugins_styles;

  if (!srcPath || !destPath) return;

  return gulp.src(srcPath).pipe(gulp.dest(destPath)).pipe(browserSync.stream());
}

gulp.task("ltco_plugins_styles", ltco_plugins_styles);

async function ltco_plugins_scripts() {
  const { srcPath, destPath } = gulppath.tasks.ltco_plugins_scripts;

  if (!srcPath || !destPath) return;

  return gulp.src(srcPath).pipe(gulp.dest(destPath)).pipe(browserSync.stream());
}

gulp.task("ltco_plugins_scripts", ltco_plugins_scripts);

async function ltco_images() {
  const { srcPath, destPath } = gulppath.tasks.ltco_images;

  if (!srcPath || !destPath) return;

  return gulp.src(srcPath).pipe(gulp.dest(destPath));
}

gulp.task("ltco_images", ltco_images);

async function ltco_svgs() {
  const { srcPath, destPath } = gulppath.tasks.ltco_svgs;
  
  if (!srcPath || !destPath) return;
  
  return gulp.src(srcPath).pipe(svgmin()).pipe(gulp.dest(destPath));
}

gulp.task("ltco_svgs", ltco_svgs);

async function ltco_all() {
  const { srcPath, destPath } = gulppath.tasks.ltco_all;

  if (!srcPath || !destPath) return;

  return gulp.src(srcPath).pipe(gulp.dest(destPath)).pipe(browserSync.stream());
}

gulp.task("ltco_all", ltco_all);

function browser_sync() {
  const browserSyncOptions = gulppath.browserSync;

  if (browserSyncOptions) browserSyncOptions.logPrefix = packageFile.name;

  const isWebProxy = process.env.FILES_ENV === "true";

  const webProxyOptions = {
    logPrefix: packageFile.name,
    open: false,
    server: {
      baseDir: "./public",
    },
  };

  const defaultOptions = {
    server: {
      baseDir: "./public",
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
    callbacks: {
      ready: function (_err, bs) {
        bs.addMiddleware("*", function (_req, res) {
          res.writeHead(302, {
            location: "404",
          });

          res.end("Redirecting!");
        });
      },
    },
  };

  browserSync.init(
    (isWebProxy ? webProxyOptions : browserSyncOptions) || defaultOptions
  );
}

gulp.task("browser_sync", browser_sync);

function watch_everyone() {
  const watchPath = gulppath.watch;

  gulp.watch(watchPath.ltco_styles, ltco_styles);

  gulp.watch(watchPath.ltco_scripts, ltco_scripts);

  // if (process.env.FILES_ENV !== "true")
    gulp.watch(watchPath.ltco_images, ltco_images);

  // if (process.env.FILES_ENV !== "true")
    gulp.watch(watchPath.ltco_svgs, ltco_svgs);

  // if (process.env.FILES_ENV !== "true")
    // gulp.watch(watchPath.ltco_all).on("change", browserSync.reload);
    gulp.watch(watchPath.ltco_all, ltco_all);
}

gulp.task("watch_everyone", watch_everyone);

gulp.task(
  "server",
  gulp.series(
    gulp.parallel(tasksArr),
    gulp.parallel("watch_everyone", "browser_sync")
  )
);

gulp.task(
  "dev",
  gulp.series(gulp.parallel(tasksArr), gulp.parallel("watch_everyone"))
);

gulp.task("default", gulp.parallel(tasksArr));
