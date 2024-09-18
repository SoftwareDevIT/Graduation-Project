<?php

namespace App\Http\Controllers\Api\News;

use App\Http\Controllers\Controller;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Models\News;
use App\Services\News\NewService;
use Illuminate\Http\Request;

class NewController extends Controller
{
    protected $newservice;
    public function __construct(NewService $newservice)
    {
        $this->newservice = $newservice;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $new = $this->newservice->index();
        return $this->success($new, 'success');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        $file = $request->file('thumnail');
        $imageLink = $this->uploadImage($file);

        $new = $request->validated();
        $new['thumnail'] = $imageLink; 
        $new = $this->newservice->store($new);
        return $this->success($new, 'success');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $id,UpdateNewsRequest $request)
    {
        try {
            $file = $request->file('thumnail');
            if ($file) {
                $imageLink = $this->uploadImage($file);
            } else {
                $imageLink = null; // Hoặc xử lý khác nếu không có file
            }

            // Lấy dữ liệu đã được xác thực từ request
            $new = $request->validated();

            if ($imageLink) {
                $new['thumnail'] = $imageLink;
            }
            $new = $this->newservice->update($id,$new);
            return $this->success($new, 'success');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $new = $this->newservice->delete($id);
            return $this->success($new, 'success');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
