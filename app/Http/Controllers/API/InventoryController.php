<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller {

	public function index()
	{

		$data = Inventory::all();

		return [
				'status'    => 'ok',
				'inventories' => $data,
		];
	}

	public function show($kommuneID = null)
	{
		$data = Inventory::all();

		return [
				'status'    => 'ok',
				'kommune_id'    => $kommuneID,
				'inventories' => $data,
		];
	}

	public function store(Request $request)
	{
		$data = $request->all();

		$model = new Inventory();

		$model->fill($data);
		$model->save();
	}

	public function update(Request $request, $id)
	{
		$data = $request->all();

		$model = Inventory::find($id);
		$model->fill($data);
		$model->save();
	}


	public function destroy($id)
	{
		$model = Inventory::find($id);
		$model->delete();

		return json_encode(['status' => 'deleted']);
	}

}
