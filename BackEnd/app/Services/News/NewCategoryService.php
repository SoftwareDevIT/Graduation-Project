<?php

namespace App\Services\News;

use App\Models\NewsCategory;

/**
 * Class LocationService.
 */
class NewCategoryService
{

    public function index()
    {
        return NewsCategory::all();
    }


    public function store(array $data)
    {
        $new_category = NewsCategory::create($data);
        return $new_category;
    }

    public function update(int $id, array $data)
    {
        $new_category = NewsCategory::findOrFail($id);
        $new_category->update($data);
        return $new_category;
    }


    public function delete(int $id)
    {
        $new_category = NewsCategory::findOrFail($id);
        return $new_category->delete();
    }
}
