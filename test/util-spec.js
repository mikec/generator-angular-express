
describe('util.insertModuleDep()', function() {

    beforeEach(function() {
        this.util = require('../util');
    });

    it('should insert a module dependency into an existing list of dependencies',
    function() {
        var fileStr = global.mocks['modules-existing.js'] + '';
        var fileStrExpect = global.mocks['modules-existing_expect.js'] + '';
        expect(this.util.insertModuleDep(fileStr, 'mockapp', 'mocked'))
            .toEqual(fileStrExpect);
    });

    it('should insert a module dependency into an empty array',
    function() {
        var fileStr = global.mocks['modules-empty.js'] + '';
        var fileStrExpect = global.mocks['modules-empty_expect.js'] + '';
        expect(this.util.insertModuleDep(fileStr, 'mockapp', 'mocked'))
            .toEqual(fileStrExpect);
    });

});