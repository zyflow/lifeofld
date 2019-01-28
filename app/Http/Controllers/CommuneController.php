<?php

namespace App\Http\Controllers;

use App\Communes;
use Auth;
use Validator;
use Storage;
use DB;
use App\Http\Requests\MunicipalitiesRequest;

class CommuneController extends Controller {

	public function index()
	{
		$user = Auth::user();

		if ($user->admin === 1) {
			$municipalities = Communes::withCount('openProjects')->get();
		} else {
			$municipalities = Communes::withCount('openProjects')
					->where('user_id', '=', $user->id)->get();
		}

		$selectedCommune = Communes::with('inventoryNames')
				->first();

		return response([
								'status' => 'OK',
								'municipalities' => $municipalities,
								'selected_commune' => $selectedCommune
						]);
	}

	public function store(MunicipalitiesRequest $request) {
		$data = $request->all();

		$data['user_id'] = Auth::user()->id;
		Communes::create($data);
	}

	public function update(MunicipalitiesRequest $request, $id)
	{
		$data = $request->all();
		$data['user_id'] = Auth::user()->id;

		$model = Communes::find($id);
		$model->fill($data);
		$model->save();
	}

}
