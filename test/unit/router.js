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
			assert.ok(res.node);
			assert.strictEqual(res.node.fullPath(),"");
		});

		it("simple child", function() {
			var r = router().path("child")
			var res = r.resolve("/child");
			assert.ok(res);
			assert.ok(res.node);
			assert.strictEqual(res.node.fullPath(),"/child");
		});
		it("chained childs", function() {
			var r = router().path("child").path("other").path("lol");
			var res = r.resolve("/child/other/lol");
			assert.ok(res);
			assert.ok(res.node);
			assert.strictEqual(res.node.fullPath(),"/child/other/lol");
		});
		
		it("chained childs but can stop before leaf", function() {
			var r = router().path("child").path("other").path("lol");
			var res = r.resolve("/child/other");
			assert.ok(res);
			assert.ok(res.node);
			assert.strictEqual(res.node.fullPath(),"/child/other");
		});
		it("Resolve failed", function () {
			var r = router().path("child").path("other").path("lol");
			var res = r.resolve("/child/other2");
			assert.strictEqual(res, null);
		});
	});
	describe("Resolve regexp", function() {
		it("Resolve regexp", function () {
			var r = router().path("child")
				.path(":id").parent()
				.path("lol");
			var res = r.resolve("/child/truc");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:id");
		});
		it("Resolve regexp until leaf", function () {
			var r = router().path("child")
				.path(":id")
				.path("lol");
			var res = r.resolve("/child/truc/lol");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:id/lol");
		});
	});
	describe("Order is serious business", function() {
		it("First regexp", function () {
			var r = router()
				.path("child")
					.path(":id").parent()
					.path("lol");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:id");
		});
		it("First string", function () {
			var r = router().path("child")
				.path("lol").parent()
				.path(":id");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/lol");
		});
		it("Can go to second soluion", function () {
			var r = router().path("child")
				.path(":id")
					.path("truc").parent()
				.parent()
				.path("lol").path("machin");
			var res = r.resolve("/child/lol/machin");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/lol/machin");
		});
	});
	describe("PathParams",function () {
		it("Empty is no regexp",function(){
			var r = router().path("child").path("lol");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/lol");
			assert.deepEqual(res.pathParams, {});
		});
		it("setted regexp", function () {
			var r = router().path("child").path(":id");
			var res = r.resolve("/child/lol");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:id");
			assert.deepEqual(res.pathParams, {id:"lol"});
		});
		it("setted regexp two time", function () {
			var r = router().path("child").path(":id").path("ok").path(":truc");
			var res = r.resolve("/child/lol/ok/mdr");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/:id/ok/:truc");
			assert.deepEqual(res.pathParams, {id:"lol", truc:"mdr"});
		});
		it("Can go to second soluion without pathParams pollution", function () {
			var r = router()
				.path("child")
					.path(":id")
						.path("truc")
						.parent()
					.parent()
					.path("lol")
						.path("machin");
			var res = r.resolve("/child/lol/machin");
			assert.ok(res);
			assert.strictEqual(res.node.fullPath(), "/child/lol/machin");
			assert.deepEqual(res.pathParams, {});
		});
	});
});