<?php

namespace App\Services\News;

use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

/**
 * Class LocationService.
 */
class NewService
{

    public function index():Collection
    {
        return News::with('user','newsCategory')->get();
    }


    public function store(array $data)
    {

        $news = News::create($data);
        return $news;
    }

    public function update(int $id, array $data)
    {
        $news = News::findOrFail($id);
        $news->update($data);
        return $news;
    }


    public function delete(int $id)
    {
        $news = News::findOrFail($id);
        return $news->delete();
    }

    // public function show(int $id)
    // {
    //     $news = News::with('newsCategory','user')->findOrFail($id);
    //     return $news;
    // }
    public function show($identifier)
    {

        $news = News::with(['newsCategory', 'user'])
            ->when(is_numeric($identifier), function ($query) use ($identifier) {
                return $query->where('id', $identifier);
            }, function ($query) use ($identifier) {
                return $query->where('slug', $identifier);
            })
            ->firstOrFail();

        return $news;
    }
}