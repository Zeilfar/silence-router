var node = require('./node');

function createMW(badRequest, notAllowed){

	var self = this;

	return function (req, res, next){

		var resolved = self.resolve(req.path);
		
		if(!resolved){
			return badRequest(req, res, next);
		}

		var resolvedNode = resolved.node;
		
		//TODO add all the possibles request on this node to res (or req)
		if( ! resolvedNode.methods[req.method] ){
			return notAllowed(req, res, next);
		}
		
		//Set the pathParams
		req.params = req.params || {};
		Object.getOwnPropertyNames(resolved.pathParams).forEach(function(p){
			req.params[p] = resolved.pathParams[p];
		});
		
		//Create functions list
		var fcts  = [];
		fcts.push(resolvedNode.methods[req.method]);
		var act = resolvedNode;
		while(act){
			act.uses.forEach(function(use){
				fcts.unshift(use);
			});
			act = act.parent;
		}

		//Do the recursice call
		var i = -1;
		function nexter(err){
			if(err){
				return next(err);
			}
			i++;
			if(i>= fcts.length){
				return next();
			}
			fcts[i](req, res, nexter);
		}

		nexter();
	};
}

function router () {
	var act = node("");
	var main = act;

 	var obj = {
 		parent : function () {
 			act = act.parent;
 			return this;
 		},
 		path : function (p) {
 			//assert p [a-zA-Z]+
 			act = act.addChild(p);
 			return this;
 		},
 		method : function (method, fct) {
 			act.setMethod(method, fct);
 			return this;
 		},
 		use : function (fct) {
 			act.use(fct);
 			return this;
 		},
 		get : function(fct){
 			act.setMethod("GET",fct);
 			return this;
 		},
 		post : function(fct){
 			act.setMethod("POST",fct);
 			return this;
 		},
 		put : function(fct){
 			act.setMethod("PUT",fct);
 			return this;
 		},
 		delete : function(fct){
 			act.setMethod("DELETE",fct);
 			return this;
 		},
 		resolve : function (fullPath) {
			if(fullPath === "/"){
				return { node: main, pathParams: {} };
			}
			return main.resolve(fullPath.split("/"), {});
		},
 		createMW : createMW
 	};

 	return obj;
 	
 }

module.exports = router;
