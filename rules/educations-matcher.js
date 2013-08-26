(function(){

    Rule = (function() {

        var Q = require('q'),
            util = require('util'),
            _ = require('underscore'),
            JobMatchingRule = require('../lib/job-matching-rule');

        require('underscore-query');

        function Rule() {
            this.key = "educations";
        }

        util.inherits(Rule, JobMatchingRule);

        Rule.prototype.match = function(career, job, model) {
            var _this = this;
            var defer = Q.defer();

            model[_this.key] = [];

            Q.nextTick(function() {

                model[_this.key] = career.educations;

                _.each(model[_this.key], function(edu) {
                    edu.certificate = _this.localize(edu.certificate, job.lang);
                    edu.school = _this.localize(edu.school, job.lang);
                    edu.city = _this.localize(edu.city, job.lang);
                });

                // Reverse education
                model.educations = _.sortBy(model.educations, function(e){ return -e.start_year; });

                defer.resolve(model);
            });

            return defer.promise;
        };

        return Rule;

    })();

    module.exports = Rule;

})();
