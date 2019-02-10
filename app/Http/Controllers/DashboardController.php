<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests\CitizenRequest;
use App\Http\Requests\ProjectDatesRequest;
use App\Http\Requests\MunicipalitiesRequest;
use App\Http\Requests\InventoryRequest;
use App\Citizens;
use App\ProjectDates;
use App\Projects;
use App\ProjectManagers;
use App\Communes;
use App\Inventory;
use App\Suppliers;
use Auth;
use Spatie\GoogleCalendar\Event;
use Validator;
use Storage;
use DB;

use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Google_Service_Calendar_EventDateTime;

class DashboardController extends Controller {
	public function __construct()
	{
		$this->middleware('auth');
		$this->citizen_fields = ['name', 'surname', 'cpr', 'address', 'email', 'mobile', 'group', 'kommune'];

		$this->fields_municipality = ['name', 'surname', 'cpr', 'address', 'email', 'mobile', 'bank_account', 'region', 'contact_person', 'group'];

		$this->fields_project = ['citizen_id', 'kommune_id', 'project_status', 'project_manager_id', 'project_activity', 'liggetid', 'meeting_days'];
		$this->fields_project_dates = ['start', 'first_contact', 'meeting', 'commenced', 'material_sent_subject', 'material_sent_municipality', 'invoice', 'return'];

		$this->fields_inventory = ["name", "cost_price", "sales_price", "rental_price", "stock_lock", "qty", "supplier_id"];

		$client = new Google_Client();
		$client->setAuthConfig(storage_path('client_secret.json'));
		$client->addScope(Google_Service_Calendar::CALENDAR);
		$guzzleClient = new \GuzzleHttp\Client(['curl' => [CURLOPT_SSL_VERIFYPEER => false]]);
		$client->setHttpClient($guzzleClient);
		$this->client = $client;

	}


	/**
	 * Returns an authorized API client.
	 * @return Google_Client the authorized client object
	 */
	function getClient()
	{
		$client = new \Google_Client();
		define('STDIN', fopen("php://stdin", "r"));
		$client->setRedirectUri('http://lifeofld.localhost.com');

		$client->setApplicationName('Google Calendar API PHP Quickstart');
		$client->setScopes(\Google_Service_Calendar::CALENDAR);

		$client->setAuthConfig('secret.json');
		$client->setApplicationName('Sample Content API application');
		$client->setClientId('558535843070-dh0ost34n033q095hkqiq1s5gfn7afb4.apps.googleusercontent.com');
		$client->setClientSecret('CDwIP7w9bXgm-pHs4QgTLWvO');
		$client->setRedirectUri('http://lifeofld.localhost.com');
		$client->setScopes('https://www.googleapis.com/auth/content');

		$guzzleClient = new \GuzzleHttp\Client([
													   'curl' => [
															   CURLOPT_SSL_VERIFYPEER => false,
													   ],
											   ]);
		$client->setHttpClient($guzzleClient);

		$client->setAccessType('offline');
		$client->setPrompt('select_account consent');

		// Load previously authorized token from a file, if it exists.
		// The file token.json stores the user's access and refresh tokens, and is
		// created automatically when the authorization flow completes for the first
		// time.
//		$tokenPath = 'token.json';
//		if (file_exists($tokenPath)) {
//			$accessToken = json_decode(file_get_contents($tokenPath), true);
//			$client->setAccessToken($accessToken);
//		}

		// If there is no previous token or it's expired.
		if ($client->isAccessTokenExpired())
		{
			// Refresh the token if possible, else fetch a new one.

			if ($client->getRefreshToken())
			{
				$client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
			}
			else
			{
				// Request authorization from the user.
				$authUrl = $client->createAuthUrl();
//				dd($authUrl);
				printf("Open the following link in your browser:\n%s\n", $authUrl);
				print 'Enter verification code: ';
				$authCode = trim(fgets(STDIN));

				$authCode = 'CDwIP7w9bXgm-pHs4QgTLWvO';

				// Exchange authorization code for an access token.
				$accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
				$client->setAccessToken($accessToken);

				// Check to see if there was an error.
				if (array_key_exists('error', $accessToken))
				{
					throw new Exception(join(', ', $accessToken));
				}
			}
			// Save the token to a file.
			if (!file_exists(dirname($tokenPath)))
			{
				mkdir(dirname($tokenPath), 0700, true);
			}
			file_put_contents($tokenPath, json_encode($client->getAccessToken()));
		}
		return $client;
	}


	public function index5()
	{
		session_start();
		if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
		{
			$this->client->setAccessToken($_SESSION['access_token']);
			$service = new Google_Service_Calendar($this->client);
			$calendarId = 'primary';
			$results = $service->events->listEvents($calendarId);
			return $results->getItems();
		}
		else
		{
			return redirect()->route('oauthCallback');
		}
	}


	public function oauth()
	{
		session_start();
		$rurl = action('gCalendarController@oauth');
		$this->client->setRedirectUri($rurl);
		if (!isset($_GET['code']))
		{
			$auth_url = $this->client->createAuthUrl();
			$filtered_url = filter_var($auth_url, FILTER_SANITIZE_URL);
			return redirect($filtered_url);
		}
		else
		{
			$this->client->authenticate($_GET['code']);
			$_SESSION['access_token'] = $this->client->getAccessToken();
			return redirect()->route('cal.index');
		}
	}


	public function index()
	{
		$client = new \Google_Client();
		$client->setAuthConfig(public_path('secret.json'));
		$client->setAccessType("offline");        // offline access
		$client->setIncludeGrantedScopes(true);   // incremental auth
		$client->addScope(\Google_Service_Calendar::CALENDAR_EVENTS_READONLY);
		$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback');

		$client->setIncludeGrantedScopes(true);
		$client->setIncludeGrantedScopes(true);   // incremental auth

		$auth_url = $client->createAuthUrl();
		header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
	}


	public function index2(Request $request)
	{


		dd('asd');

		$lang = $request->get('lang');
		if ($lang)
		{
			\App::setLocale($lang);
			\Session::put('locale', $lang);
		}

		$user = Auth::user();
		$managers = ProjectManagers::all();
//        $statuses = ProjectStatuses::all();
		$municipalities = Communes::all();
		$inventories = Inventory::all();
		$suppliers = Suppliers::all();

		return view('dashboard/index', compact(
											 'user',
											 'managers',
											 'statuses',
											 'municipalities',
											 'inventories',
											 'suppliers')
		);
	}


	public function removeCitizen($id)
	{
		Citizens::findOrFail($id)->delete();
	}


	public function updateMunicipality(MunicipalitiesRequest $request, $id)
	{
		$municipality = Communes::findOrFail($id);
		$input_municipality = [];

		foreach ($this->fields_municipality as $value)
		{
			$input_municipality[$value] = $request->$value;
		}

		$municipality->update($input_municipality);
	}


	public function removeMunicipality($id)
	{
		$user = Auth::user();
		$have_citizens = ["This municipality is assigned to citizens:"];

		if ($user->admin === 1)
		{
			$citizens = Citizens::all();
		}
		else
		{
			$citizens = Citizens::where('user_id', '=', $user->id)->get();
		}

		foreach ($citizens as $citizen)
		{

			if ($citizen->kommune === $id)
			{
				array_push($have_citizens, $citizen->name . " " . $citizen->surname);
			}
		}

		if (count($have_citizens) > 1)
		{
			return response()->json(['errors' => $have_citizens], 404);
		}
		else
		{
			Communes::findOrFail($id)->delete();
		}
	}


	// Inventory

	public function saveInventory(InventoryRequest $request)
	{
		$input_inventory = [];

		foreach ($this->fields_inventory as $value)
		{
			$input_inventory[$value] = $request->$value;
		}

		$input_inventory['user_id'] = Auth::user()->id;
		Inventory::create($input_inventory);
	}


	public function updateInventory(InventoryRequest $request, $id)
	{
		$inventory = Inventory::findOrFail($id);
		$input_inventory = [];

		foreach ($this->fields_inventory as $value)
		{
			$input_inventory[$value] = $request->$value;
		}

		$inventory->update($input_inventory);
	}


	public function removeInventory($id)
	{
		Inventory::findOrFail($id)->delete();
	}

	// Projects
}
