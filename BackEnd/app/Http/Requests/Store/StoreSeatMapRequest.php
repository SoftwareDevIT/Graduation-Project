<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeatMapRequest extends FormRequest
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
    public function rules()
    {
        return [
            '*.seat_layout_id' => 'required|integer',
            '*.row' => 'required|string|max:1',
            '*.column' => 'required|integer',
            '*.type' => 'string',
            '*.is_double' => 'required|boolean',
        ];
    }
}
