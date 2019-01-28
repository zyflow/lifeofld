<?php

namespace App\Http\Controllers\API\CommuneSetup;

use App\Http\Controllers\Controller;
use App\Inventory;
use App\InventoryNames;
use App\Communes;
use App\RentalPrice;
use Illuminate\Http\Request;

class RentalPriceController extends Controller
{
	public function index(Request $request, $id = null)
	{
		dd('index ');
//		$kommuneID = $request->get('id');
//
//		$kommunesModel = Municipalities::with(
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
		dd('deprecated');
		$data = $request->all();

		$kommuneID = $request->get('kommune_id');

		foreach($data['data'] as $inventoryID => $price)
		{
			$model = RentalPrice::where([
												   'inventory_id' => $inventoryID,
												   'commune_id' => $kommuneID,
										   ])->first();

			if (!$model)
			{
				$model = new RentalPrice();
			}

			if ($price)
			{
				$model->fill([
									 'price' => $price,
									 'commune_id' => $kommuneID,
									 'inventory_id' => $inventoryID
							 ]);
				$model->save();
			}

		}

		return json_encode([
								   'status' => 'updated'
						   ]);
	}
}
