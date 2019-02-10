@extends('main')

@section('pagetitle')
    {{trans('menu.dashboard')}}
@stop

@section('content')

@stop

@section('scripts')

    @if (Auth::user())
        <script type="text/javascript">
			var managers = @json($managers),
				suppliers = @json($suppliers);
        </script>
    @endif
@endsection
