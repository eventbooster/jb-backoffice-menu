( function() {

	'use strict';

	angular
	.module( 'jb.backofficeMenu', [ 'ui.router' ] )

	.directive( 'backofficeMenu', [ '$location', function( $location ) {

		return {
			templateUrl			: 'backofficeMenuTemplate.html'
			, controller		: 'BackofficeMenuDirectiveController'
			, controllerAs		: 'backofficeMenu'
			, bindToController	: true
			, link				: function( scope, element, attrs, ctrl ) {
				
				ctrl.init( element );

			}
			, scope			: {
				source		: '@'
			}
		};

	} ] )

	.controller( 'BackofficeMenuDirectiveController', [ '$http', '$q', '$state', function( $http, $q, $state ) {

		var _element
			, _menuData = []
			, self = this;

		self.init = function( el ) {
			_element = el;
			self.fetchMenuData();
		};


		self.hasChildren = function( menuItem ) {
			return menuItem && menuItem.children && menuItem.children.length ? true : false;
		};


		/**
		* Returns true if menuItem is active.
		*/
		self.isOpen = function( menuItem ) {

			if( $state.current.name !== 'app.list' && $state.current.name !== 'app.detail' ) {
				return false;
			}

			var currentEntityName = $state.params.entityName;

			if( menuItem.entity === currentEntityName ) {
				console.log( 'BackofficeMenu: Item %o is open', menuItem );
				return true;
			}

			// No children
			if( !menuItem.children || !menuItem.children.length ) {
				return false;
			}

			// Test for children. Make sure we return before, if there ain't any children.
			var inChildren = false;
			menuItem.children.some( function( child ) {
				if( child.entity === currentEntityName ) {
					inChildren = true;
					return true;
				}
			} );
			return inChildren;

		};


		self.getMenuData = function() {
			return _menuData;
		};


		/**
		* Fetches menu's data from config file (who's path is passed to component through source)
		*/
		self.fetchMenuData = function() {

			console.log( 'BackofficeMenuDirectiveController: Get menu data from ' + self.source );

			return $http.get( self.source )
				.then( function( res ) {

					if( !res.status || res.status !== 200 ) {
						return $q.reject( new Error( 'Backoffice Menu: Invalid state :' + res.status ) );
					}

					if( !angular.isArray( res.data ) ) {
						return $q.reject( new Error( 'Backoffice Menu: Menu data gotten from file ' + self.source + ' is not an array.' ) );
					}

					_menuData = res.data;

					console.log( 'BackofficeMenuDirectiveController: Data successfully loaded from ' + self.source + ': %o', _menuData );

					return _menuData;

				} )
				.catch( function ( err ) {
					console.error( 'BackofficeMenuDirectiveController: Could not get menu data from ' + self.source + ': ' + JSON.stringify( err ) );
				} );

		};


	} ] )

	.run( function( $templateCache ) {

		$templateCache.put( 'backofficeMenuTemplate.html',
			'<ul class=\'menu\'>' +
				'<li data-ng-class=\'{ parent: backofficeMenu.hasChildren( item ), active: backofficeMenu.isOpen( item ) }\' data-ng-repeat=\'item in backofficeMenu.getMenuData()\'>' +
					'<a href=\'#\' data-ui-sref=\'app.list({ entityName: item.entity })\'>' +
						'<span class=\'menu-icon\'><i class=\'fa\' data-ng-class=\'item.icon\'></i></span>' +
						'<span class=\'menu-text\' data-translate=\'web.backoffice.menu.{{ item.entity }}\'></span>' +
					'</a>' +
					'<ul class=\'child\' data-ng-if=\'backofficeMenu.hasChildren( item ) && backofficeMenu.isOpen( item )\'>' +
						'<li data-ng-repeat=\'subItem in item.children\'>' +
							'<a href=\'#\' data-ui-sref=\'app.list({ entityName: subItem.entity })\' data-translate=\'web.backoffice.menu.{{ subItem.entity }}\'></a>' +
						'</li>' +
					'</ul>' +
				'</li>' +
			'</ul>'
		);

	} );


} )();

