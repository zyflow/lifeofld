<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['namespace' => 'API'], function() {
	Route::resource('user', 'UserController', []);
	Route::get('available-citizens', 'CitizenController@avilableCitizens', []);
	Route::resource('supplier', 'SupplierController', []);
	Route::resource('project-status-settings', 'ProjectStatusSettingsController', []);

	Route::resource('citizen', 'CitizenController', []);
	Route::resource('inventory', 'InventoryController', []);
	Route::resource('notification', 'NotificationController', []);
	Route::resource('inventory-name', 'CommuneSetup\InventoryNameController', []);
	Route::resource('rental-price', 'CommuneSetup\RentalPriceController', []);
	Route::resource('commune', 'CommuneController', []);
	Route::get('commune/{kommune_id?}', 'CommuneController@index', []);
	Route::get('commune-setup', 'CommuneSetupController@index', []);
	Route::post('commune-setup', 'CommuneSetupController@store', []);
	Route::get('search', 'SearchController@index', []);

//	Route::resource('setting-status', 'SettingStatusController', []);

});

