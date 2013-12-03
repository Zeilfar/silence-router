
function regexpPath(path){
	return {
		original : path,
		regexp : /^.*$/,
		paramName : path.substring(1),

		accept: function (p){
			var self = this;
			if( ! p.match(this.regexp) ){
				return false;
			}
			return {
				pathParam : {
					name : self.paramName,
					value : p
				}
			};
		},
		displayPath : function(){
			return this.original;
		},
		pathParamName : function(){
			return path;
		}
	};
}
function simplePath(path){
	return {
		path: path,

		accept: function(p){
			return p === this.path;
		},
		displayPath : function(){
			return this.path;
		},
		pathParamName : function(){
			return null;
		}
	};
}

function createPath(path){
	if(path.indexOf(":") === 0) {
		return regexpPath(path);
	}
	return simplePath(path);
}

function node (path, parent) {
	return {
		path : createPath(path),
		parent : parent,
		childs : [],
		methods : {},
		uses : [],

		use: function(fct){
			this.uses.push(fct);
			return this;
		},
		setMethod : function(method, fct){
			this.methods[method] = fct;
			return this;
		},
		addChild : function (path) {
			var child = node(path, this);
			this.childs.push(child);
			return child;
		},
		accept : function (path){
			return this.path.accept(path);
		},
		fullPath : function() {
			if(this.parent){
				return parent.fullPath() + "/" + this.path.displayPath();
			}
			return this.path.displayPath();
		},
		resolve : function (pathList, pathParams){
			var acceptance = this.accept(pathList[0]);

			if(!acceptance){
				return null;
			}

			if(pathList.length === 1){
				if(acceptance.pathParam){
					pathParams[acceptance.pathParam.name] = acceptance.pathParam.value;
				}
				return { node : this, pathParams: pathParams};
			}
			
			var nextPath = pathList.shift();
			var res = null;
			this.childs.some(function(child){
				res = child.resolve(pathList, pathParams);
				return res;
			});

			if(!res){
				pathList.unshift(nextPath);
				return null;
			}
			
			if(acceptance.pathParam){
				pathParams[acceptance.pathParam.name] = acceptance.pathParam.value;
			}
			return res;			
		}
	};
}

module.exports = node;