/**
 * @module career
 */
(function(){

    Career = (function() {

        var fs = require('fs'),
            path = require('path'),
            Yaml = require('js-yaml'),
            async = require('async'),
            _ = require('underscore'),
            Q = require('q');

        /**
         * @class Career
         * @since 1.0
         * @description A Career represents the model that describes all facts about someone's career.
         * @param data The model of the career as specified in the RG documentation
         * @constructor
         */
        function Career(data) {
            _.extend(this, data);
        }

        /**
         * Factory method that construct a {Career} instance from the provided source.
         *
         * @method load
         * @static
         * @public
         * @param source The path to a Yaml file or 'stdin' to receive model through the standard input
         * @returns {Career} A new Career instance
         */
        Career.load = function(source) {
            var baseDataDir;
            var defer = Q.defer();

            Q.nextTick(function() {
                var datapath = path.resolve(source);
                baseDataDir = path.dirname(datapath);
                fs.readFile(datapath, "UTF-8", function(err, content) {
                    if(err) defer.reject(err);
                    else {
                        var model = Yaml.safeLoad(content);

                        // Make sure we resolve all files
                        async.forEach(_.keys(model), function(k, callback) {

                            if(_.isString(model[k])) {
                                if(model[k].match(/^\$\$/)) {
                                    fs.readFile(path.resolve(baseDataDir, model[k].substring(3)), "UTF-8", function(err, subcontent){
                                        if(err) {
                                            model[k] = "ERROR: " + err;
                                        }
                                        else {
                                            model[k] = Yaml.safeLoad(subcontent);
                                        }

                                        callback();
                                    });
                                }
                                else
                                    callback();
                            }
                            else
                                callback();
                        }, function(err){
                            if(err)
                                defer.reject(err);
                            else
                                defer.resolve(new Career(model));
                        });
                    }
                });
            });

            return defer.promise;
        };

        return Career;

    })();


    module.exports = Career;

})();
