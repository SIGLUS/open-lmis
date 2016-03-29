function StockOutSingleProductReportController($scope, $filter, $controller, $http, CubesGenerateUrlService, messageService, $routeParams, ProductReportService) {
    $controller('BaseProductReportController', {$scope: $scope});

    $scope.expanding_property = {
        field: "name",
        displayName: " "
    };

    $scope.col_defs = [
        {
            field: "monthlyAvg",
            displayName: messageService.get('report.stock.out.avg.duration')
        },
        {
            field: "monthlyOccurrences",
            displayName: messageService.get('report.stock.out.occurrences')
        },
        {
            field: "totalDuration",
            displayName: messageService.get('report.stock.out.total')
        }, {
            field: "incidents",
            displayName: messageService.get('report.stock.out.incidents')
        }
    ];

    $scope.getTimeRange = function (dateRange) {
        $scope.reportParams.startTime = dateRange.startTime;
        $scope.reportParams.endTime = dateRange.endTime;
    };

    $scope.$on('$viewContentLoaded', function () {
        $scope.loadProducts();
        $scope.loadHealthFacilities();
    });

    $scope.loadProducts = function () {
        ProductReportService.loadAllProducts().get({}, function (data) {
            $scope.products = data.products;
            $scope.reportParams.productCode = $routeParams.code;
        });
    };

    $scope.loadReport = function () {
        if ($scope.checkDateValidRange()) {
            $scope.selectedProduct = getProductByCode($scope.reportParams.productCode);
            getStockOutDataFromCubes();
        }
    };

    function getProductByCode(code){
        return _.find($scope.products, function(product){
            return product.code === code;
        });
    }

    function getStockReportRequestParam() {
        var params = {};
        params.startTime = $filter('date')($scope.reportParams.startTime, "yyyy,MM,dd");
        params.endTime = $filter('date')($scope.reportParams.endTime, "yyyy,MM,dd");
        params.drugCode = $scope.reportParams.productCode;
        return params;
    }

    function generateCutParams(stockReportParams) {
        var cutsParams = [{
            dimension: "overlapped_date",
            values: [stockReportParams.startTime + "-" + stockReportParams.endTime]
        }];

        cutsParams.push({dimension: "drug", values: [stockReportParams.drugCode]});
        return cutsParams;
    }

    function getStockOutDataFromCubes() {
        if (!validateProduct()) {
            return;
        }

        $http.get(CubesGenerateUrlService.generateFactsUrl('vw_stockouts', generateCutParams(getStockReportRequestParam())))
            .success(function (data) {
                $scope.tree_data = generateStockOutData(data);
            });
    }

    function validateProduct() {
        $scope.invalid = !$scope.reportParams.productCode;
        return !$scope.invalid;
    }

    function generateStockOutData(data) {
        var groupByProvince = _.groupBy(data, 'location.province_code');

        var provinceData = [];
        _.forEach(groupByProvince, function (province) {
            var provinceNameKey = 'location.province_name';
            var numOfSelectedFacilities = getNumOfSelectedFacilities(province[0]['location.province_code']);
            var provinceResult = calculateStockOut(province, provinceNameKey, numOfSelectedFacilities);

            var districts = _.groupBy(province, 'location.district_code');

            provinceResult.children = generateProvinceChildren(districts);
            provinceData.push(provinceResult);
        });
        return provinceData;
    }

    function generateProvinceChildren(districts) {
        var provinceChildrenArray = [];
        _.forEach(districts, function (district) {
            var districtNameKey = 'location.district_name';
            var numOfSelectedFacilities = getNumOfSelectedFacilities(district[0]['location.province_code'], district[0]['location.district_code']);
            var districtResult = calculateStockOut(district, districtNameKey, numOfSelectedFacilities);

            var facilities = _.groupBy(district, 'facility.facility_code');

            districtResult.children = generateDistrictChildren(facilities);
            provinceChildrenArray.push(districtResult);
        });
        return provinceChildrenArray;
    }

    function generateDistrictChildren(facilities) {
        var districtChildren = [];
        _.forEach(facilities, function (facility) {
            var facilityResult = calculateStockOut(facility, 'facility.facility_name', 1);
            districtChildren.push(facilityResult);
        });
        return districtChildren;
    }

    function getNumOfSelectedFacilities(provinceCode, districtCode) {
        var province = getGeographicZoneByCode($scope.provinces, provinceCode);
        var district = getGeographicZoneByCode($scope.districts, districtCode);
        var districtId = district ? district.id : "";
        return FacilityFilter()($scope.facilities, $scope.districts, districtId, province.id).length;
    }

    function getGeographicZoneByCode(zones, zoneCode) {
        return _.find(zones, function(zone){
            return zone.code == zoneCode;
        });
    }

    function generateReportItem(name, totalDuration, monthlyAvg, monthlyOccurrences, incidents) {
        return {
            'name': name,
            'monthlyAvg': monthlyAvg,
            'monthlyOccurrences': monthlyOccurrences,
            'totalDuration': totalDuration,
            'incidents': incidents
        };
    }

    function generateIncidents(incidents,stockOut, numOfSelectedFacilities) {
        if (numOfSelectedFacilities === 1) {
            var incident = stockOut['stockout.date'] + "to" + stockOut['stockout.resolved_date'];
            if (incidents.indexOf(incident) === -1) {
                incidents += incidents === "" ? incident : ", " + incident;
            }
        }
        return incidents;
    }

    function calculateStockOut(groupValue, name, numOfSelectedFacilities) {
        var sumAvg = 0;
        var totalOccurrences = 0;
        var totalDuration = 0;
        var incidents = "";
        var groupByOverlapMonth = _.groupBy(groupValue, "overlapped_month");

        _.forEach(groupByOverlapMonth, function (drug) {
            var sum = 0;
            _.forEach(drug, function (stockOut) {
                sum += stockOut.overlap_duration;
                incidents = generateIncidents(incidents,stockOut, numOfSelectedFacilities);
            });
            sumAvg += sum / drug.length;
            totalOccurrences += drug.length;
            totalDuration += sum;
        });

        var monthlyAvg = $filter('number')(sumAvg / Object.keys(groupByOverlapMonth).length / numOfSelectedFacilities, 1);
        var monthlyOccurrences = $filter('number')(totalOccurrences / Object.keys(groupByOverlapMonth).length / numOfSelectedFacilities, 1);

        return generateReportItem(groupValue[0][name], totalDuration, monthlyAvg, monthlyOccurrences, incidents);
    }
}