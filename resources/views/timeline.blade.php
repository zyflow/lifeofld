@extends('main')

@section('pagetitle')
    Settings
@stop

@section('content')

    <div class="row">
        <div class="col-md-12">
            <h4>Latest News</h4>
            <ul class="timeline">

                {{--                <li class="event" data-date="01-06-2019"><p>Shit 1</p></li>--}}
                {{--                <li class="event" data-date="02-06-2019"><p>Shit 2</p></li>--}}
                {{--                <li class="event" data-date="03-06-2019"><p>Shit 3</p></li>--}}
                {{--                <li class="event group1" data-date="04-06-2019"><p>Shit 4.1</p></li>--}}
                {{--                <li class="event group1" data-date="05-06-2019"><p>Shit 4.2</p></li>--}}
                {{--                <li class="event group1" data-date="06-06-2019"><p>Shit 4.3</p></li>--}}
                {{--                <li class="event" data-date="07-06-2019">--}}
                {{--                    <p class="group1">Shit 4.4</p>--}}
                {{--                    <p class="group2">Shit 5.1 x</p>--}}
                {{--                </li>--}}
                {{--                <li class="event group2" data-date="08-06-2019"><p>Shit 5.2</p></li>--}}
                {{--                <li class="event group2" data-date="09-06-2019"><p>Shit 5.3</p></li>--}}


                @if(isset($data))
                    @foreach($data as $date)
                        <li class="event" data-date="{{$date['start_date']}}">
                            <p>{{$date['summary']}}</p>
                        </li>
                    @endforeach
                @endif
            </ul>

        </div>
    </div>

@stop

@section('scripts')

    @if (Auth::user())
        <script type="text/javascript">
        </script>
    @endif
@endsection
