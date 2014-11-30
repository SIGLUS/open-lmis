/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

var vaccine = angular.module('vaccine', ['openlmis', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
       // when('/distribution-batch', {controller: VaccineReceiveSearchController, templateUrl: 'partials/vaccine-receive-search.html'}).
        when('/receive', {controller: VaccineReceiveSearchController, templateUrl: 'partials/vaccine-receive-search.html'}).
        //when('/distribution-batch-filter', {controller: VaccineDistributionFilterController, templateUrl: 'partials/vaccine-distribution-filter.html'}).
        when('/create-receive-vaccine/:facilityId', {controller: VaccineReceiveController, templateUrl: 'partials/vaccine-receive-edit.html'}).
       // when('/edit-distribution-batch/:distributionBatchId', {controller: VaccineReceiveController, templateUrl: 'partials/vaccine-receive-edit.html', resolve:VaccineReceiveController.resolve}).
        when('/targets', {controller: VaccineTargetController, templateUrl: 'partials/vaccine-targets.html'}).
        when('/targetEdit/:id', {controller: VaccineTargetController, templateUrl: 'partials/vaccine-targets-edit.html'}).
        when('/vaccine-storage', {controller: VaccineStorageController, templateUrl: 'partials/vaccine-storage.html'}).
        when('/targets', {controller: VaccineTargetController, templateUrl: 'partials/vaccine-targets.html'}).
        when('/targetEdit/:id', {controller: VaccineTargetController, templateUrl: 'partials/vaccine-targets-edit.html'}).
        when('/quantification', {controller: VaccineQuantificationController, templateUrl: 'partials/vaccine-quantification.html'}).
        when('/quantificationEdit/:id', {controller: VaccineQuantificationController, templateUrl: 'partials/vaccine-quantification-edit.html'}).
        when('/manufacturer', {controller: VaccineManufacturerController, templateUrl: 'partials/vaccine-manufacturer.html'}).
        when('/manufacturerEdit/:id', {controller: VaccineManufacturerController, templateUrl: 'partials/vaccine-manufacturer-edit.html'}).
        when('/productMappingEdit/:manufacturerId/:productId', {controller: VaccineProductMappingController, templateUrl: 'partials/vaccine-product-mapping.html'}).
        when('/productMappingCreate/:manufacturerId', {controller: VaccineProductMappingController, templateUrl: 'partials/vaccine-product-mapping.html'}).
        otherwise({redirectTo: '/receive'});
}]).directive('onKeyup', function () {
        return function (scope, elm, attrs) {
            elm.bind("keyup", function () {
                scope.$apply(attrs.onKeyup);
            });
        };
});