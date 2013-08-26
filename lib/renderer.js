(function(){

    Renderer = (function() {

        var Q = require('q'),
            fs = require('fs'),
            path = require('path');

        function Renderer() {

        }

        Renderer.prototype.layout = function(layout) {
            this.layout = layout;
            return this;
        };

        Renderer.prototype.render = function(model) {
            this.model = model;
            return this;
        };

        Renderer.prototype.to = function(output) {
            var _this = this;
            var defer = Q.defer();
            this.output = output;

            Q.nextTick(function() {

                _this.layout.applyTo(_this.model).then(function(result) {
                    var destpath = path.resolve(_this.output);
                    fs.writeFile(destpath + ".html", result, function(err){
                        if(err)
                            defer.reject({success:false, error:err});
                        else
                            defer.resolve({success:true});
                    });
                }, function(err){
                    defer.reject(err);
                });

            });

            return defer.promise;
        };

        /**
         * Factory method
         *
         * @returns {Renderer}
         */
        Renderer.load = function(){
            return new Renderer();
        };

        return Renderer;

    })();


    module.exports = Renderer;

})();
