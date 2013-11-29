var assert = require('assert');
var router = require('../../lib/router');

describe("Router", function () {
	
	it("Can create", function () {
		var r = router();
		assert.ok(r);
	});

	describe("Resolve", function (){
		it("nothing", function() {
			var r = router();
			var res = r.resolve("/");
			assert.ok(res);
			assert.strictEqual(res.fullPath(),"");
		});

		it("simple child", function() {
			var r = router().path("child")
			var res = r.resolve("/child");
			assert.ok(res);
			assert.strictEqual(res.fullPath(),"/child");
		});
		it("chained childs", function() {
			var r = router().path("child").path("other").path("lol");
			var res = r.resolve("/child/other/lol");
			assert.ok(res);
			assert.strictEqual(res.fullPath(),"/child/other/lol");
		});
		
		it("chained childs but can stop before leaf", function() {
			var r = router().path("child").path("other").path("lol");
			var res = r.resolve("/child/other");
			assert.ok(res);
			assert.strictEqual(res.fullPath(),"/child/other");
		});
		it("Resolve failed", function () {
			var r = router().path("child").path("other").path("lol");
			var res = r.resolve("/child/other2");
			assert.strictEqual(res, null);
		});
	});
	describe("Resolve regexp", function() {
		it("Resolve regexp", function () {
			var r = router().path("child").path(":id").path("lol");
			var res = r.resolve("/child/truc");
			assert.ok(res);
			assert.strictEqual(res.fullPath(), "/child/:id");
		});
		it("Resolve regexp until leaf", function () {
			var r = router().path("child").path(":id").path("lol");
			var res = r.resolve("/child/truc/lol");
			assert.ok(res);
			assert.strictEqual(res.fullPath(), "/child/:id/lol");
		});
	});
	describe("Order is serious business", function() {
		it("First regexp", function () {
			var r = router().path("child");
			r.path(":id");
			r.path("lol");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.fullPath(), "/child/:id");
		});
		it("First string", function () {
			var r = router().path("child");
			r.path("lol");
			r.path(":id");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.fullPath(), "/child/lol");
		});
	});
});