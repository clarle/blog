var gulp      = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    minifyJS  = require('gulp-uglify'),
    concat    = require('gulp-concat'),

    metalsmith = require('gulp-metalsmith'),
    markdown   = require('metalsmith-markdown'),
    dateFormat = require('metalsmith-date-formatter'),
    prism      = require('@clarle/metalsmith-prism'),
    layouts    = require('metalsmith-layouts'),

    s3         = require('gulp-s3'),
    gzip       = require('gulp-gzip'),
    aws        = require('./aws.json'),

    marked = require('marked'),
    code   = require('./util/code');

gulp.task('default', ['html', 'css']);

gulp.task('deploy', function() {
    gulp.src('./build/**')
        .pipe(gzip())
        .pipe(s3(aws, {
            headers: {
                'Cache-Control': 'max-age=315360000, no-transform, public'
            },
            gzippedOnly: true
        }));
});

gulp.task('html', function() {
    // Overwrite default Markdown code renderer
    // with Prism-specific code renderer
    var renderer      = new marked.Renderer();
        renderer.code = code;

    gulp.src('src/**/*')
        .pipe(metalsmith({
            root: __dirname,
            frontmatter: true,
            use: [
                markdown({
                    renderer: renderer,
                    langPrefix: 'language-'
                }),
                dateFormat({
                    dates: 'date'
                }),
                prism({
                    lineNumbers: true
                }),
                layouts({
                    engine: 'handlebars',
                    directory: 'layouts/templates'
                })
            ]
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function() {
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
