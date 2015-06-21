var gulp      = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    minifyJS  = require('gulp-uglify'),
    concat    = require('gulp-concat'),

    metalsmith = require('gulp-metalsmith'),
    markdown   = require('metalsmith-markdown'),
    layouts    = require('metalsmith-layouts');

gulp.task('default', function() {
    gulp.src('src/**/*')
        .pipe(metalsmith({
            root: __dirname,
            frontmatter: true,
            use: [
                markdown(),
                layouts({
                    'engine': 'handlebars',
                    'directory': 'layouts/templates'
                })
            ]
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('layout-css', function() {
    gulp.src([
            'bower_components/normalize-css/normalize.css',
            'bower_components/prism/themes/prism.css',
            'bower_components/prism/plugins/line-numbers/prism-line-numbers.css',
            'layouts/styles/**/*.css'
        ])
        .pipe(minifyCSS())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('layout-js', function() {
    gulp.src([
            'bower_components/prism/prism.js',
            'bower_components/prism/plugins/line-numbers/prism-line-numbers.js',
            'bower_components/prism/components/prism-javascript.js'
        ])
        .pipe(minifyJS())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./build/js'));
});
