@extends('main')

@section('pagetitle')
    Register
@stop

@section('content')
<div class="login-register-container">
    <div class="title">Register</div>

    @if (session()->has('error'))
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @endif
    <div class="login">
        <form class="form-horizontal" role="form" method="POST" action="{{ route('register') }}">
            {{ csrf_field() }}

            <div class="input">
                <input id="name" type="text" name="name" placeholder="Enter name, surname here" autofocus required/>
                <label for='name'>Name, Surname</label>

                @if ($errors->has('name'))
                    <span class="error-block">
                        {{ $errors->first('name') }}
                    </span>
                @endif
            </div>
            <div class="input">
                <input id="email" type="email" name="email" placeholder="Enter e-mail here" required/>
                <label for='email'>E-Mail</label>

                @if ($errors->has('email'))
                    <span class="error-block">
                        {{ $errors->first('email') }}
                    </span>
                @endif
            </div>
            <div class="input">
                <input id="username" type="text" name="username" placeholder="Enter username here" required/>
                <label for='username'>Username</label>

                @if ($errors->has('username'))
                    <span class="error-block">
                        {{ $errors->first('username') }}
                    </span>
                @endif
            </div>
            <div class="input">
                <input id="password" type="password" name="password" placeholder="••••••••" required/>
                <label for='password'>Password</label>

                @if ($errors->has('password'))
                    <span class="error-block">
                        {{ $errors->first('password') }}
                    </span>
                @endif
            </div>
            <div class="input">
                <input id="password-confirm" type="password" name="password_confirmation" placeholder="••••••••" required/>
                <label for="password-confirm">Confirm Password</label>
            </div>

            <div class="buttons">
                <button type="submit">Register</button>
            </div>
        </form>
    </div>
    <div class="additional-links">
        <a href="/login">Login</a>
    </div>
</div>
@endsection