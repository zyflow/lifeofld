<?php

namespace App\Http\Controllers;

use App\TimelineData;
use Carbon\Carbon;
use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Google_Service_Calendar_EventDateTime;
use Illuminate\Http\Request;

class gCalendarController extends Controller {
	protected $client;


	public function __construct()
	{
		$client = new Google_Client();
		$client->setAuthConfig(public_path('secret.json'));
		$client->addScope(Google_Service_Calendar::CALENDAR);

		$guzzleClient = new \GuzzleHttp\Client(array('curl' => array(CURLOPT_SSL_VERIFYPEER => false)));
		$client->setHttpClient($guzzleClient);
		$this->client = $client;
	}


	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{

		$timelineData = TimelineData::orderBy('start_date', 'DESC')->get();
//		collect($timelineData);
		$dateStart = Carbon::now()->subMonth(1);
		$dateEnd = Carbon::now()->addMonth(1);

		$dates = [];

		while ($dateStart->lte($dateEnd))
		{
			$dates[] = $dateStart->format('Y-m-d');
			$dateStart->addDay();
		}

		if ($timelineData->isEmpty() == false)
		{
			return view('timeline', ['data' => $timelineData, 'dates' => $dates]);
		}

		session_start();
		if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
		{
			$this->client->setAccessToken($_SESSION['access_token']);
			$service = new Google_Service_Calendar($this->client);

			$optParams = [
					'alwaysIncludeEmail' => true,
					//					'timeMin'            => Carbon::now(),
			];

			$calendarData = [];

			foreach ($service->calendarList->listCalendarList()->getItems() as $calendarObj)
			{
				$events = $service->events->listEvents($calendarObj->id, $optParams);

				while (true)
				{
					foreach ($events->getItems() as $event)
					{
						$endDate = null;
						$startDate = null;
						$startDateTime = Carbon::parse($event->start->dateTime, 'Europe/Riga')->tz('UTC')->format('Y-m-d H:i:s');
						$endDateTime = Carbon::parse($event->end->dateTime, 'Europe/Riga')->tz('UTC')->format('Y-m-d H:i:s');

						if ($event->end->date !== null)
						{
							$endDate = Carbon::createFromFormat('Y-m-d', $event->end->date)->format('Y-m-d');
						}

						if ($event->start->date !== null)
						{
							$startDate = Carbon::createFromFormat('Y-m-d', $event->start->date)->format('Y-m-d');
						}

						TimelineData::create([
													 'event_id'       => $event->id,
													 'user_email'     => $event->summary,
													 'creator_name'   => $event->creator->displayName,
													 'creator_email'  => $event->creator->email,
													 'start_datetime' => $startDateTime,
													 'end_datetime'   => $endDateTime,
													 'start_date'     => $startDate,
													 'end_date'       => $endDate,
													 'summary'        => $event->summary,
													 //												 'created'        => $event->created,
													 'kind'           => $event->kind,
													 'creator_name'   => $event->creator->displayName,
													 'creator_email'  => $event->creator->email,
													 'collection_key' => $event->collection_key,
											 ]);

						echo $event->getSummary();

					}
					$pageToken = $events->getNextPageToken();
					if ($pageToken)
					{
						$optParams = array('pageToken' => $pageToken);
						$events = $service->events->listEvents('primary', $optParams);

					}
					else
					{
						break;
					}
				}
			}

			return view('timeline', ['data' => $calendarData]);
		}
		else
		{
			return redirect()->route('oauthCallback');
		}
	}


	public
	function getCalendarList()
	{
	}


	public
	function oauth()
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


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public
	function create()
	{
		return view('calendar.createEvent');
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request $request
	 *
	 * @return \Illuminate\Http\Response
	 */
	public
	function store(Request $request)
	{
		session_start();
		$startDateTime = $request->start_date;
		$endDateTime = $request->end_date;

		if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
		{
			$this->client->setAccessToken($_SESSION['access_token']);
			$service = new Google_Service_Calendar($this->client);

			$calendarId = 'primary';
			$event = new Google_Service_Calendar_Event([
															   'summary'     => $request->title,
															   'description' => $request->description,
															   'start'       => ['dateTime' => $startDateTime],
															   'end'         => ['dateTime' => $endDateTime],
															   'reminders'   => ['useDefault' => true],
													   ]);
			$results = $service->events->insert($calendarId, $event);
			if (!$results)
			{
				return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
			}
			return response()->json(['status' => 'success', 'message' => 'Event Created']);
		}
		else
		{
			return redirect()->route('oauthCallback');
		}
	}


	/**
	 * Display the specified resource.
	 *
	 * @param $eventId
	 *
	 * @return \Illuminate\Http\Response
	 * @internal param int $id
	 */
	public
	function show($eventId)
	{
		session_start();
		if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
		{
			$this->client->setAccessToken($_SESSION['access_token']);

			$service = new Google_Service_Calendar($this->client);
			$event = $service->events->get('primary', $eventId);

			if (!$event)
			{
				return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
			}
			return response()->json(['status' => 'success', 'data' => $event]);

		}
		else
		{
			return redirect()->route('oauthCallback');
		}
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int $id
	 *
	 * @return \Illuminate\Http\Response
	 */
	public
	function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param                           $eventId
	 *
	 * @return \Illuminate\Http\Response
	 * @internal param int $id
	 */
	public
	function update(Request $request, $eventId)
	{
		session_start();
		if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
		{
			$this->client->setAccessToken($_SESSION['access_token']);
			$service = new Google_Service_Calendar($this->client);

			$startDateTime = Carbon::parse($request->start_date)->toRfc3339String();

			$eventDuration = 30; //minutes

			if ($request->has('end_date'))
			{
				$endDateTime = Carbon::parse($request->end_date)->toRfc3339String();

			}
			else
			{
				$endDateTime = Carbon::parse($request->start_date)->addMinutes($eventDuration)->toRfc3339String();
			}

			// retrieve the event from the API.
			$event = $service->events->get('primary', $eventId);

			$event->setSummary($request->title);

			$event->setDescription($request->description);

			//start time
			$start = new Google_Service_Calendar_EventDateTime();
			$start->setDateTime($startDateTime);
			$event->setStart($start);

			//end time
			$end = new Google_Service_Calendar_EventDateTime();
			$end->setDateTime($endDateTime);
			$event->setEnd($end);

			$updatedEvent = $service->events->update('primary', $event->getId(), $event);

			if (!$updatedEvent)
			{
				return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
			}
			return response()->json(['status' => 'success', 'data' => $updatedEvent]);

		}
		else
		{
			return redirect()->route('oauthCallback');
		}
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param $eventId
	 *
	 * @return \Illuminate\Http\Response
	 * @internal param int $id
	 */
	public
	function destroy($eventId)
	{
		session_start();
		if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
		{
			$this->client->setAccessToken($_SESSION['access_token']);
			$service = new Google_Service_Calendar($this->client);

			$service->events->delete('primary', $eventId);

		}
		else
		{
			return redirect()->route('oauthCallback');
		}
	}
}