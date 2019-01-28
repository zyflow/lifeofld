<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CitizenRequest;
use App\Http\Requests\ProjectDatesRequest;
use App\Http\Requests\MunicipalitiesRequest;
use App\Http\Requests\InventoryRequest;
use App\Citizens;
use App\ProjectDates;
use App\Projects;
use App\ProjectManagers;
use App\Communes;
use App\Inventory;
use App\Suppliers;
use Auth;
use Validator;
use Storage;
use DB;

class DashboardController extends Controller
{
    public function __construct() {
        $this->middleware('auth');

        $this->citizen_fields = ['name', 'surname', 'cpr', 'address', 'email', 'mobile', 'group', 'kommune'];

        $this->fields_municipality = ['name', 'surname', 'cpr', 'address', 'email', 'mobile', 'bank_account', 'region', 'contact_person', 'group'];

        $this->fields_project = ['citizen_id', 'kommune_id', 'project_status', 'project_manager_id', 'project_activity', 'liggetid', 'meeting_days'];
        $this->fields_project_dates = ['start', 'first_contact', 'meeting', 'commenced', 'material_sent_subject', 'material_sent_municipality', 'invoice', 'return'];

        $this->fields_inventory = ["name", "cost_price", "sales_price", "rental_price", "stock_lock", "qty", "supplier_id"];
    }

    public function index(Request $request) {

    	$lang = $request->get('lang');
    	if ($lang)
		{
			\App::setLocale($lang);
			\Session::put('locale', $lang);
		}

        $user = Auth::user();
        $managers = ProjectManagers::all();
//        $statuses = ProjectStatuses::all();
        $municipalities = Communes::all();
        $inventories = Inventory::all();
        $suppliers = Suppliers::all();

        return view('dashboard/index', compact(
            'user',
            'managers',
            'statuses',
            'municipalities',
            'inventories',
            'suppliers')
        );
    }


    public function removeCitizen($id) {
        Citizens::findOrFail($id)->delete();
    }

    public function updateMunicipality(MunicipalitiesRequest $request, $id) {
        $municipality = Communes::findOrFail($id);
        $input_municipality = [];

        foreach ($this->fields_municipality as $value) {
            $input_municipality[$value] = $request->$value;
        }

        $municipality->update($input_municipality);
    }

    public function removeMunicipality($id) {
        $user = Auth::user();
        $have_citizens = ["This municipality is assigned to citizens:"];

        if ($user->admin === 1) {
            $citizens = Citizens::all();
        } else {
            $citizens = Citizens::where('user_id', '=', $user->id)->get();
        }

        foreach ($citizens as $citizen) {

            if ($citizen->kommune === $id) {
                array_push($have_citizens, $citizen->name . " " . $citizen->surname);
            }
        }

        if (count($have_citizens) > 1) {
            return response()->json(['errors' => $have_citizens], 404);
        } else {
            Communes::findOrFail($id)->delete();
        }
    }

    // Inventory

    public function saveInventory(InventoryRequest $request) {
        $input_inventory = [];

        foreach ($this->fields_inventory as $value) {
            $input_inventory[$value] = $request->$value;
        }

        $input_inventory['user_id'] = Auth::user()->id;
        Inventory::create($input_inventory);
    }

    public function updateInventory(InventoryRequest $request, $id) {
        $inventory = Inventory::findOrFail($id);
        $input_inventory = [];

        foreach ($this->fields_inventory as $value) {
            $input_inventory[$value] = $request->$value;
        }

        $inventory->update($input_inventory);
    }

    public function removeInventory($id) {
       Inventory::findOrFail($id)->delete();
    }

    // Projects
}
