<?php

namespace App\Http\Controllers\Api\PayMethod;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StorePayMethodRequest;
use App\Http\Requests\Update\UpdatePayMethodRequest;
use Illuminate\Http\Request;
use App\Services\PayMethod\PayMethodService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PayMethodController extends Controller
{
    protected $paymethodService;

    public function __construct(PayMethodService $paymethodService)
    {
        $this->paymethodService = $paymethodService;
    }

    public function index()
    {
        $paymethod = $this->paymethodService->index();
        return $this->success($paymethod);
    }
    public function show($id)
    {
        try {
            $paymethod = $this->paymethodService->get($id);

            if (!$paymethod) {
                return response()->json(['error' => 'Paymethod not found'], 404);
            }

            return $this->success($paymethod);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StorePayMethodRequest $request)
    {
        $paymethod = $this->paymethodService->store($request->validated());
        return $this->success($paymethod);
    }

    public function update(UpdatePayMethodRequest $request, $id)
    {
        try {
            $paymethod = $this->paymethodService->update($id, $request->validated());
            return $this->success($paymethod);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->paymethodService->delete($id));
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}