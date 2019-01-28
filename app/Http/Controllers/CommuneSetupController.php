<?php

namespace App\Http\Controllers;

use App\Inventory;
use App\Communes;
use Illuminate\Http\Request;

class CommuneSetupController extends Controller
{
    public function index(Request $request)
	{
		$kommuneID = 2;
		$inventories = Inventory::with(['inventoryName' => function($q) use($kommuneID) {
			return $q->where("kommune_id", $kommuneID);
		}])
				->with(['inventoryPrices' => function($q) use($kommuneID) {
					return $q->where("commune_id", $kommuneID);
				}])
				->get();

		$kommunes = Communes::all();
		$selectedKommune = Communes::with('inventoryNames')->first();

		return view('dashboard.commune', compact(
				'inventories',
				'inventories',
				'selectedKommune',
				'kommunes'
//				'rentalPrices'
		));
	}
}
