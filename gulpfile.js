//'use strict';

const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
//const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const clean = require('del');

const target = './build';
const source = './src';

function browsersync() {
	browserSync.init({
		server: {
			baseDir: target,
		},
		port: 4000,
		notify: false, // Показ уведомления перезагрузки браузера
		online: true, // Работа без подключения к Интернету - false
	});
}

function scripts() {
	return src(`${source}/js/**/*.js`)
		.pipe(dest(`${target}/js`))
		.pipe(browserSync.stream());
}

function styles() {
	return src(`${source}/sass/style.scss`)
		.pipe(sass()).on('error', sass.logError)
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({ overrideBrowserslist: ['Last 1 version, > 0.1%, not dead'], grid: 'no-autoplace' }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } /*, format: 'beautify'*/ }))
		.pipe(dest(`${target}/css`))
		.pipe(browserSync.stream());
}

function images() {
	return src([`${source}/img/**/*`], { base: source })
		//.pipe(imagemin())
		.pipe(dest(target))
		.pipe(browserSync.stream());
}

function icons() {
	return src([`${source}/icons/**/*`], { base: source })
		.pipe(dest(target))
		.pipe(browserSync.stream());
}

function fonts() {
	return src([`${source}/fonts/**/*`], { base: source })
		.pipe(dest(target))
		.pipe(browserSync.stream());
}

function copyhtml() {
	return src([`${source}/**/*.html`], { base: source })
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(target))
		.pipe(browserSync.stream());
}

function startwatch() {
	watch(`${source}/scss/**/*.scss`, styles);
	watch(`${source}/js/**/*.js`, scripts);
	watch(`${source}/**/*.html`, copyhtml);
	watch(`${source}/fonts/**/*`, fonts);
	watch(`${source}/img/**/*`, images);
	watch(`${source}/icons/**/*`, icons);
}

const cleandist = () => clean(`${target}/**/*`, { force: true });

const build = series(cleandist, images, icons, fonts, styles, scripts, copyhtml, browsersync);

exports.default = parallel(build, startwatch);