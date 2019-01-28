<?php

namespace App\Http\Controllers;

use App\ProjectStatusSetting;

class SettingsController extends Controller
{
    public function index() {
        $settings = ProjectStatusSetting::all();


        return view('dashboard/settings', compact('settings'));
    }
}
