<?php
/*     
 *   ajaxResult[i][0] = database id
     ajaxResult[i][1] = name
     ajaxResult[i][2] = address
     ajaxResult[i][3] = suburb
     ajaxResult[i][4] = postcode
     ajaxResult[i][5] = phone
     ajaxResult[i][6] = latitude
     ajaxResult[i][7] = longitude
     ajaxResult[i][8] = description
     ajaxResult[i][9] = service_type
 * 
 * 
 * emotion table
 * 1 - afraid
 * 2 - sad
 * 3 - depressed
     */

class SearchLocation
{    
    public function getSQL($lat, $lng, $rad)
    {
        //$rad = 2;//radius of bounding circle in km
        $R = 6371;//radius of earth
        
        $maxLat = $lat + rad2deg($rad/$R);
        $minLat = $lat - rad2deg($rad/$R);
        $maxLng = $lng + rad2deg(asin($rad/$R) / cos(deg2rad($lat)));
        $minLng = $lng - rad2deg(asin($rad/$R) / cos(deg2rad($lat)));
        
        $latLng = [$maxLat,$minLat,$maxLng,$minLng];
        return $latLng;
    }
}
?>