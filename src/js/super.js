// jshint ignore: start
define('super', ['backbone'], function(B) {
    'use strict';

    // The super method takes two parameters: a method name
    // and an array of arguments to pass to the overridden method.
    // This is to optimize for the common case of passing 'arguments'.
    function _super(methodName, args) {

        // Keep track of how far up the prototype chain we have traversed,
        // in order to handle nested calls to _super.
        this._superCallObjects || (this._superCallObjects = {});
        var currentObject = this._superCallObjects[methodName] || this,
            parentObject  = findSuper(methodName, currentObject);
        this._superCallObjects[methodName] = parentObject;

        var result = parentObject[methodName].apply(this, args || []);
        delete this._superCallObjects[methodName];
        return result;
    }

    // Find the next object up the prototype chain that has a
    // different implementation of the method.
    function findSuper(methodName, childObject) {
        var object = childObject;
        while (object[methodName] === childObject[methodName]) {
            object = object.constructor.__super__;
        }
        return object;
    }

    _.each(["Model", "Collection", "View", "Router"], function(klass) {
        B[klass].prototype._super = _super;
    });
});
