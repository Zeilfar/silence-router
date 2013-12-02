
function node (path, parent) {
	return {
		path : path,
		parent : parent,
		childs : [],
		methods : {},
		uses : [],

		use: function(fct){
			this.uses.push(fct);
		},
		setMethod : function(method, fct){
			this.methods[method] = fct;
		},
		accept : function (path){
			if( typeof this.path === "string"){
				return this.path === path;
			}
			return path.match(this.path.regexp);
		},
		resolve : function (pathList, pathParams){
			if(! this.accept(pathList[0]) ){
				return null;
			}

			var thisPathParams = undefined;
			if(typeof this.path !== "string"){
				thisPathParams = { paramName : this.path.paramName ,  value: pathList[0] };
			}

			if(pathList.length === 1){
				if(thisPathParams){
					pathParams[thisPathParams.paramName] = thisPathParams.value;
				}
				return { node : this, pathParams: pathParams};
			}

			
			var nextPath = pathList.shift();
			var res = null;
			this.childs.some(function(child){
				res = child.resolve(pathList, pathParams);
				return res;
			});

			if(res){
				if(typeof this.path !== "string"){
					if(thisPathParams){
						pathParams[thisPathParams.paramName] = thisPathParams.value;
					}
				}
			}else{
				pathList.unshift(nextPath);
			}
			return res;
		},
		addChild : function (path) {
			var usedPath = path;
			if(usedPath.indexOf(":") === 0){
				usedPath = { original:path, regexp : /^.*$/, paramName:path.substring(1)};
			}

			var child = node(usedPath, this);
			this.childs.push(child);
			return child;
		},
		fullPath : function() {
			var displayedPath = this.path;
			if(typeof displayedPath !== "string"){
				displayedPath = this.path.original;
			}

			if(this.parent){
				return parent.fullPath() + "/" + displayedPath;
			}
			return displayedPath;
		}
	};
}

module.exports = node;