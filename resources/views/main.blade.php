@section('pagetitle')
    Login
@stop

<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>@yield('pagetitle') | Workstep</title>
        <link href="{{asset('css/app.css') }}?v=<?php echo date("h:i:sa"); ?>" rel="stylesheet" type="text/css">
        <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
        {{--<script--}}
            {{--src="https://code.jquery.com/jquery-3.3.1.min.js"--}}
            {{--integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="--}}
            {{--crossorigin="anonymous"></script>--}}
    </head>
    <body>

        <div id="root"></div>
        @yield('content')

        @if (Auth::user())
            <script>
		        var locale = @json(\App::getLocale());
		        var translations = @json(\App\Translations::getTranslations());

		        var user = @json(Auth::user());
		        var citizens = @json(App\Citizens::all());
            </script>

            @if (Auth::user()->admin === 1)
                <script>
			        var citizens = @json(App\Citizens::all());
                </script>
            @else
                <script>
			        var citizens = @json(App\Citizens::where('user_id', '=', Auth::user()->id));
                </script>
            @endif
        @endif

        <script src="{{asset('/js/vendor.js')}}?v=<?php echo date("h:i:sa"); ?>"></script>
        {{--<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>--}}

        @yield('scripts')


        <script src="{{asset('js/app.js')}}?v=<?php echo date("h:i:sa"); ?>"></script>
    </body>
</html>
