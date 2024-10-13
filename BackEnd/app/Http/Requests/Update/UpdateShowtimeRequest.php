<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShowtimeRequest extends FormRequest
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
            'movie_id' => 'required|integer',
            // '*.room_id' => 'required|integer',
            'cinema_id' => 'required|integer',
            'showtime_date' => 'required|date',
            'showtime_start' => 'required',
            'showtime_end' => 'required',
            
        ];
    }
}
