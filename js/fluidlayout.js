/**
 *
 * three column
 * animation?
 */
var fluid = fluid || {};
fluid.Layout = (function () {
	
	var _Iterator = (function () {
		
		function Iterator() {
			var _this = this;
			
			return _this;
		}
		
		return Iterator;
	}() );
	
	function Layout() {
		var _this = this;
		
		return _this;
	}
	
	Layout.tests = function () {
		console.assert(new Layout() !== null);
		/* API */
		console.assert(new Layout().addBox);
		console.assert(new Layout().removeBox);
		console.assert(new Layout().boxes() instanceof _Iterator);
		console.assert(new Layout().raiseBox);
		console.assert(new Layout().lowerBox);
		
		
	};
	
	return Layout;
}() );
