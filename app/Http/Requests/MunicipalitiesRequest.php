<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MunicipalitiesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "name" => "required|max:100",
            "surname" => "required|max:100",
            "cpr" => "max:100",
            "address" => "required|max:255",
            "email" => "required|email",
            "mobile" => "max:100",
            "region" => "required|max:100",
            "bank_account" => "required|max:100",
        ];
    }
}
