/**
 *
 */
var fluid = fluid || {};
fluid.Box = (function () {
	var
		_CONST = {
			REFERENCE : "reference"
		,	HEIGHT : "height" // Constant - used for referencing correct percentile operation
		,	WIDTH : "width" // Constant - used for referencing correct percentile operation
		,	TOP : "top"
		,	RIGHT : "right"
		,	BOTTOM : "bottom"
		,	LEFT : "left"
		}
		, _rx_percentile = new RegExp(/\d*%/) // RegExp - Matches first "%" preceeded by a number
		, _rx_percentSign = new RegExp(/%/) // RegExp - Matches first "%"
		, _rx_pixelText = new RegExp(/px/g) // RegExp - Matches all instances of "px"
	;
	
	function _parseParam(
		param
		, direction // String - Optional @see _parseStringMath
		, reference  // String - Optional @see _parseStringMath
	){
		if(param instanceof Function){
			return param();
		} else {
			return _parseStringMath(param, direction, reference);
		}
	}
	
	function _parseStringMath(
			str
		, direction // String - values (_CONST.HEIGHT, _CONST.WIDTH)
		, reference // String - Optional - CSS Selector
	){
		
		//console.log(_ref);
		
		var _str = str
			, _direction = direction
			, _ref = reference || window
			, _mod = (direction === _CONST.HEIGHT ) ? $(_ref).height() : $(_ref).width() // Number - to use percentile calculation
			, _convertedPercents
			, _cleanMath
			, _finalNum
		;
		function _convertPercentile( str ) {
			var _str = str;
			if(!_str){ return ""; }
			while (_str.match(_rx_percentile)) {
				var _pixelValue = (_str.match(_rx_percentile)[0].replace(_rx_percentSign,"")) * 0.01 * _mod;
				_str = _str.replace(_rx_percentile, _pixelValue);
			}
			return _str;
		}
		
		function _stripText( str ) {
			return str.replace(_rx_pixelText,"");
		}
		
		function _evalMath( str ) {
			var _ret = eval( str );
			return (typeof(_ret) === "number") ? _ret : "";
			
		}
		
		_convertedPercents = _convertPercentile(_str);
		_cleanMath = _stripText(_convertedPercents);
		//return Math.round(_evalMath(_cleanMath));
		return _evalMath(_cleanMath);
	}
	
	function _defined(val){
		return (typeof(val) !== "undefined");
	}
	
	/**
	 * @constructor
	 */
	function Box(
			box //String CSS box selector
		,	params // Object
	) {
		var _this = this
			, _box = box // String - CSS Selector
			, _reference // String - CSS Selector
			, _height // String
			, _width // String
			, _top // String
			, _right // String
			, _bottom // String
			, _left // String
			, _paramsMap = [
					[ _height,	_CONST.HEIGHT,	_CONST.HEIGHT ]
				, [ _width,		_CONST.WIDTH,		_CONST.WIDTH	]
				, [ _top,			_CONST.TOP,			_CONST.HEIGHT	]
				, [ _right,		_CONST.RIGHT,		_CONST.WIDTH	]
				, [ _bottom,	_CONST.BOTTOM,	_CONST.HEIGHT	]
				, [ _left,		_CONST.LEFT,		_CONST.WIDTH	]
			]
		;
		
		_this.setParams = function (params) {
			/*
			var _preference = params.reference
				, _pheight = params.height
				, _pwidth = params.width
				, _ptop = params.top
				, _pright = params.right
				, _pbottom = params.bottom
				, _pleft = params.left
			;
			_reference = (_defined(_preference)) ? _preference : window;
			
			_height = (_defined(_pheight)) ? _pheight : _height || null;
			_width = (_defined(_pwidth)) ? _pwidth : _width || null;
			_top = (_defined(_ptop)) ? _ptop : _top || null;
			_right = (_defined(_pright)) ? _pright : _right || null;
			_bottom = (_defined(_pbottom)) ? _pbottom : _bottom || null;
			_left = (_defined(_pleft)) ? _pleft : _left || null;
			*/
			
			_reference = (_defined(params.reference)) ? params.reference : window;
			
			for (var i=0, len=_paramsMap.length; i<len; i++){
				var _param = params[_paramsMap[i][1]];
				_paramsMap[i][0] = (_defined(_param)) ? _param : _paramsMap[i][0] || null;
			}
			
		};
		
		_this.refresh = function () {
			/*
			if(_height !== null) $(_box).height(_parseParam(_height, _CONST.HEIGHT, _reference));
			if(_width !== null) $(_box).width(_parseParam(_width, _CONST.WIDTH, _reference));
			
			if(_top !== null) $(_box).css('top', _parseParam(_top, _CONST.HEIGHT, _reference));
			if(_right !== null) $(_box).css('right', _parseParam(_right, _CONST.WIDTH, _reference));
			if(_bottom !== null) $(_box).css('bottom', _parseParam(_bottom, _CONST.HEIGHT, _reference));
			if(_left !== null) $(_box).css('left', _parseParam(_left, _CONST.WIDTH, _reference));
			*/
			for(var i=0, len=_paramsMap.length; i<len; i++){
				if(_paramsMap[i][0] !== null){
					$(_box).css(
						_paramsMap[i][1]
						, _parseParam(
							_paramsMap[i][0]
							, _paramsMap[i][2]
							, _reference
						)
					);
				}
			}
		};
		
		_this.setAndRefresh = function ( params ) {
			_this.setParams(params);
			_this.refresh();
		};
		
		_this.stop = function () {
			$(window).unbind("resize", _this.refresh);
		};
		
		/* BEGIN DEV PUBLICS  - REMOVE */
		_this.params = function(){
			return {
					height: _height
				, width: _width
				, top: _top
				, right: _right
				, bottom: _bottom
				, left: _left
			};
		};
		/* END DEV PUBLICS */
		
		if( typeof(params) !== "undefined" ){ _this.setParams(params); }
		$(window).ready(_this.refresh);
		$(window).resize(_this.refresh);
		
		return _this;
	}
	
	Box.CONSTANTS = _CONST;
	Box.calculate = _parseStringMath;
	
	/* BEGIN DEV PUBLICS  - REMOVE */
	Box.tests = function () {
		//console.assert(_parseParam("((200% + 10px) / 4) + 5 + (100% + 20)", _CONST.HEIGHT) === ???);
	}
	/* END DEV PUBLICS */
	
	return Box;
})();
