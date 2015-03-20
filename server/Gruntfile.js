module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['app/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'app/*.js']
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		karma: {
			unit: {
				options: {
					frameworks: ['jasmine'],
					singleRun: true,
					browsers: ['PhantomJS'],
					files: [
						'bower_components/angular/angular.js',
						'bower_components/angular-route/angular-route.js',
						'bower_components/angular-mocks/angular-mocks.js',
						'bower_components/d3/d3.min.js',
						'bower_components/n3-line-chart/build/line-chart.min.js',
						'app/*.js',
						'tests/*.js'
					]
				}
			}
		},
		jasmine: {
			coverage: {
				src: 'app/*.js',
				options: {
					specs: 'tests/*.js', 
					vendor: [
						'bower_components/angular/angular.js',
						'bower_components/angular-route/angular-route.js',
						'bower_components/angular-mocks/angular-mocks.js',
						'bower_components/d3/d3.min.js',
						'bower_components/n3-line-chart/build/line-chart.min.js'
					],
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: 'tests/coverage/coverage.json',
						report: [
							{
								type: 'html',
								options: {
									dir: 'tests/coverage/html'
								}
							},
							{
								type: 'cobertura',
								options: {
									dir: 'tests/coverage/cobertura'
								}
							},
							{
								type: 'text-summary'
							}
						]
					}
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('deploy', ['default', 'concat', 'uglify']);
	grunt.registerTask('test', ['jshint', 'karma']);
	grunt.registerTask('test:coverage', ['jasmine:coverage']);
};