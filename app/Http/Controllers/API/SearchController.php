<?php

namespace App\Http\Controllers\API;

use App\Citizens;
use App\Communes;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\ProjectStatusSetting;
use App\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{


	public function index(Request $request)
	{
		$search = $request->get('queue');


		$citizens = $this->searchCitizens($search);
		$communes = $this->searchCommunes($search);

		return [
				'status' => 'ok',
				'data' => [
						'citizens' => $citizens,
						'communes' => $communes
				],
		];
	}


	/**
	 * Adding only allowed fields (don't show CPR, passwords etc,)
	 *
	 * @param $search
	 *
	 * @return array
	 */
	public function searchCitizens($search)
	{
		$citizens = Citizens::search($search)->get();
		$data = [];

		foreach ($citizens as $citizen)
		{
			$row['id'] = $citizen->id;
			$row['name'] = $citizen->name;
			$row['surname'] = $citizen->surname;
			$row['address'] = $citizen->address;
			$row['address2'] = $citizen->address2;
			$row['city'] = $citizen->city;
			$row['post_code'] = $citizen->post_code;
			$row['email'] = $citizen->email;
			$data[] = $row;
		}

		return $data;
	}

	public function searchCommunes($search)
	{
		$communes = Communes::search($search)->get();

		$data = [];

		foreach ($communes as $commune)
		{
			$row['id'] = $commune->id;
			$row['name'] = $commune->name;
			$row['address'] = $commune->address;
			$row['email'] = $commune->email;
			$row['contact_person'] = $commune->contact_person;
			$data[] = $row;
		}

		return $data;
	}

}