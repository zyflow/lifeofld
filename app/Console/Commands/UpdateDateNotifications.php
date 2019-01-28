<?php

namespace App\Console\Commands;

use App\Notification;
use App\Projects;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateDateNotifications extends Command {
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'update:date_notifications';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Update date notifications / days left';


	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}


	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function handle()
	{
		$projects = Projects::with('latestDate', 'latestDate.settings')->get();
		foreach ($projects as $project)
		{
			$projectID = $project->id;

			$missedProjectHours = $this->getProjectStatusTimeInHours($project);

			if ($missedProjectHours < 0)
			{
				$this->sendNotification($projectID, 'project_timecap', $missedProjectHours);
			}
		}
	}


	public function getProjectStatusTimeInHours($project)
	{
		return $project->hours_left;
	}


	public function sendNotification($projectID, $type, $missedHours)
	{
		$existingNotification = $this->getNotificationModel($projectID, $type);

		$existingNotification->fill([
//											  'seen'    => Carbon::now(),
											  'message' => 'Project' . $projectID . ' overdue ' . $missedHours,
									  ]);

		$existingNotification->save();
	}


	public function getNotificationModel($projectID, $type)
	{
		$notification = Notification::where([
													'project_id' => $projectID,
													'type'       => $type,
											])->first();

		if ($notification === null)
		{
			$notification = new Notification();
			$notification->fill([
										'project_id' => $projectID,
										'type'       => $type,
								]);
		}

		return $notification;
	}
}
