(function() {

    require('js-yaml');

    // Define our command line syntax
    var optimist = require('optimist'),
        Q = require('q'),
        Career = require('./lib/career'),
        Job = require('./lib/job'),
        JobMatcher = require('./lib/matcher'),
        Layout = require('./lib/layout'),
        util = require('util'),
        Renderer = require('./lib/renderer');

    var argv = optimist
        .usage("Match facts about your career and a job description to produce a customized resume. %0")
        .options({
            'b':{
                alias: 'bio',
                default: 'stdin',
                describe: 'Root file to your career facts'
            },
            'j':{
                alias:'job',
                default:'./job.yml',
                describe: 'Path to a file describing the current job on which you want to apply'
            },
            'f':{
                alias:'format',
                default:'MSWORD',
                describe: 'Format of the output. PDF, JSON, XML, MSWORD are supported'
            },
            'o':{
                alias:'output',
                default: 'stdout',
                describe: "Output path for the produced resume. "
            },
            'l':{
                alias:'layout',
                default:'classic',
                describe: 'Template file to use to render your resume'
            },
            'r':{
                alias:'rules',
                describe: 'Additional folder where to load job analysis rules'
            },
            'h':{
                alias:'help',
                describe: "Show this help"
            },
            's':{
                alias:'silent',
                describe: 'Do not display any output to the console'
            }
        })
        .argv;

    if(!argv.s) {
        console.log("Resume Generator Version 0.1.0");
        console.log("(C) Copyright 2013 Joel Grenon. Published under the Apache V2 License");
        console.log("");
    }

    if(argv.h) {
        optimist.showHelp();
        process.exit(0);
    }

    Q.all([
        Career.load(argv.b),
        Job.load(argv.j),
        (function() {
            var matcher = new JobMatcher();
            matcher.addRules("./rules");

            if(argv.r) {
                matcher.addRules(argv.r);
            }
            return Q.when(matcher);
        })(),
        Layout.load(argv.l),
        Renderer.load(argv.f)
    ]).spread(function(career, job, matcher, layout, renderer) {
        log("Working model loaded. Ready to generate your resume");

        // Retrieve all relevant experiences for the target job
        matcher.with(career).match(job).then(function(model) {

            // Rendering layout
            log("Rendering resume in ", argv.f);
            renderer.layout(layout).render(model).to(argv.o).then(function(result) {

                log("Resume has been successfully rendered to ", argv.o);
                log("Generation Report: ", result);

            }, handleError);

        }, handleError);

    }).fail(handleError);

    function handleError(err) {
        if(err) {
            console.log("ERROR: "+err);
            process.exit(-1);
        }
    }

    function log() {
        if(!argv.s)
            console.log.apply(this, arguments);
    }

})();
