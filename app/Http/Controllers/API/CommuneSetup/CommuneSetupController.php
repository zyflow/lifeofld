<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommuneSetupStoreRequest;
use App\Inventory;
use App\Communes;
use App\InventoryNames;
use App\RentalPrice;
use Illuminate\Http\Request;

class CommuneSetupController extends Controller {
	public function index(Request $request, $id = null)
	{
		$kommuneID = $request->get('id');

		$kommunesModel = Communes::with(
				'inventoryNames',
				'inventoryNames.inventory'
		);

		if ($request->has('id') && $request->get('id') !== null)
		{
			$kommunesModel->where("id", $request->get('id'));
		}

		$inventories = Inventory::with(['inventoryName' => function ($q) use ($kommuneID) {
			return $q->where("kommune_id", $kommuneID);
		}])
				->with(['inventoryPrices' => function ($q) use ($kommuneID) {
					return $q->where("commune_id", $kommuneID);
				}])
				->get();

		return [
				'status'      => 'ok',
				'inventories' => $inventories,
		];
	}


	public function store(CommuneSetupStoreRequest $request)
	{
		$data = $request->all();

		\Log::info($request->all());
		$kommuneID = $request->get('kommune_id');

		foreach ($data as $inventoryID => $inventoryData)
		{
			$inventoryName = array_get($inventoryData, 'inventoryName', null);
			$inventoryPrice = array_get($inventoryData, 'price', null);

			if ($inventoryName)
			{
				$this->storeInventoryName($kommuneID, $inventoryID, $inventoryName);
			}

			if ($inventoryPrice)
			{
				$this->storeInventoryPrice($kommuneID, $inventoryID, $inventoryPrice);
			}
		}

		return json_encode([
								   'status' => 'updated',
						   ]);
	}


	public function storeInventoryName($kommuneID, $inventoryID, $inventoryName)
	{
		$model = InventoryNames::where([
											   'inventory_id' => $inventoryID,
											   'kommune_id'   => $kommuneID,
									   ])->first();

		if (!$model)
		{
			$model = new InventoryNames();
		}

		if ($inventoryName)
		{
			$model->fill([
								 'name'         => $inventoryName,
								 'kommune_id'   => $kommuneID,
								 'inventory_id' => $inventoryID,
						 ]);
			$model->save();
		}

	}


	public function storeInventoryPrice($kommuneID, $inventoryID, $inventoryPrice)
	{
		$model = RentalPrice::where([
											'inventory_id' => $inventoryID,
											'commune_id' => $kommuneID,
									])->first();

		if (!$model)
		{
			$model = new RentalPrice();
		}

		if ($inventoryPrice)
		{
			$model->fill([
								 'price' => $inventoryPrice,
								 'commune_id' => $kommuneID,
								 'inventory_id' => $inventoryID
						 ]);
			$model->save();
		}
	}

}
