angular
.module( 'jb.backofficeMenu', [] )

.controller( 'BackofficeMenuDirectiveController', [ '$scope', '$location', function( $scope, $location ) {

	$scope.currentEntity = $location.path().split( '/' )[ 1 ];

	var self			= this
		, element;

	self.init = function( el ) {
		element = el;
	};

} ] )

.directive( 'backofficeMenu', [ function() {

	return {
		templateUrl		: 'backofficeMenuTemplate.html'
		, controller	: 'BackofficeMenuDirectiveController'
		, link			: function( scope, element, attrs, ctrl ) {
			
			ctrl.init( element );

		}
		, scope			: {
			backofficeMenuSource	: '='
		}
	};

} ] )

.run( function( $templateCache ) {

	$templateCache.put( 'backofficeMenuTemplate.html',
		'<ul class=\'menu\'>' +
			'<li class=\'parent\' data-ng-repeat=\'item in backofficeMenuSource\'>' +
				'<a data-ng-attr-href=\'#{{ item.entity }}\'>' +
					'<span class=\'menu-icon\'><i class=\'fa\' data-ng-class=\'item.icon\'></i></span>' +
					'<span class=\'menu-text\' data-translate=\'web.backoffice.menu.{{ item.entity }}\'></span>' +
				'</a>' +
				'<ul class=\'child\' data-ng-repeat=\'subItem in item.children\' data-ng-hide=\'currentEntity !== item.entity\'>' +
					'<li><a data-ng-attr-href=\'#{{ subItem.entity }}\' data-translate=\'web.backoffice.menu.{{ subItem.entity }}\'></a></li>' +
				'</ul>' +
			'</li>' +
		'</ul>'
	);

} );
