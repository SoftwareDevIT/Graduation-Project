<?php

namespace App\Services\New;

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
        if (isset($data['thumnail']) && $data['thumnail']->isValid()) {
            $path = $data['thumnail']->store('thumnails', 'public');
            $data['thumnail'] = $path;
        }
        $news = News::create($data);
        $news->thumnail_url = asset('storage/' . $news->thumnail);
    
        return $news;
    }

    public function update(int $id, array $data)
    {
        $news = News::findOrFail($id);

        if (isset($data['thumnail']) && $data['thumnail']->isValid()) {
            if ($news->thumnail && Storage::disk('public')->exists($news->thumnail)) {
                Storage::disk('public')->delete($news->thumnail);
            }
        $path = $data['thumnail']->store('thumnails', 'public');
        $data['thumnail'] = $path;
    }

    $news->update($data);

    $news->thumnail_url = asset('storage/' . $news->thumnail);

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
