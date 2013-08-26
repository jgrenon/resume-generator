(function(){

    JobMatchingRule = (function() {

        var Q = require('q'),
            _ = require('underscore');

        _.str = require('underscore.string');
        _.mixin(_.str.exports());
        _.str.include('Underscore.string', 'string');

        function JobMatchingRule() {

        }

        JobMatchingRule.prototype.parse = function(data) {
            var record = new DataRecord();

            if(_.str.startsWith(data, "$!")) {
                var elms = /\$!\{(.*?):(.*?)\}(.*)/.exec(data);

                record.profiles = elms[1].split(",");
                record.lang = elms[2];
                record.text = elms[3];
            }
            else
                record.text = data;

            return record;
        };

        JobMatchingRule.prototype.safePush = function(o, coll, value) {
            if(!o[coll]) o[coll] = [];
            o[coll].push(value);
        };

        JobMatchingRule.prototype.localize = function(data, lang, profiles) {
            var _this = this;

            if(_.isString(profiles))
                profiles = [profiles];

            if(_.isArray(data)) {
                var result = [];
                _.each(data, function(d) {
                    var val = _this.localize(d, lang, profiles);
                    if(val)
                        result.push(val);
                });

                if(result.length === 1) {
                    result = result[0];
                }

                return result;
            }
            else if(_.isString(data)) {
                if(_.str.startsWith(data, "$!")) {
                    var elms = /\$!\[(.*?)\]/.exec(data);
                    if(elms){
                        var langs = elms[1].split(",");
                        var result = data;
                        _.each(langs, function(l) {
                            var e = l.split(":");
                            if(e[0] === lang.toLowerCase())
                                result = e[1];
                        });
                        return result;
                    }
                    else {
                        elms = /\$!(\w{2})\s(.*)/i.exec(data);
                        if(elms) {
                            if(elms[1] === lang.toLowerCase()) {
                                return elms[2];
                            }
                        }
                        else {
                            elms = /\$!\s*\{(.*?):(.*?)\}\s*(.*)/i.exec(data);
                            if(elms) {
                                var langs = elms[2].split(",");
                                if(langs.indexOf(lang.toLowerCase()) != -1) {
                                    if(profiles) {
                                        var targets = elms[1].split(",");
                                        var match = false;
                                        _.each(targets, function(t) {
                                            match |= profiles.indexOf(t) != -1;
                                        });

                                        if(match) {
                                            return elms[3];
                                        }
                                    }
                                    else {
                                        return elms[3];
                                    }
                                }
                            }
                            else {
                                return data;
                            }
                        }
                    }
                }
                else
                    return data;
            }
        };

        return JobMatchingRule;

    })();

    DataRecord = (function() {

        function DataRecord() {
            this.profiles = [];
        }

        return DataRecord;
    })();

    module.exports = JobMatchingRule;

})();
