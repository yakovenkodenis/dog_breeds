var gulp 		= require('gulp'),
	coffee 		= require('gulp-coffee'),
	stylus 		= require('gulp-stylus'),
	nib 		= require('nib'),
	csso		= require('gulp-csso'),
	jade 		= require('gulp-jade'),
	concat 		= require('gulp-concat'),
	gutil 		= require('gulp-util'),
	uglify		= require('gulp-uglify')
	es			= require('event-stream'),
	express		= require('express'),
	livereload	= require('gulp-livereload'),
	path		= require('path'),
	tinylr		= require('tiny-lr')();

gulp.task('stylus', function() {
	return gulp.src('stylus/main.styl')
		.pipe( stylus({
			whitespace: 	true,
			compress: 		true,
			'include css': 	true,
			use: [
				nib()
			]
		}) )
		.pipe( csso() )
		.pipe( gulp.dest('public/stylesheets/') );
});

gulp.task('coffee', function() {
	return es.merge(
			gulp.src('coffee/*.coffee')
				.pipe( coffee() ),
			gulp.src('coffee/*.js')
		)
		.pipe( uglify() )
		.pipe( concat('all.min.js') )
		.pipe( gulp.dest('public/js/') );
});

gulp.task('jade', function() {
	return gulp.src('jade/index.jade')
	.pipe( jade({
		pretty: true
	}) )
	.pipe(gulp.dest('public/'));
});

gulp.task('express', function() {
	var app = express();
	app.use(require('connect-livereload')({ port: 4002 }));
	app.use(express.static(path.resolve('./public')));
	app.listen(3000);
	gutil.log('Listening on port 3000');
	// show external ip address
	var address = require('os').networkInterfaces().wlan0[0].address;
	gutil.log('External access:', address);
});

gulp.task('livereload', function() {
	tinylr.listen(4002);
});

function notifyLiveReload(event) {
	var fileName = path.relative('./public', event.path);

	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

gulp.task('watch', function() {

	gulp.watch('stylus/*.styl', ['stylus']);

	gulp.watch('coffee/*.js', ['coffee']);

	gulp.watch('coffee/*.coffee', ['coffee']);

	gulp.watch('jade/*.jade', ['jade']);

	gulp.watch('public/*.html', notifyLiveReload)
	gulp.watch('public/stylesheets/*.css', notifyLiveReload)
	gulp.watch('public/js/*.js', notifyLiveReload)
});

// Default task
gulp.task('default', ['coffee', 'stylus', 'jade',
					  'express', 'watch', 'livereload']);
