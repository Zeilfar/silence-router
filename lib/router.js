
function node (path, parent) {
	return {
		path : path,
		parent : parent,
		childs : {},

		resolve : function (pathList){
			if(pathList.length === 0){
				return this;
			}

			var childName = pathList.shift();
			if(!this.childs[childName]){
				return null;
			}
			return this.childs[childName].resolve(pathList)
		},
		addChild : function (path) {
			var child  = this.childs[path];
			if(child){
				return child;
			}
			var child = node(path, this);
			this.childs[path] = child;
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
 			return main.resolve(fullPath.substring(1).split("/"));
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
