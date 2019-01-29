<?php

namespace App\Http\Controllers;

use App\ProjectStatusSetting;

class SettingsController extends Controller
{
    public function index() {
        $settings = ProjectStatusSetting::all();


        return view('dashboard/settings', compact('settings'));
    }

	public function authorizeGoogle()
	{
		session_start();

		$client = new \Google_Client();
		$client->setApplicationName('Sample Content API application');
		$client->setClientId('558535843070-dh0ost34n033q095hkqiq1s5gfn7afb4.apps.googleusercontent.com');
		$client->setClientSecret('CDwIP7w9bXgm-pHs4QgTLWvO');
		$client->setRedirectUri('http://lifeofld.localhost.com');
		$client->setScopes('https://www.googleapis.com/auth/calendar.events');

		if (isset($_SESSION['oauth_access_token'])) {
			\Log::info('IR ');
			\Log::info($_SESSION['oauth_access_token']);
			\Log::info('-----------');
			$client->setAccessToken($_SESSION['oauth_access_token']);
		} elseif (isset($_GET['code'])) {
			\Log::info('IR2 ');

			$token = $client->authenticate($_GET['code']);
			$_SESSION['oauth_access_token'] = $token;
		} else {
			header('Location: ' . $client->createAuthUrl());
			exit;
		}

	}

}
