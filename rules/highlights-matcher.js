(function(){

    Rule = (function() {

        var Q = require('q'),
            util = require('util'),
            _ = require('underscore'),
            JobMatchingRule = require('../lib/job-matching-rule');

        function Rule() {
            this.key = "highlights";
        }

        util.inherits(Rule, JobMatchingRule);

        Rule.prototype.match = function(career, job, model) {
            var _this = this;
            var defer = Q.defer();

            model[_this.key] = [];

            Q.nextTick(function() {

                _.each(career.highlights, function(h) {

                    // Extra meta data
                    var record = _this.parse(h);

                    // Match with job language and profile
                    if(record.profiles.indexOf(job.profile) != -1 && record.lang === job.lang) {
                        _this.safePush(model, _this.key, record.text);
                    }
                });

                defer.resolve(model);
            });

            return defer.promise;
        };

        return Rule;

    })();


    module.exports = Rule;

})();
