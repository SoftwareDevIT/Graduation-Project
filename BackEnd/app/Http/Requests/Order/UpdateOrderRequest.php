<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
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
            'showtime_id' => 'required',
            'pay_method_id' => 'required',
            'amount' => 'required|numeric|min:1',
            'price_ticket' => 'required|numeric|min:0',
            'price_combo' => 'nullable|numeric|min:0',
            'seat_status' => 'required|string',
        ];
    }
    public function messages(): array
    {
        return [
            'showtime_id.required' => 'The showtime field is required.',
            'pay_method_id.required' => 'The pay method field is required.',
            'amount.required' => 'The amount field is required.',
            'price_ticket.required' => 'The price ticket field is required.',
            'seat_status.required' => 'The seat status field is required.',
        ];
    }
}
