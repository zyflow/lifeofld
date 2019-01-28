<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\ProjectStatusSetting;
use App\Suppliers;
use Illuminate\Http\Request;

class SettingStatusController extends Controller {

//	public function index()
//	{
//		$data = ProjectStatusSetting::all();
//
//		return [
//				'status'    => 'ok',
//				'suppliers' => $data,
//		];
//	}
//
//
//	public function store(Request $request)
//	{
//		$data = $request->all();
//
//		$supplier = new ProjectStatusSetting();
//
//		$supplier->fill($data);
//		$supplier->save();
//
//	}

//	public function update(Request $request, $id)
//	{
//		$data = $request->all();
//
//		$model = Suppliers::find($id);
//		$model->fill($data);
//		$model->save();
//	}
//
//
//	public function destroy($id)
//	{
//		$project = Suppliers::find($id);
//		$project->delete();
//
//		return json_encode(['status' => 'deleted']);
//	}

}
