<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Inventory;
use App\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationController extends Controller {

	public function index()
	{
		$dataModel = Notification::where(function($q){
			$q->where('seen', '<', Carbon::now()->subHour(24)->format('Y-m-d H:i:s'))
					->orWhereNull('seen');
		});
		$notifications = $dataModel->limit(10)->get();
		$notificationsCount = $dataModel->count();

		return response([
								'status'             => 'OK',
								'notifications' => $notifications,
								'notification_full_count' => $notificationsCount,
						]);
	}


	public function store(Request $request)
	{
		$data = $request->all();

		$model = new Notification();

		$model->fill($data);
		$model->save();
	}


	public function update(Request $request, $id)
	{
		$data = [
				'seen' => Carbon::now()
		];

		$model = Notification::find($id);

		$model->fill($data);
		$model->save();

		return json_encode(['status' => 'updated']);
	}


	public function destroy($id)
	{
		$model = Notification::find($id);
		$model->delete();

		return json_encode(['status' => 'deleted']);
	}

}
