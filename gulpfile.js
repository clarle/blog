var gulp      = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    minifyJS  = require('gulp-uglify'),
    concat    = require('gulp-concat'),

    metalsmith = require('gulp-metalsmith'),
    markdown   = require('metalsmith-markdown'),
    layouts    = require('metalsmith-layouts')

    marked = require('marked'),
    code   = require('./util/code');

gulp.task('default', function() {
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
                    renderer: renderer
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

gulp.task('js', function() {
    gulp.src([
            'bower_components/prism/prism.js',
            'bower_components/prism/plugins/line-numbers/prism-line-numbers.js'
        ])
        .pipe(minifyJS())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./build/js'));
});
