(function(){

    Rule = (function() {

        var Q = require('q'),
            util = require('util'),
            _ = require('underscore'),
            JobMatchingRule = require('../lib/job-matching-rule');

        function Rule() {
            this.key = "job";
        }

        util.inherits(Rule, JobMatchingRule);

        Rule.prototype.match = function(career, job, model) {
            var _this = this;
            var defer = Q.defer();

            model[_this.key] = {};

            Q.nextTick(function() {

                model[_this.key] = job;
                model[_this.key].title = _this.localize(job.title, job.lang);

                defer.resolve(model);
            });

            return defer.promise;
        };

        return Rule;

    })();


    module.exports = Rule;

})();
