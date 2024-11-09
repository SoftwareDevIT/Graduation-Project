<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreMovieRequest;
use App\Http\Requests\Movie\Update\UpdateMovieRequest;
use App\Models\Movie;
use App\Models\MovieCategory;
use App\Models\MovieCategoryInMovie;
use App\Models\News;
use App\Models\Showtime;
use App\Services\Movie\MovieService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use League\Flysystem\WhitespacePathNormalizer;
use Throwable;

class MovieController extends Controller
{
    protected $movieService;
    public function __construct(MovieService $movieService)
    {
        $this->movieService = $movieService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movie = $this->movieService->index();
        return $this->success($movie, 'success', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovieRequest $request)
    {
        try {
            $file = $request->file('poster');
            $movie = $request->validated();
            $movie['poster'] = $file ? $this->uploadImage($file) : null;

            DB::transaction(function () use ($movie, $request) {
                $movie = $this->movieService->store($movie);

                // Gắn các mối quan hệ
                $movie->movie_category()->sync($request->movie_category_id);
                $movie->actor()->sync($request->actor_id);
                $movie->director()->sync($request->director_id);
            });
            return $this->success($movie, 'Thêm thành công Movie');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $movie = $this->movieService->show($id);
            return $this->success($movie, 'Chi tiết phim ');
        } catch (Exception $e) {
            if ($e instanceof ModelNotFoundException) {
                return $this->notFound('Movie not found id = ' . $id, 404);
            }

            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovieRequest $request, string $id)
    {
        try {
            $file = $request->file('poster');
            $oldImgageActor  = $this->movieService->get($id);

            $imageLink =  $file ? $this->uploadImage($file) :  $oldImgageActor->poster;

            // Lấy dữ liệu đã được xác thực từ request
            $movie = $request->validated();
            $movie['poster'] = $imageLink;

            $movie = $this->movieService->update($id, $movie);

            $movie->movie_category()->sync($request->movie_category_id);
            $movie->actor()->sync($request->actor_id);
            $movie->director()->sync($request->director_id);

            return $this->success($movie, 'Cập nhập thành công');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $movie = $this->movieService->get($id);

            if ($movie) {
                $movie->actor()->detach();
                $movie->movie_category()->detach();
                $movie->director()->detach();
            }

            $this->movieService->delete($id);
            return $this->success('Xoá phim Thành Công', 'success', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    public function search($movie_name)
    {
        try {
            $movie = $this->movieService->getMovieByMovieName($movie_name);

            if ($movie->isEmpty()) {
                return $this->notFound('Không tìm thấy phim', 404);
            }
            return $this->success($movie, 'Phim theo tên tìm kiếm là:');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    public function movieByCategory($id)
    {
        try {
            $movies = MovieCategoryInMovie::where('movie_category_id', $id)->pluck('movie_id');
            $movie = Movie::whereIn('id', $movies)->get();

            if ($movie->isEmpty()) {
                return $this->error('Không có phim nào thuộc Category này', 404);
            }

            return $this->success($movie, 'Danh sách phim thuộc Category ', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    public function getUpcomingMovies()
    {
        try {
            $today = Carbon::now();
            $moviesByWeek = [];

            for ($i = 0; $i < 15; $i++) { // Lấy theo 15 tuần
                $startOfWeek = $today->copy()->addDays($i * 7);
                $endOfWeek = $startOfWeek->copy()->addDays(6);

                $movies = Movie::whereBetween('release_date', [$startOfWeek, $endOfWeek])->get();

                // Tuần nào có phim sẽ hiển thị
                if ($movies->isNotEmpty()) {
                    $moviesByWeek[] = [
                        'week' => $i + 1,
                        'start_date' => $startOfWeek->toDateString(),
                        'end_date' => $endOfWeek->toDateString(),
                        'movies' => $movies
                    ];
                }
            }

            return $this->success($moviesByWeek, 'Danh sách phim sắp chiếu: ', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    public function filterNewByMovie($id)
    {
        try {
            $new = News::Where('movie_id', $id)->get();

            if ($new->isEmpty()) {
                return $this->notFound('Không tìm thấy bài viết liên quan đến phim', 404);
            }

            return $this->success($new, 'Bài viết liên quan đến phim: ', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }
}
