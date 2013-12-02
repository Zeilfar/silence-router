var node = require('./node');


function router () {
	var act = node("");
	var main = act;

 	var obj = {
 		resolve : function(fullPath) {
 			if(fullPath === "/"){
 				return { node: main, pathParams: {} };
 			}
 			return main.resolve(fullPath.split("/"), {});
 		},
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
 		/**TODO
 		crud: function(id, list, create, read, update, delete){
 			this
 			.get(list)
 			.post(create)
 			.path(id)
 				.get(read)
 				.del(delete)
 				.put(update);
 			return this;
 		}*/
 		createMW : function(badRequest, notAllowed){
 			var self = this;
 			return function (req, res, next){

 				var finalNodeWithPathParams = self.resolve(req.path);
 				if(!finalNodeWithPathParams){
 					return badRequest(req, res, next);
 				}
 				var finalNode = finalNodeWithPathParams.node;
 				if( ! finalNode.methods[req.method] ){
 					return notAllowed(req, res, next);
 				}


 				var fcts  = [];
 				fcts.push(finalNode.methods[req.method]);
 				var act = finalNode;

 				while(act){
 					act.uses.forEach(function(use){
 						fcts.unshift(use);
 					});
 					act = act.parent;
 				}

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
 	};

 	return obj;
 	
 }

module.exports = router;
