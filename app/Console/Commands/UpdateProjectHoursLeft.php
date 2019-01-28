<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Citizens;
use App\ProjectDates;
use App\Projects;
use App\Settings;

class UpdateProjectHoursLeft extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:project_hours_left';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update project status hours left';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        \Log::info('project hours left');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
       	$allProjects = Projects::with('latestDate', 'latestDate.settings')->get();

       	foreach($allProjects as $project)
		{
			Projects::updateHoursLeft($project);
		}
    }
}
