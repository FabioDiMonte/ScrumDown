
module.exports = function(grunt) {

    /****************************************
     *
     * PROJECT CONFIGURATION
     *
     ****************************************/

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /********************
         * REPLACE FILES INLINE
         ********************/
        'string-replace': {
            inline: {
                files: {
                    'build/': 'build/index.min.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: /<(script|link)(.*?)\s(?:src|href)="(?:js\/|css\/)(.+)(\.js|\.css)"(?:><\/script>|\/>)/ig,
                            replacement: function(match,p1,p2,p3,p4){
                                p1.replace('link','style');
                                return ['<'+p1+p2+'>',grunt.file.read('target/'+p3+'.min'+p4),'</'+p1+'>'].join('');
                            }
                        }
                    ]
                }
            }
        },
        
        /********************
         * MINIFY FILES
         ********************/
        uglify: {
            main  : { files: { 'target/main.min.js'  : ['src/js/main.js']  } },
            proto : { files: { 'target/proto.min.js' : ['src/js/proto.js'] } },
            ui    : { files: { 'target/ui.min.js'    : ['src/js/ui.js']    } }
        },
        cssmin: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/css', src: ['*.css'],
                    dest: 'target', ext: '.min.css'
                }]
            }
        },

        /********************
         * CLEAN
         ********************/
        clean: {
            target : ['target'],
            build  : ['build'],
            all    : ['target','build']
        },

        /********************
         * COPY
         ********************/
        copy: {

            main: {
                files: [
                    {
                        expand: true,flatten: true,filter: 'isFile',
                        src: ['src/index.html'], dest: 'build/',
                        rename: function(dest,src){return dest + src.replace('.html','.min.html')}
                    }
                ]
            },
            libs: {
                files: [
                    {
                        expand: true,flatten:true,filter:'isFile',
                        src: ['src/js/jquery.js'], dest: 'target/',
                        rename: function(dest,src){return dest + src.replace('.js','.min.js')}
                    }
                ]
            }

        }

    });

    /****************************************
     *
     * LOAD PLUGINS
     *
     ****************************************/

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');

    /****************************************
     *
     * REGISTER TASKS
     *
     ****************************************/

    // Full tasks
    grunt.registerTask('build', ['clean:target', 'copy', 'uglify', 'cssmin', 'string-replace', 'clean:target']);

    // Default task
    grunt.registerTask('default', ['build']);

};
