var assert = require('assert');
var router = require('../../lib/router');

describe("ON WORK", function () {

	it("setted regexp", function () {
			var r = router().path("child");
			r.path(":id");
			r.path("lol");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:id");
			assert.deepEqual(res.pathParams, {id:"lol"});
	});

});