@extends('main')

@section('pagetitle')
    Kommune Setup
@stop

@section('content')

@stop

@section('scripts')

    @if (Auth::user())
        <script type="text/javascript">
			var inventories = @json($inventories);
			var communes = @json($kommunes);
			var selected_commune = @json($selectedKommune);

{{--			var rental_prices = @json($rentalPrices);--}}
        </script>
    @endif
@endsection

