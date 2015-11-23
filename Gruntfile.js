/*global module*/
module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json");
    grunt.verbose;
    grunt.initConfig({
        pkgName: pkg.name,
        name: pkg.name,        
        watch: {
            autoDeployUpdate: {
                "files": ["./src/**/*"],
                "tasks": ["copy:out", "compress", "copy:deployment", "copy:mpks"], 
                options: {
                    debounceDelay: 250,
                    livereload: true
                }
            }
        },
        
        compress: {            
            out: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.name + ".mpk",
                    mode: "zip"
                },
                files: [{
                        expand: true,
                        date: new Date(),
                        store: false,
                        cwd: "./out",
                        src: ["**/*"]
                    }]
            }
        },
        
        copy: {
            out: {
                files: [
                    {dest: "./out", cwd: "./src/", src: ["**/*", "!**/*.psd"], expand: true}
                ]
            },
            deployment: {
                files: [
                    //{dest: "./test/Mx5.14.1/deployment/web/widgets", cwd: "./out/", src: ["**/*"], expand: true},
                    {dest: "./test/Mx5.16.1/deployment/web/widgets", cwd: "./out/", src: ["**/*"], expand: true},
                    {dest: "./test/Mx5.21/deployment/web/widgets", cwd: "./out/", src: ["**/*"], expand: true}
                ]
            },
            mpks: {
                files: [
                    //{dest: "./test/Mx5.14.1/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk"], expand: true},
                    {dest: "./test/Mx5.16.1/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk"], expand: true},
                    {dest: "./test/Mx5.21/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk"], expand: true}
                ]
            }                       
        },
        
        clean: {
            build: [
                    "./dist/" + pkg.version + "/" + pkg.name + "/*",
                    //"./test/Mx5.14.1/deployment/web/widgets/" + pkg.name + "/*",
                    //"./test/Mx5.14.1/widgets/" + pkg.name + ".mpk",
                    "./test/Mx5.16.1/deployment/web/widgets/" + pkg.name + "/*",
                    "./test/Mx5.16.1/widgets/" + pkg.name + ".mpk",
                    "./test/Mx5.21/deployment/web/widgets/" + pkg.name + "/*",
                    "./test/Mx5.21/widgets/" + pkg.name + ".mpk"
                ],
            out : "./out/**/*"                
        },
        file_append: {
            fixMendix: {
              files: [
                {
                  append: '\n require(["<%=pkgName%>/widget/<%=name%>"]);',
                  input: "src/<%=pkgName%>/widget/<%=name%>.js",
                  output: "out/<%=pkgName%>/widget/<%=name%>.js"
                }
              ]
            }
        },
        uglify: {
            distribute: {
              options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                //sourceMapIn: "src/<%=pkgName%>/widget/<%=name%>.js.map", // input sourcemap from a previous compilation
                banner: "// "+pkg.name + " V" + pkg.version + " Date : <%= grunt.template.today('isoDateTime') %>  Copyright: "+pkg.copyright
                //footer: '\n require(["<%=pkgName%>/widget/<%=name%>"]);'
                
              },
              files: {
                  // Mendix quirck, add Fix at and end of fine.
                "out/<%=pkgName%>/widget/<%=name%>.js": ["src/<%=pkgName%>/widget/<%=name%>.js"]
              }
            }
          }
    });
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-file-append');
    
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("distribute", ["clean:out", "copy:out", "uglify", "compress", "copy:mpks", "copy:mpks","copy:deployment"  ]);
    grunt.registerTask(
            "clean build",
            "Compiles all the assets and copies the files to the build directory.", 
            ["clean", "copy:out", "compress", "copy:mpks"]
            );
    grunt.registerTask("build", ["clean build"]);
};
