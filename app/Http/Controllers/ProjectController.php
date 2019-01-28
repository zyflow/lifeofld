<?php

namespace App\Http\Controllers;

use App\Citizens;
use App\Files;
use App\Http\Requests\ProjectDatesRequest;
use App\Projects;
use App\ProjectStatusSetting;
use Auth;

class ProjectController extends Controller {
	public function index()
	{
		$projects = Projects::with('citizens', 'citizens.files', 'kommune', 'projectManager', 'statusSettings')
				->get();

		return response([
								'status'   => 'OK',
								'projects' => $projects,
						]);
	}


	public function store(ProjectDatesRequest $request)
	{
		$data = $request->all();
		$data['user_id'] = Auth::user()->id;
		$data['project_status'] = 0;

		$projectStatusSetting = ProjectStatusSetting::where('order_no', 1)->first();
		$data['project_status_settings_id'] = $projectStatusSetting->id;

		Projects::create($data);

		return response([
								'status' => 'OK',
						]);
	}


	public function update(ProjectDatesRequest $request, $id)
	{
		$data = $request->all();
		$data['user_id'] = 7777;

		$project = Projects::find($id);

		$project->fill($data);
		$project->save();

		$citizen = Citizens::find($project->citizen_id);
		Files::saveFiles($citizen, $request->file('files'));

		return response([
								'status' => 'OK',
						]);
	}


	public function destroy($id)
	{
		$project = Projects::find($id);
		$project->delete();

		return json_encode(['status' => 'deleted']);
	}
}
