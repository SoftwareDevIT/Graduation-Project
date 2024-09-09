<?php

namespace App\Http\Requests\News;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'news_category_id' => 'required',
            'content' => 'required|string',
            'user_id' => 'required',
        ];
    }
    public function messages(): array
    {
        return [
            'title.required' => 'the title field is required.',
            'title.string' => 'the title must be a string.',
            'title.max' => 'the title may not be greater than 255 characters.',
            'news_category_id.required' => 'the news category field is required.',

            'content.required' => 'the content field is required.',
            'content.string' => 'the content must be a string.',
            'user_id.required' => 'the user id field is required.',
        ];
    }
}
