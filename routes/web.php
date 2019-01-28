<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth

Auth::routes();
Route::get('/', 'Auth\LoginController@checkLogin');
Route::get('/logout', 'Auth\LoginController@logout');

// Main

//Route::get('/notifications', 'StatisticsController@notifications');
//Route::get('/get-municipalities', 'StatisticsController@municipalities');
////Route::get('/get-inventories', 'StatisticsController@inventories');
//Route::get('/get-users', 'StatisticsController@users');

// Dashboard

Route::get('/home', 'DashboardController@index');

Route::post('/update-citizen/{id}', 'DashboardController@updateCitizen');

Route::post('/save-municipality', 'DashboardController@saveMunicipality');
Route::post('/update-municipality/{id}', 'DashboardController@updateMunicipality');
Route::post('/remove-municipality/{id}', 'DashboardController@removeMunicipality');

Route::post('/save-inventory', 'DashboardController@saveInventory');
Route::post('/update-inventory/{id}', 'DashboardController@updateInventory');
Route::post('/remove-inventory/{id}', 'DashboardController@removeInventory');

Route::get('/dashboard-counter', 'DashboardCounterController@index');

Route::resource('citizen', 'CitizenController', []);
Route::get('/commune/{?kommune_id}', 'CommuneController@index');
Route::resource('commune', 'CommuneController', []);


Route::resource('project', 'ProjectController', []);
Route::resource('managers', 'ManagerController', []);
Route::resource('contact-person', 'ContactPersonController', []);

//Route::get('/get-citizens-data', 'StatisticsController@citizensData');

// User Admin

Route::get('/user-admin', 'UserController@index')
		->middleware('can:view-users');

Route::post('/save-user', 'userController@saveUser');
Route::post('/remove-user/{id}', 'UserController@removeUser');

// Settings

Route::get('/settings', 'SettingsController@index');

Route::get('/commune-setup', 'CommuneSetupController@index');
//Route::get('/kommune-setup', function () {
//    return view('dashboard.kommune');
//});

Route::get('/budget-import', function () {
    return view('dashboard.budget');
});

Route::get('/export-til-economic', function () {
    return view('dashboard.export');
});
