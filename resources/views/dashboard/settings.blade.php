@extends('main')

@section('pagetitle')
    Settings
@stop

@section('content')

@stop

@section('scripts')

    @if (Auth::user())
        <script type="text/javascript">
	        var settings = @json($settings);
        </script>
    @endif
@endsection
