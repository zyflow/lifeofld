<?php

namespace App;

use Carbon\Carbon;
use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Model;

class Projects extends Model {

	protected $table = 'projects';

//	public $timestamps = true;

	public $fillable = [
			'user_id', 'citizen_id', 'kommune_id',
			'manager_id', 'project_activity',
			'project_status_settings_id', 'hours_left',
	];

	public $appends = [
			'days_left',
			'work_days_left'
	];


	public function __construct(array $attributes = [])
	{
		parent::__construct($attributes);
	}


	/**
	 * The "booting" method of the model.
	 *
	 * @return void
	 */
	protected static function boot()
	{
		parent::boot();

		static::creating(function (Projects $project) {
			$project->hours_left = 3;
		});

		static::created(function (Projects $project) {
			$data = $project->toArray();
			$data['project_id'] = $project->id;
			$data['status_date'] = Carbon::now();
			$data['status'] = 'project_created';
			ProjectDates::create($data);
		});

		static::updating(function (Projects $project) {
			self::updateProjectStatus($project);
			self::saveProjectDate($project);

			$h2 = self::getProjectHoursLeft($project);
			$project->hours_left = $h2;
		});
	}

	public function getDaysLeftAttribute()
	{
		$days = sprintf('%.0f', $this->hours_left / 24);

		if ($days == -0)
		{
			$days = 0;
		}

		return $days;
	}

	public function getWorkDaysLeftAttribute()
	{
		$days = sprintf('%.0f', $this->hours_left / 24);

		if ($days == -0)
		{
			$days = 0;
		}

		if ($days > 0 && $this->hours_left > 0)
		{
			$targetDay = Carbon::now()->addHours($this->hours_left);

			$id = $this->id;

			// Returning workday count for specific hour limit;
			$workDays = $targetDay->diffFiltered(CarbonInterval::day(), function($date) use($id) {

				return $date->isWeekday();
			});

			return $workDays;
		}

		return 0;
	}


	private static function updateProjectStatus($project)
	{
		if (request()->has('date') || request()->has('project_status_settings_id'))
		{
			if (request()->has('date'))
			{
				$projectWithStatusData = $project->load('statusSettings');

				if ($projectWithStatusData->statusSettings === null)
				{
					$firstStatus = ProjectStatusSetting::where('order_no', 1)->first();
					$project->project_status_settings_id = $firstStatus->id;
				}
			}
			else
			{
				$projectStatusSettingsID = (int) request()->get('project_status_settings_id');
				$currentStatusData = ProjectStatusSetting::where('id', $projectStatusSettingsID)->first();

				$project->project_status_settings_id = $currentStatusData->id;

				$projectStatusSettingsID = (int) request()->get('project_status_settings_id');
				$currentStatusData = ProjectStatusSetting::where('id', $projectStatusSettingsID)->first();
				$project->project_status_settings_id = $currentStatusData->id;
			}
		}

		return $project;
	}


	private static function saveProjectDate($project)
	{
		if (request()->has('date') || request()->has('project_status_settings_id'))
		{

			$projectStatusSettingsID = (int) $project->project_status_settings_id;
			$currentStatus = ProjectStatusSetting::where('id', $projectStatusSettingsID)->first();

			$statusName = $currentStatus->getAttribute('name');

			if (request()->has('date'))
			{
				$date = request()->get('date');
			}
			else
			{
				$date = Carbon::now();
			}

			ProjectDates::create([
										 'status_date'                => $date,
										 'user_id'                    => 775,
										 'project_id'                 => $project->id,
										 'status'                     => $statusName,
										 'project_status_settings_id' => $projectStatusSettingsID,
								 ]);
		}

	}


	public function getProjectStatusSettings()
	{
		$manualProjectStatuses = ProjectStatusSetting::select('id')
				->where("manual_status_change", 1)
				->pluck('id')->toArray();

		return $manualProjectStatuses;
	}


	public function citizens()
	{
		return $this->hasOne(Citizens::class, 'id', 'citizen_id');
	}


	public function kommune()
	{
		return $this->hasOne(Communes::class, 'id', 'kommune_id');
	}


	public function projectManager()
	{
		return $this->hasOne(User::class, 'id', 'manager_id');
	}


	public function dates()
	{
		return $this->hasMany(ProjectDates::class, 'project_id', 'id');
	}


	public function statusSettings()
	{
		return $this->hasOne(ProjectStatusSetting::class, 'id', 'project_status_settings_id');
	}


	public function latestDate()
	{
		return $this->hasOne(ProjectDates::class, 'project_id', 'id')
				->latest();
	}

	public static function getProjectHoursLeft($project)
	{
		if (!$project->latestDate->settings->hours)
		{
			return 0;
		}

		$projectStatusThreshold = $project->latestDate->settings->hours;
		$latestStatusDeadlineDate = Carbon::createFromFormat('Y-m-d H:i:s', $project->latestDate->status_date)
				->addHours($projectStatusThreshold);

		$hoursLeft = Carbon::now()->diffInHours($latestStatusDeadlineDate, false);

		return $hoursLeft;
	}

	public static function setNewHoursLeft(Projects $project)
	{
		$hoursLeft = self::getProjectHoursLeft($project);

		$project->update([
				'hours_left' => $hoursLeft
		]);

	}

	public static function updateHoursLeft(Projects $project)
	{
		$hoursLeft = self::getProjectHoursLeft($project);

		if ($project->id == 1)
		{
			\Log::info('cron: ' . $hoursLeft);
		}

		$project->update(['hours_left' => $hoursLeft]);
	}
}
