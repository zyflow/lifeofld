@extends('main')

@section('pagetitle')
    Login
@stop

@section('content')
<div class="login-register-container">
    <div class="title">Login</div>

    @if (session()->has('error'))
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @endif
    <div class="login">
        <form class="form-horizontal" role="form" method="POST" action="{{ route('login') }}">
            {{ csrf_field() }}

            <div class="input">
                <input id="email" type="text" name="email" placeholder="example@example.com" autofocus required/>
                <label for='email'>E-Mail aller Brugernavn</label>

                @if ($errors->has('email'))
                    <span class="error-block">
                        {{ $errors->first('email') }}
                    </span>
                @endif
            </div>
            <div class="input">
                <input id="password" type="password" name="password" placeholder="••••••••" required/>
                <label for="password">Adgangskode</label>

                @if ($errors->has('password'))
                    <span class="error-block">
                        {{ $errors->first('password') }}
                    </span>
                @endif
            </div>
            
            <div class="buttons">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
    <div class="additional-links">
        <a href="/register">Register</a>
    </div>
</div>
@endsection