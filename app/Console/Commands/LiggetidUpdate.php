<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Citizens;
use App\ProjectDates;
use App\Projects;
use App\Settings;

class LiggetidUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:liggetid';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update liggetid if no the first contact date defined';

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
        $citizens = Citizens::all();
        $setting = Settings::where('setting', '=', 'max_liggetid')->first();
        
        foreach ($citizens as $citizen) {
            $project = Projects::where('citizen_id', '=', $citizen->id)->first();
            
            if ($project) {
                $dates = ProjectDates::where('project_id', '=', $project->id)->first();
    
                if (!$dates->first_contact && (int)$setting->value > $project->liggetid) {
                    $project->liggetid = $project->liggetid + 1;
                    $project->save();
                }
            }
        }
    }
}
