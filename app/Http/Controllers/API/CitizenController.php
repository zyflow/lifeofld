<?php

namespace App\Http\Controllers\API;

use App\Citizens;
use App\Files;
use App\Http\Controllers\Controller;
use App\Http\Requests\CitizenRequest;
use App\Projects;
use Auth;
use Illuminate\Http\Request;

class CitizenController extends Controller {

	public function index()
	{
		$citizenModel = Citizens::with('kommune', 'files', 'project');

		$citizens = $citizenModel->get();

		foreach ($citizens as $citizen)
		{
			if (Projects::where('citizen_id', '=', $citizen->id)->first())
			{
				$citizen->have_project = 1;
			}
			else
			{
				$citizen->have_project = 0;
			}
		}

		return response([
								'status'   => 'OK',
								'citizens' => $citizens,
						]);
	}


	public function update(Request $request, $id)
	{
		$citizen = Citizens::find($id);

		$input_citizens = [];

		$citizen->fill($request->except('cpr'));
		$citizen->save();

		$citizen->update($input_citizens);

		Files::saveFiles($citizen, $request->file('files'));

		return json_encode([
								   'status' => 'ok',
						   ]);
	}


	public function store(CitizenRequest $request)
	{
		// Store Citizen Data
		$data = $request->all();
		$data['user_id'] = 777;
		$data['cpr'] = encrypt($data['cpr']);

		$citizen = Citizens::create($data);

		Files::saveFiles($citizen, $request->file('files'));

		return json_encode([
								   'status' => 'ok',
						   ]);
	}


	public function destroy($id)
	{
		$project = Citizens::find($id);
		$project->delete();

		return json_encode(['status' => 'deleted']);
	}


	public function avilableCitizens()
	{
		$citizensAlreadyInProjects = Projects::select('citizen_id')
				->groupBy('citizen_id')
				->pluck('citizen_id')
				->toArray();

		$citizenModel = Citizens::whereNotIn('id', $citizensAlreadyInProjects)
				->with('kommune', 'files', 'project');

		$citizens = $citizenModel->get();

		foreach ($citizens as $citizen)
		{

			if (Projects::where('citizen_id', '=', $citizen->id)->first())
			{
				$citizen->have_project = 1;
			}
			else
			{
				$citizen->have_project = 0;
			}
		}

		return response([
								'status'   => 'OK',
								'citizens' => $citizens,
						]);
	}

}
