(function(){

    Rule = (function() {

        var Q = require('q'),
            util = require('util'),
            _ = require('underscore'),
            JobMatchingRule = require('../lib/job-matching-rule');

        function Rule() {
            this.key = "jobs";
        }

        util.inherits(Rule, JobMatchingRule);

        Rule.prototype.match = function(career, job, model) {
            var _this = this;
            var defer = Q.defer();

            model[_this.key] = [];

            Q.nextTick(function() {

                _.each(career.jobs, function(experience) {

                    var roles = [];

                    console.log("Processing experience at", experience.company.name);

                    _.each(experience.roles, function(r) {

                        if(_.contains(r.profile, job.profile)) {

                            // Localize company description
                            experience.company.description = _this.localize(experience.company.description, job.lang, job.profile);

                            // Localize title
                            r.title = _this.localize(r.title, job.lang, job.profile);

                            // Localize role description
                            r.description = _this.localize(r.description, job.lang, job.profile);
                            if(_.isString(r.description)) {
                                r.description = [r.description];
                            }

                            r.skills = _this.localize(r.skills, job.lang, job.profile);

                            roles.push(r);
                        }
                    });

                    // Reference all roles fitting the profile
                    if(roles.length > 0) {
                        experience.roles = roles;
                        _this.safePush(model, _this.key, experience);
                    }
                });

                // Reverse education
//                model[_this.key] = _.sortBy(model[_this.key], function(e) { return -e.start; });

                defer.resolve(model);
            });

            return defer.promise;
        };

        return Rule;

    })();


    module.exports = Rule;

})();
