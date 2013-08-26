(function(){

    JobMatcher = (function() {

        var Q = require('q'),
            fs = require('fs'),
            _ = require('underscore'),
            async = require('async'),
            path = require('path');

        _.str = require('underscore.string');
        _.mixin(_.str.exports());
        _.str.include('Underscore.string', 'string');

        var rules = {};

        function JobMatcher() {

            fs.readdir(path.resolve(path.join(__dirname, "..", "rules")), function(err, files){

                _.each(files, function(f) {
                    if(_.str.endsWith(f, ".js")) {
                        var Rule = require(path.resolve(__dirname, "..", "rules", f));
                        if(Rule) {
                            var rule = new Rule();
                            rules[rule.key] = rule;
                        }
                    }
                });

            });

        }

        JobMatcher.prototype.addRules = function(rulepath) {
            fs.readdir(path.resolve(rulepath), function(err, files) {

                _.each(files, function(f) {
                    if(_.str.endsWith(f, ".js")) {
                        var Rule = require(path.resolve(rulepath, f));
                        if(Rule) {
                            var rule = new Rule();
                            rules[rule.key] = rule;
                        }
                    }
                });

            });
        };

        JobMatcher.prototype.with = function(career) {
            this.career = career;
            return this;
        };

        JobMatcher.prototype.match = function(job) {
            var _this = this;
            var defer = Q.defer();
            Q.nextTick(function() {
                var model = {};

                // Apply all configured matching rules to the career model
                async.forEach(_.keys(rules), function(key, callback) {
                    rules[key].match(_this.career, job, model).then(function() {
                        callback();
                    }, callback);
                }, function(err){
                    if(err) defer.reject(err);
                    else {
                        console.dir(model);
                        defer.resolve(model);
                    }
                });

            });
            return defer.promise;
        };

        return JobMatcher;

    })();


    module.exports = JobMatcher;

})();
