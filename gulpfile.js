var gulp      = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    minifyJS  = require('gulp-uglify'),
    concat    = require('gulp-concat'),

    metalsmith  = require('gulp-metalsmith'),
    collections = require('metalsmith-collections'),
    markdown    = require('metalsmith-markdown'),
    prism       = require('@clarle/metalsmith-prism'),
    permalinks  = require('metalsmith-permalinks'),
    dateFormat  = require('metalsmith-date-formatter'),
    layouts     = require('metalsmith-layouts'),

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
                collections({
                    latest: {
                        pattern: '*.md'
                    }
                }),
                markdown({
                    renderer: renderer,
                    langPrefix: 'language-'
                }),
                prism({
                    lineNumbers: true
                }),
                permalinks({
                    pattern: 'posts/:title'
                }),
                dateFormat({
                    dates: 'date'
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
            'node_modules/normalize.css/normalize.css',
            'node_modules/prismjs/themes/prism.css',
            'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css',
            'layouts/styles/**/*.css'
        ])
        .pipe(minifyCSS())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./build/css'));
});
