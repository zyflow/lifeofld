<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\ProjectStatusSetting;
use App\User;
use Illuminate\Http\Request;

class ProjectStatusSettingsController extends Controller
{
    public function __construct() {
//        $this->middleware('auth');

        $this->fields = [
            'name',
            'email',
            'username',
            'image'
        ];
    }

    public function index() {
		$data = ProjectStatusSetting::all();

		return [
				'status' => 'ok',
				'projectStatusSettings' => $data
		];
    }

	public function store(Request $request)
	{
		$data = $request->all();

		$supplier = new ProjectStatusSetting();

		$supplier->fill($data);
		$supplier->save();

		return json_encode(['status' => 'ok']);
	}


	public function update(Request $request, $id)
	{
		$data = $request->all();

		$model = ProjectStatusSetting::find($id);
		$model->fill($data);
		$model->save();

		return json_encode(['status' => 'updated']);
	}

	public function destroy($id)
	{
		$project = ProjectStatusSetting::find($id);
		$project->delete();

		return json_encode(['status' => 'deleted']);
	}

}
