var assert = require('assert');
var router = require('../../lib/router');

describe("ON WORK", function () {

	it("Can go to second soluion without pathParams pollution", function () {
			var r = router()
				.path(":id")
					.path("truc")
					.parent()
				.parent()
				.path("lol")
					.path("machin");
			var res = r.resolve("/child/lol/machin");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/lol/machin");
			assert.deepEqual(res.pathParams, {});
	});

});