# Usage

1. Import jb-backoffice-menu.js

  ```html
  <script src="bower_components/jb-backoffice-menu/src/jb-backoffice-menu.js"></script>
  ```

1. Create controller

	```javascript
	angular
	.module( 'myModule', [] )
	.controller( 'myController', [ '$scope', function( $scope ) {

		$scope.menu = [ {
			entity			: 'event'
			, icon			: 'fa-calendar'
			, children		: [ {
				entity		: 'category'
			} ]
		}, {
			entity			: 'tag'
			, icon			: 'fa-tag'
		} ];

	} ] );
	```

1. Attach controller and directive to DOM, pass menu object as an argument:

  ```html
	<div data-ng-controller="myController">
		<div data-backoffice-menu data-backoffice-menu-source="menu"></div>
	</div>
  ```