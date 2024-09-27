<?php

namespace App\Services\News;

use App\Models\News;
use Illuminate\Support\Facades\Storage;

/**
 * Class LocationService.
 */
class NewService
{

    public function index()
    {
        return News::all();
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

        if ($news->thumnail && Storage::disk('public')->exists($news->thumnail)) {
            Storage::disk('public')->delete($news->thumnail);
        }

        return$news->delete();
    }
}
