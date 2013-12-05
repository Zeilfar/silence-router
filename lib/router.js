var node = require('./node');

function createMW(badRequest, notAllowed){

	var self = this;

	return function (req, res, next){

		var resolved = self.resolve(req.path);
		
		if(!resolved){
			return badRequest(req, res, next);
		}

		var resolvedNode = resolved.node;
		
		var allowedMethods = Object.getOwnPropertyNames(resolvedNode.methods);
		if( allowedMethods.indexOf("OPTIONS") === -1 ){
			allowedMethods.push("OPTIONS");
		}

		res.allowedMethods = allowedMethods;
		if( allowedMethods.indexOf(req.method) === -1){
			return notAllowed(req, res, next);
		}
		
		if(req.method === "OPTIONS"){
			res.send(200);
			return next();
		} 	

		//Set the pathParams
		req.params = req.params || {};
		Object.getOwnPropertyNames(resolved.pathParams).forEach(function(p){
			req.params[p] = resolved.pathParams[p];
		});
		
		//Create functions list
		var fcts  = [];
		if(req.method === "OPTIONS"){
			fcts.push(function(req, res, next){
				res.send(200);
				next();
			});
		}else{
			fcts.push(resolvedNode.methods[req.method]);
		}
		var act = resolvedNode;
		while(act){
			act.uses.reverse().forEach(function(use){
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
			console.log("   ",i,": apply", fcts[i].name);
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
 			return this.method("GET",fct);
 		},
 		post : function(fct){
 			return this.method("POST",fct);
 		},
 		put : function(fct){
 			return this.method("PUT",fct);
 		},
 		delete : function(fct){
 			return this.method("DELETE",fct);
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
