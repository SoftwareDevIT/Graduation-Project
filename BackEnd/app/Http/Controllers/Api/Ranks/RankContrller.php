<?php

namespace App\Http\Controllers\Api\Ranks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreRanksRequest;
use App\Http\Requests\Update\UpdateRanksRequest;
use App\Services\Ranks\RankService;
use Illuminate\Http\Request;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RankContrller extends Controller
{
    protected $rankService;

    public function __construct(RankService $rankService)
    {
        $this->rankService = $rankService;
    }

    public function index()
    {
        $paymethod = $this->rankService->index();
        return $this->success($paymethod);
    }
    public function show($id)
    {
        try {
            $paymethod = $this->rankService->get($id);


            return $this->success($paymethod);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StoreRanksRequest $request)
    {
        $paymethod = $this->rankService->store($request->validated());
        return $this->success($paymethod);
    }

    public function update(UpdateRanksRequest $request, $id)
    {
        try {
            $paymethod = $this->rankService->update($id, $request->validated());
            return $this->success($paymethod);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->rankService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}