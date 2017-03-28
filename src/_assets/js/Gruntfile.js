module.exports = function(grunt) {

// This is the configuration.
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/StringHelper.js', 'src/UrlRule.js', 'src/UrlManager.js'],
                dest: 'built/urlManager.min.js'
            }
        }
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat']);
};