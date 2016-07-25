function LastSyncTimeReportController($scope, $http, GeographicZoneService, CubesGenerateUrlService, CubesGenerateCutParamsService, DateFormatService) {

  $scope.provinces = [];
  $scope.districts = [];
  $scope.tree_data = [];
  $scope.col_defs = [{
    field: 'LastSyncTime',
    cellTemplate: '<div ng-if=\'row.branch[col.field] \'>' +
                    '<span class=\'circle-icon\' ng-style=\'cellTemplateScope.checkLastSyncDate(row.branch[col.field])\'> </span>' +
                    '<span>{{row.branch[col.field]}}</span>' +
                    '</div>',
    cellTemplateScope: {
      checkLastSyncDate: function(date) {
        var syncInterval = (new Date() - new Date(date)) / 1000 / 3600;
        return syncInterval <= 24 && {'background-color': 'green'} ||
            syncInterval > 24 * 3 && {'background-color': 'red'} ||
            {'background-color': 'orange'};
      }
    }
  }];

  $scope.$on('$viewContentLoaded', function () {
    loadGeographicZonesBasedOnUserProfile();
  });

  function loadGeographicZonesBasedOnUserProfile() {
    GeographicZoneService.loadGeographicZone().get({}, function(zoneData) {
      _.forEach(zoneData['geographic-zones'], function(zone) {
        if (zone.levelCode == 'province') {
          $scope.provinces.push(zone);
        } else if (zone.levelCode == 'district') {
          $scope.districts.push(zone);
        }
      });
    });
  }


  function loadSyncTimeData() {
    var cutsParams;
    if($scope.provinces.length > 1) {
      cutsParams = CubesGenerateCutParamsService.generateCutsParams(undefined, undefined, undefined,
          undefined, undefined, undefined, undefined);
    } else if ($scope.districts.length > 1) {
      cutsParams = CubesGenerateCutParamsService.generateCutsParams(undefined, undefined, undefined,
          undefined, undefined, $scope.provinces[0], undefined);
    } else {
      cutsParams = CubesGenerateCutParamsService.generateCutsParams(undefined, undefined, undefined,
          undefined, undefined, $scope.provinces[0], $scope.districts[0]);
    }

    $http.get(CubesGenerateUrlService.generateFactsUrl('vw_sync_time', cutsParams)).success(function(data){
      buildTreeData(data);
      var lessThan1DayCount = 0;
      var lessThan3DaysCount = 0;
      var moreThan3DaysCount = 0;
      var currentTime = new Date();
      var oneDay = 86400000;
      var threeDay = 259200000;

      _.forEach(data, function (item) {
        var interval = currentTime - new Date(item.last_sync_time);
        if (interval < oneDay) {
          lessThan1DayCount++;
        } else if (interval > threeDay) {
          moreThan3DaysCount++;
        } else {
          lessThan3DaysCount++;
        }
      });
      drawDonutChart(lessThan1DayCount, lessThan3DaysCount, moreThan3DaysCount);
    });
  }

  function buildTreeData(syncTimeData) {
    _.forEach($scope.provinces, function(province) {
      var provinceItem = {
        Name: province.name,
        LastSyncTime: '',
        children: []
      };
      _.forEach($scope.districts, function(district) {
        if (province.id === district.parentId) {
          var districtItem = {
            Name: district.name,
            LastSyncTime: '',
            children: []
          };
          _.forEach(syncTimeData, function(facilityData) {
            if (facilityData['location.district_code'] === district.code && facilityData['location.province_code'] === province.code) {
              var facilityItem = {
                Name: facilityData['facility.facility_name'],
                LastSyncTime: facilityData.last_sync_time
              };
              districtItem.children.push(facilityItem);
            }
          });
          provinceItem.children.push(districtItem);
        }
      });
      $scope.tree_data.push(provinceItem);
    });
  }

  function drawDonutChart(lessThan1DayCount, lessThan3DaysCount, moreThan3DaysCount) {
    AmCharts.makeChart('sync-time-chart', {
      'type': 'pie',
      'theme': 'light',
      'dataProvider': [
        {
          'title': lessThan1DayCount + ' Health facilities last updated in the last 24 hours',
          'value': lessThan1DayCount
        },
        {
          'title': lessThan3DaysCount + ' Health facilities last updated in the last 3 days',
          'value': lessThan3DaysCount
        },
        {
          'title': moreThan3DaysCount + ' Health facilities last updated more than 3 days ago',
          'value': moreThan3DaysCount
        }
      ],
      'legend': {
        'position': 'right',
        'valueText': ''
      },
      'titleField': 'title',
      'valueField': 'value',
      'labelRadius': 5,
      'radius': '40%',
      'innerRadius': '60%',
      'labelText': '[[]]'
    });
  }

  $scope.formatDateWithDay = function (dateString) {
    return 'abc';
    //return DateFormatService.formatDateWithLocale(dateString);
  };


}