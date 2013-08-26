(function(){

    Layout = (function() {

        var Q = require('q'),
            fs = require('fs'),
            _ = require('underscore'),
            jade = require('jade'),
            path = require('path');

        /**
         * @class Layout
         * @since 1.0
         * @description Encapsulate layout information that will be used by the renderer to structure the resume
         * @param tmplFn A tmpl function that will be called with the resume model to produce the rendered template
         * @constructor
         */
        function Layout(tmplFn) {
            this.tmplFn = tmplFn;
        }

        /**
         * Factory method to load a layout from a Jade source file.
         *
         * @public
         * @method load
         * @static
         * @param source The path of a jade template
         * @returns {Job} A new Layout instance
         */
        Layout.load = function(source) {
            var defer = Q.defer();

            Q.nextTick(function() {
                try {
                    var datapath = path.resolve(source);
                    console.log("Loading layout from ", datapath);

                    fs.readFile(datapath, function(err, tmpl){
                        if(err) defer.reject(err);
                        else {
                            try {
                                var fn = jade.compile(tmpl);
                                var layout = new Layout(fn);
                                defer.resolve(layout);
                            }
                            catch(err) {
                                defer.reject(err);
                            }
                        }
                    });
                }
                catch(err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        Layout.prototype.applyTo = function(model) {
            var _this = this;
            var defer = Q.defer();

            Q.nextTick(function(){
                if(_.isFunction(_this.tmplFn)) {
                    try {
                        var html = _this.tmplFn(model);
                        defer.resolve(html);
                    }
                    catch(err) {
                        defer.reject(err);
                    }
                }
            });

            return defer.promise;
        };

        return Layout;

    })();


    module.exports = Layout;

})();
