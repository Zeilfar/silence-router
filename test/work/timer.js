var assert = require('assert');
var router = require('../../lib/router');

describe("ON WORK", function () {

	it("Just a timer to have an idea", function(){
			var r = router()
				.path("child")
					.path(":first")
						.path("and")
							.path(":second")
						.parent()
					.parent()
					.path("passePas");
			
			var res =null;
			var nb = 1000000;
			var begin = new Date();
			for(var i=0;i<nb;i++){
				res= r.resolve("/child/1/and/2");
			}
			var end = new Date();
			console.log(nb,"resolve in ", end-begin,"ms");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:first/and/:second");
			assert.deepEqual(res.pathParams, {first:1, second:2});
	});
});
