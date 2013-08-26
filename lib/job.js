/**
 * @module job
 */
(function(){

    Job = (function() {

        var Q = require('q'),
            fs = require('fs'),
            Yaml = require('js-yaml'),
            _ = require('underscore'),
            path = require('path');


        /**
         * @class Job
         * @since 1.0
         * @description Represents a job description that will be used when matching experience to create a cutomized resume
         * @param data The model of the job as specified in the RG documentation
         * @constructor
         */
        function Job(data) {
            _.extend(this, data);
        }

        /**
         * Factory method to load a job model from a Yaml source file.
         *
         * @public
         * @method load
         * @static
         * @param source The path of a Yaml file containing the job model
         * @returns {Job} A new Job instance
         */
        Job.load = function(source) {
            var defer = Q.defer();

            Q.nextTick(function() {
                try {
                    var datapath = path.resolve(source);
                    console.log("Loading job from ", datapath);
                    fs.readFile(datapath, "UTF-8", function(err, content) {
                        if(err) defer.reject(err);
                        else {
                            var model = Yaml.safeLoad(content);

                            model.profile = model.profile.split(",");
                            if(model.profile.length == 1)
                                model.profile = model.profile[0];
                            defer.resolve(new Job(model));
                        }
                    });
                }
                catch(err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        return Job;

    })();


    module.exports = Job;

})();
