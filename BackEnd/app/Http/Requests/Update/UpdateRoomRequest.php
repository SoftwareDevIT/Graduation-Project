<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "room_name" => "string",
            "volume" => "integer",
            "cinema_id" => "integer",
            "quantity_double_seats" => "integer",
            "quantity_vip_seats" => "integer",
            "quantity_basic_seats" => "integer",
            "status" => "integer"
        ];
    }
}