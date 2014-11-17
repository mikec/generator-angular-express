describe('AppCtrl', function() {

    var ctrl;

    beforeEach(function() {
        module('<%= appname %>');
        inject(function($controller) {
            ctrl = $controller('AppCtrl');
        });
    });

    it('should define the controller', function() {
        expect(ctrl).toBeDefined();
    });

});