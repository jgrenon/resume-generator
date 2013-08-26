(function(){

    Rule = (function() {

        var Q = require('q'),
            util = require('util'),
            _ = require('underscore'),
            JobMatchingRule = require('../lib/job-matching-rule');

        function Rule() {
            this.key = "perso";
        }

        util.inherits(Rule, JobMatchingRule);

        Rule.prototype.match = function(career, job, model) {
            var _this = this;
            var defer = Q.defer();

            model[_this.key] = {};

            Q.nextTick(function() {

                // Process all personal infos
                model[_this.key] = _.omit(career, "bios", "highlights", "educations", "jobs", "interests", "projects");

                model[_this.key].native_language = _this.localize(career.native_language, job.lang);
                model[_this.key].spoken_languages = _this.localize(career.spoken_languages, job.lang);
                model[_this.key].written_languages = _this.localize(career.written_languages, job.lang);

                defer.resolve(model);
            });

            return defer.promise;
        };

        return Rule;

    })();


    module.exports = Rule;

})();
