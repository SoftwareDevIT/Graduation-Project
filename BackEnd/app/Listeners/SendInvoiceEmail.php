<?php

namespace App\Listeners;

use App\Events\InvoiceCreated;
use App\Mail\InvoiceMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendInvoiceEmail
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(InvoiceCreated $event)
    {
        // Ghi log thông tin khi listener được kích hoạt
        Log::info('SendInvoiceEmail Listener triggered', [
            'invoiceData' => $event->booking
        ]);
        // Gửi email
        Mail::to('kien18092004@gmail.com')->queue(new InvoiceMail($event->booking));
    }
}
