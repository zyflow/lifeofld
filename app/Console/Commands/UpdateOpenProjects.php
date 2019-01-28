<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Communes;
use App\Projects;

class UpdateOpenProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:open_projects';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update open project count for municipalities';

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
        $projects = Projects::all();
        $municipalities = Communes::all();

        foreach ($municipalities as $municipality) {
            $municipality->open_projects = Projects::where([['kommune', '=', $municipality->id],
                                                            ['project_status', '!=', 7]])
                                                 ->orWhere([['kommune', '=', $municipality->id],
                                                            ['project_status', '!=', 8]])->count();
            $municipality->save();
        }
    }
}
