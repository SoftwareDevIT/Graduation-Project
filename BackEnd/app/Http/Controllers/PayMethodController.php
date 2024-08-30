<?php

namespace App\Http\Controllers;

use App\Models\PayMethod;
use App\Http\Requests\StorePayMethodRequest;
use App\Http\Requests\UpdatePayMethodRequest;

class PayMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StorePayMethodRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PayMethod $payMethod)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PayMethod $payMethod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayMethodRequest $request, PayMethod $payMethod)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PayMethod $payMethod)
    {
        //
    }
}
