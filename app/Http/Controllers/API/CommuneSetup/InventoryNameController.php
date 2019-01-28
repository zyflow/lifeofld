<?php

namespace App\Http\Controllers\API\CommuneSetup;

use App\Http\Controllers\Controller;
use App\Inventory;
use App\InventoryNames;
use App\Communes;
use Illuminate\Http\Request;

class InventoryNameController extends Controller
{
	public function index(Request $request, $id = null)
	{
//		$kommuneID = $request->get('id');
//
//		$kommunesModel = Communes::with(
//				'inventoryNames',
//				'inventoryNames.inventory'
//		);
//
//		if ($request->has('id') && $request->get('id') !== null)
//		{
//			$kommunesModel->where("id", $request->get('id'));
//		}
//
//		$inventories = Inventory::with(['inventoryName' => function($q) use($kommuneID) {
//			return $q->where("kommune_id", $kommuneID);
//		}])
//				->with(['inventoryPrices' => function($q) use($kommuneID) {
//					return $q->where("commune_id", $kommuneID);
//				}])
//				->get();
//
//
//		return [
//				'status' => 'ok',
//				'inventories' => $inventories
//		];
	}

	public function store(Request $request)
	{
		$data = $request->all();

		\Log::info($request->all());
		$kommuneID = $request->get('kommune_id');

		foreach($data['data'] as $inventoryID => $inventoryName)
		{
			$model = InventoryNames::where([
					'inventory_id' => $inventoryID,
					'kommune_id' => $kommuneID
										   ])->first();

			if (!$model)
			{
				$model = new InventoryNames();
			}

			if ($inventoryName)
			{
				$model->fill([
									 'name' => $inventoryName,
									 'kommune_id' => $kommuneID,
									 'inventory_id' => $inventoryID,
									 'key' => rand(3, 30),
							 ]);
				$model->save();
			}

		}

		return json_encode([
				'status' => 'updated'
						   ]);
	}

	public function update(Request $request)
	{


		return json_encode([
				'status' => 'updated',
						   ]);
	}
}
