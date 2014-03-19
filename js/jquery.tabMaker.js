// the semi-colon before the function invocation is a safety  
// net against concatenated scripts and/or other plugins  
// that are not closed properly. 
;(function ($, window, document, undefined) {

// undefined is used here as the undefined global      
// variable in ECMAScript 3 and is mutable (i.e. it can      
// be changed by someone else). undefined isn't really      
// being passed in so we can ensure that its value is      
// truly undefined. In ES5, undefined can no longer be      
// modified. 

// window and document are passed through as local      
// variables rather than as globals, because this (slightly)      
// quickens the resolution process and can be more      
// efficiently minified (especially when both are      
// regularly referenced in your plugin)

	$.fn.tabMaker = function (options) {

		// plugin's default options
        // this is private property and is accessible only from inside the plugin
		var defaults = {
			'accordionHeader'	: '.accordionHeader', //indenture class for section
			'accordionHolder'	: '.accordionHolder', //indenture class for content
			'openContent' 		: 'openContent', //class for active content
			'inactiveHeader'	: 'closed', //class for inactive section
			'activeHeader'		: 'opened', //class for active section
			'orientaion' 		: 'vertical', //horizontal or vertical
			'slideSpeed'		: 350,
			'openElement'		: false,
			'onClose'			: function(element) {

			},
			'onOpen'			: function(element) {

			}
		},
		tabMaker = {};
		
		// this will hold the merged default, and user-provided options
        tabMaker.settings = {};

		// make target element available throughout the plugin
		// by making it a public property
		tabMaker.container = this;
		
		
		// the "constructor" method that gets called when the object is created
        // this is a private method, it can be called only from inside the plugin
        var create = function() {

            // the final properties are the merged default and user-provided options
            tabMaker.settings = $.extend({}, defaults, options);
			
			tabMaker.init();
			tabMaker.bind();
        },		
		getSettings = function (str) {
		
			var scope = tabMaker.settings,
				properties = str.split('.');
				
			scope.section = $(tabMaker.settings.accordionHeader, tabMaker.container);
			scope.content = $(tabMaker.settings.accordionHolder, tabMaker.container);
			scope.currentActiveSection = $('.' + tabMaker.settings.activeHeader, tabMaker.container);

			for (var i = 0; i < properties.length; i++) {
				scope = scope[properties[i]];
			}
			
			return scope;	
		};
		
		//initialization code
		tabMaker.init = function () {
			//Add Inactive Class To All Accordion Headers
			$(getSettings('section'))
			.addClass(getSettings('inactiveHeader'))
			.removeClass(getSettings('activeHeader'));

			//Open The Accordion Section When Page Loads
			if ( getSettings('openElement') !== false ) {
				
				// find section
				getSettings('section').eq(getSettings('openElement'))
				.addClass(getSettings('activeHeader'))
				.removeClass(getSettings('inactiveHeader'));
				
				// find content
				getSettings('content').eq(getSettings('openElement'))
				.slideDown()
				.addClass(getSettings('openContent'));
			
			}
		};
		
		// bind events to this instance's methods
		tabMaker.bind = function () {
			// Handle click event	
			getSettings('section').on('click', function(event) {

				var $clickedElement = $(event.currentTarget);
				
				if ( $clickedElement.is('.' + getSettings('inactiveHeader')) ) { //check if clicked element is currently inactive
					//close currently active
					tabMaker.transitions({
						'target' : getSettings('currentActiveSection'),
						'callback' : 'onClose'
					});
					
					//open clicked element
					tabMaker.transitions({
						'target' : $clickedElement,
						'callback' : 'onOpen'
					});
				}
			});
		};

		tabMaker.transitions = function(param) {
			var $content = '';
			
			if ( getSettings('orientaion') == "vertical" ) {
				$content = $(param.target).next();
			}
			
			if ( getSettings('orientaion') == "horizontal" ) {
				var index = $(param.target).index();
				$content = getSettings('content').eq(index);
			}
			
			$(param.target) //target section 
				.toggleClass(getSettings('activeHeader')) //Add or remove active class  from section
				.toggleClass(getSettings('inactiveHeader')) //Add or remove inactive classes from section

			$content	//target content 
				.toggleClass(getSettings('openContent')) //Add or remove open class from content
				.slideToggle(getSettings('slideSpeed'), getSettings(param.callback).call(this, param.target)); //Display or hide the matched elements with a sliding motion			
        };
		
		// call the "constructor" method
        create();

	//	return false;
	}
}(jQuery, window, document));