
function node (path, parent) {
	return {
		path : path,
		parent : parent,
		childs : [],

		accept : function (path){
			return this.path === path;
		},
		resolve : function (pathList){
			if(! this.accept(pathList[0]) ){
				return null;
			}
			if(pathList.length === 1){
				return this;
			}

			var nextPath = pathList.shift();
			var res = null;
			this.childs.some(function(child){
				res = child.resolve(pathList);
				return res;
			});
			return res;
		},
		addChild : function (path) {
			var child = node(path, this);
			this.childs.push(child);
			return child;
		},
		fullPath : function() {
			if(this.parent){
				return parent.fullPath() + "/" + this.path;
			}
			return this.path;
		}
	};
}

function init (main){
	return main;
}


function router () {
	var act = node("");
	var main = act;

 	var obj = {
 		resolve : function(fullPath) {
 			if(fullPath === "/"){
 				return main;
 			}
 			return main.resolve(fullPath.split("/"));
 		},
 		path : function (p) {
 			//assert p [a-zA-Z]+
 			act = act.addChild(p);
 			return this;
 		}
 	};

 	return obj;
 	
 }

 module.exports = router;
